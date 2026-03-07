/**
 * compress-r2-photos.mjs
 *
 * Downloads every photo from R2, recompresses to max 3000px JPEG @85%,
 * and re-uploads in-place. Runs 4 concurrent workers.
 *
 * Usage:
 *   node scripts/compress-r2-photos.mjs [--dry-run] [--prefix digital/]
 *
 * Flags:
 *   --dry-run   Print before/after estimates without uploading
 *   --prefix X  Only process keys under prefix X (e.g. "digital/")
 */

import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { readFileSync } from 'fs';

// ─── Config ──────────────────────────────────────────────────────────────────
const BUCKET   = 'fantastick-photos';
const ENDPOINT = 'https://1fda716bf18ae73298490f5f171c4164.r2.cloudflarestorage.com';
const ACCESS   = '80873fe20cf3a09ea6d7ce14793924af';
const SECRET   = '3373cae5f6d8ddc0db74c46a1edcfcb8a7d1c976b271645fce5eca65890a0056';

const MAX_PX      = 3000;   // longest edge
const JPEG_Q      = 85;     // quality
const CONCURRENCY = 4;

const args     = process.argv.slice(2);
const DRY_RUN  = args.includes('--dry-run');
const prefixArg = args.find((_, i) => args[i - 1] === '--prefix') ?? null;

// ─── S3 client ───────────────────────────────────────────────────────────────
const s3 = new S3Client({
  region: 'auto',
  endpoint: ENDPOINT,
  credentials: { accessKeyId: ACCESS, secretAccessKey: SECRET },
});

// ─── List all objects ─────────────────────────────────────────────────────────
async function listAll(prefix = '') {
  const keys = [];
  let token;
  do {
    const r = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET, Prefix: prefix, ContinuationToken: token,
    }));
    for (const obj of r.Contents ?? []) {
      if (obj.Size > 0 && obj.Key?.match(/\.(jpe?g|png|webp)$/i)) {
        keys.push({ key: obj.Key, size: obj.Size });
      }
    }
    token = r.NextContinuationToken;
  } while (token);
  return keys;
}

// ─── Download object ──────────────────────────────────────────────────────────
async function download(key) {
  const r = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const chunks = [];
  for await (const chunk of r.Body) chunks.push(chunk);
  return Buffer.concat(chunks);
}

// ─── Compress ─────────────────────────────────────────────────────────────────
async function compress(buf) {
  const meta = await sharp(buf).metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);

  // Already small enough — keep as-is (just normalise to JPEG)
  const resizeOpts = longest > MAX_PX
    ? { width: meta.width > meta.height ? MAX_PX : undefined,
        height: meta.height >= meta.width ? MAX_PX : undefined,
        withoutEnlargement: true }
    : {};

  return sharp(buf)
    .resize(resizeOpts)
    .jpeg({ quality: JPEG_Q, mozjpeg: true })
    .toBuffer();
}

// ─── Upload ───────────────────────────────────────────────────────────────────
async function upload(key, buf) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET, Key: key,
    Body: buf,
    ContentType: 'image/jpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

// ─── Worker ───────────────────────────────────────────────────────────────────
async function processKey({ key, size }) {
  const mb = (b) => (b / 1024 / 1024).toFixed(1) + 'MB';
  try {
    const src = await download(key);
    const out = await compress(src);
    const ratio = ((1 - out.length / src.length) * 100).toFixed(0);

    if (DRY_RUN) {
      console.log(`[DRY] ${key}  ${mb(src.length)} → ${mb(out.length)} (−${ratio}%)`);
    } else {
      if (out.length >= src.length) {
        console.log(`[SKIP] ${key}  already optimal (${mb(src.length)})`);
        return;
      }
      await upload(key, out);
      console.log(`[OK]  ${key}  ${mb(src.length)} → ${mb(out.length)} (−${ratio}%)`);
    }
  } catch (e) {
    console.error(`[ERR] ${key}  ${e.message}`);
  }
}

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

// ─── Main ─────────────────────────────────────────────────────────────────────
const keys = await listAll(prefixArg ?? '');
console.log(`Found ${keys.length} photos${prefixArg ? ` under ${prefixArg}` : ''}. DRY_RUN=${DRY_RUN}`);

const totalBefore = keys.reduce((s, k) => s + k.size, 0);
console.log(`Total source size: ${(totalBefore / 1024 / 1024).toFixed(0)}MB\n`);

await pool(keys, processKey, CONCURRENCY);
console.log('\nDone.');
