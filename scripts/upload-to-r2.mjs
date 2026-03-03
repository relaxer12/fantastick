/**
 * upload-to-r2.mjs
 * Batch upload photos from a local directory to Cloudflare R2
 *
 * Usage:
 *   node scripts/upload-to-r2.mjs <source-dir> <r2-folder>
 *
 * Examples:
 *   node scripts/upload-to-r2.mjs "/Volumes/Photos Vol 2/Portfolio Upload/35mm" 35mm
 *   node scripts/upload-to-r2.mjs "/Volumes/Photos Vol 2/Portfolio Upload/MF" mf
 */

import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

// ─── Config ──────────────────────────────────────────────────────────────────
const ENDPOINT  = 'https://1fda716bf18ae73298490f5f171c4164.r2.cloudflarestorage.com';
const BUCKET    = 'fantastick-photos';
const ACCESS_KEY = '80873fe20cf3a09ea6d7ce14793924af';
const SECRET_KEY = '3373cae5f6d8ddc0db74c46a1edcfcb8a7d1c976b271645fce5eca65890a0056';

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif']);

// ─── S3 Client ───────────────────────────────────────────────────────────────
const s3 = new S3Client({
  region: 'auto',
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getMimeType(ext) {
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.tiff': 'image/tiff',
    '.tif': 'image/tiff',
  };
  return map[ext.toLowerCase()] ?? 'application/octet-stream';
}

async function fileExistsInR2(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)}MB`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const [,, sourceDir, r2Folder] = process.argv;

if (!sourceDir || !r2Folder) {
  console.error('Usage: node scripts/upload-to-r2.mjs <source-dir> <r2-folder>');
  process.exit(1);
}

const files = readdirSync(sourceDir)
  .filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
  .sort();

console.log(`\n📁 Source:  ${sourceDir}`);
console.log(`☁️  Bucket:  ${BUCKET}/${r2Folder}`);
console.log(`🖼️  Files:   ${files.length} images found\n`);

let uploaded = 0, skipped = 0, failed = 0;

for (const file of files) {
  const filePath = join(sourceDir, file);
  const key = `${r2Folder}/${file}`;
  const size = statSync(filePath).size;

  // Skip already uploaded files (resumable)
  if (await fileExistsInR2(key)) {
    console.log(`⏭️  SKIP    ${file} (already uploaded)`);
    skipped++;
    continue;
  }

  try {
    const body = readFileSync(filePath);
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: getMimeType(extname(file)),
      },
    });

    process.stdout.write(`⬆️  UPLOAD  ${file} (${formatBytes(size)}) ... `);
    await upload.done();
    console.log('✅');
    uploaded++;
  } catch (err) {
    console.log(`❌ FAILED`);
    console.error(`   Error: ${err.message}`);
    failed++;
  }
}

console.log(`\n─────────────────────────────────`);
console.log(`✅ Uploaded: ${uploaded}`);
console.log(`⏭️  Skipped:  ${skipped}`);
console.log(`❌ Failed:   ${failed}`);
console.log(`─────────────────────────────────\n`);
