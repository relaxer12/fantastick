/**
 * upload-originals-to-r2.mjs
 *
 * Uploads full-resolution originals from "Photos Vol 2" to R2 under
 * the `originals/` prefix. Mirrors the existing key structure:
 *
 *   Local: Portfolio Upload/35mm/35mm-1-2.jpg
 *   R2:    originals/35mm/35mm-1-2.jpg
 *
 *   Local: Portfolio Upload/Digital/X2D_0001.jpg
 *   R2:    originals/digital/X2D_0001.jpg
 *
 *   Local: Portfolio Upload/MF/MF-1.jpg
 *   R2:    originals/mf/MF-1.jpg
 *
 * After upload, deletes stale variants/ (generated from compressed sources).
 * Skips files already in R2 with identical size.
 *
 * Usage:
 *   node scripts/upload-originals-to-r2.mjs [--dry-run]
 */

import { S3Client, PutObjectCommand, HeadObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { createReadStream, statSync, readdirSync } from 'fs';
import { join } from 'path';

const BUCKET   = 'fantastick-photos';
const ENDPOINT = 'https://1fda716bf18ae73298490f5f171c4164.r2.cloudflarestorage.com';
const ACCESS   = '80873fe20cf3a09ea6d7ce14793924af';
const SECRET   = '3373cae5f6d8ddc0db74c46a1edcfcb8a7d1c976b271645fce5eca65890a0056';
const CONCURRENCY = 3;

const SRC_ROOT = '/Volumes/Photos Vol 2/Portfolio Upload';

// Local folder → R2 originals prefix mapping
const FOLDER_MAP = {
  '35mm':    'originals/35mm',
  'Digital': 'originals/digital',
  'MF':      'originals/mf',
};

const DRY_RUN = process.argv.includes('--dry-run');

const s3 = new S3Client({
  region: 'auto',
  endpoint: ENDPOINT,
  credentials: { accessKeyId: ACCESS, secretAccessKey: SECRET },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mb = (b) => (b / 1024 / 1024).toFixed(1) + 'MB';

async function headExists(key) {
  try {
    const r = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return r.ContentLength ?? 0;
  } catch { return null; }
}

async function upload(key, localPath, size) {
  const stream = createReadStream(localPath);
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: stream,
    ContentLength: size,
    ContentType: 'image/jpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

// ─── Build file list ──────────────────────────────────────────────────────────
const files = [];
for (const [folder, r2Prefix] of Object.entries(FOLDER_MAP)) {
  const dir = join(SRC_ROOT, folder);
  for (const name of readdirSync(dir).filter(f => f.match(/\.(jpe?g|png)$/i))) {
    const localPath = join(dir, name);
    const size = statSync(localPath).size;
    const r2Key = `${r2Prefix}/${name}`;
    files.push({ localPath, r2Key, size, name });
  }
}

const totalSize = files.reduce((s, f) => s + f.size, 0);
console.log(`Found ${files.length} originals — ${mb(totalSize)} total`);
if (DRY_RUN) console.log('DRY RUN — no uploads\n');
else console.log('Uploading to originals/ prefix...\n');

// ─── Concurrency pool ─────────────────────────────────────────────────────────
async function pool(items, fn, concurrency) {
  let i = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < items.length) {
      const item = items[i++];
      await fn(item);
    }
  });
  await Promise.all(workers);
}

let uploaded = 0, skipped = 0, errors = 0;

await pool(files, async ({ localPath, r2Key, size, name }) => {
  try {
    if (DRY_RUN) {
      console.log(`[DRY] ${r2Key}  ${mb(size)}`);
      return;
    }
    const existing = await headExists(r2Key);
    if (existing === size) {
      console.log(`[SKIP] ${r2Key}  already uploaded (${mb(size)})`);
      skipped++;
      return;
    }
    await upload(r2Key, localPath, size);
    console.log(`[OK]  ${r2Key}  ${mb(size)}`);
    uploaded++;
  } catch (e) {
    console.error(`[ERR] ${r2Key}  ${e.message}`);
    errors++;
  }
}, CONCURRENCY);

// ─── Delete stale variants/ ───────────────────────────────────────────────────
if (!DRY_RUN) {
  console.log('\nCleaning up stale variants/ (generated from compressed sources)...');
  let token, deleted = 0;
  do {
    const r = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET, Prefix: 'variants/', ContinuationToken: token,
    }));
    const keys = (r.Contents ?? []).map(o => ({ Key: o.Key }));
    if (keys.length > 0) {
      await s3.send(new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: keys } }));
      deleted += keys.length;
    }
    token = r.NextContinuationToken;
  } while (token);
  console.log(`Deleted ${deleted} stale variant(s).`);
}

console.log(`\nDone. uploaded=${uploaded} skipped=${skipped} errors=${errors}`);
