import crypto from 'crypto';
import sharp from 'sharp';
import { S3Client, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import type { CropMode, PrintSize } from './pricing';
import { sizeDimensions } from './pricing';
import { r2Url } from './r2';

const R2_BUCKET = process.env.R2_BUCKET;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_PUBLIC_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-426ed2c6f024444c8b80fb544d13a890.r2.dev';

function getR2Client() {
  if (!R2_BUCKET || !R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 env vars missing for order image processing');
  }

  return new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

function targetAspectForImage(size: PrintSize): number {
  const { width, height } = sizeDimensions[size];
  // Respect selected orientation exactly (landscape or portrait).
  return width / height;
}

export interface PreparedOrderImage {
  imageUrl: string;
  imageAspectRatio: number;
  wasTransformed: boolean;
}

/**
 * Ensures order image matches selected print ratio.
 * - fill: center-crop to exact target ratio
 * - fit:  pad with white border to exact target ratio
 */
export async function prepareOrderImage(
  photoPublicId: string,
  size: PrintSize,
  cropMode: CropMode,
): Promise<PreparedOrderImage> {
  const originalUrl = r2Url(photoPublicId);

  // fetch original image
  const res = await fetch(originalUrl);
  if (!res.ok) throw new Error(`Failed to fetch original image: ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());

  const meta = await sharp(input).metadata();
  if (!meta.width || !meta.height) {
    throw new Error('Could not read image dimensions');
  }

  const srcW = meta.width;
  const srcH = meta.height;
  const srcAspect = srcW / srcH;
  const targetAspect = targetAspectForImage(size);

  const diff = Math.abs(srcAspect - targetAspect) / Math.max(srcAspect, targetAspect);

  // already matches target ratio closely enough
  if (diff <= 0.01) {
    return {
      imageUrl: originalUrl,
      imageAspectRatio: srcAspect,
      wasTransformed: false,
    };
  }

  // deterministic key for cacheable transformed variants
  const keyHash = crypto
    .createHash('sha1')
    .update(`${photoPublicId}|${size}|${cropMode}|${srcW}x${srcH}`)
    .digest('hex')
    .slice(0, 12);

  const variantKey = `variants/${photoPublicId.replaceAll('/', '__')}/${size}/${cropMode}-${keyHash}.jpg`;
  const variantUrl = `${R2_PUBLIC_BASE}/${variantKey}`;

  const s3 = getR2Client();

  // return existing variant if present
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET!, Key: variantKey }));
    return {
      imageUrl: variantUrl,
      imageAspectRatio: targetAspect,
      wasTransformed: true,
    };
  } catch {
    // continue to generate
  }

  let out: Buffer;

  if (cropMode === 'fill') {
    if (srcAspect > targetAspect) {
      // too wide -> crop width
      const newW = Math.round(srcH * targetAspect);
      const left = Math.floor((srcW - newW) / 2);
      out = await sharp(input)
        .extract({ left, top: 0, width: newW, height: srcH })
        .jpeg({ quality: 95 })
        .toBuffer();
    } else {
      // too tall -> crop height
      const newH = Math.round(srcW / targetAspect);
      const top = Math.floor((srcH - newH) / 2);
      out = await sharp(input)
        .extract({ left: 0, top, width: srcW, height: newH })
        .jpeg({ quality: 95 })
        .toBuffer();
    }
  } else {
    // fit mode: add white padding to hit target ratio
    if (srcAspect > targetAspect) {
      // too wide -> add height
      const canvasH = Math.round(srcW / targetAspect);
      const padY = Math.floor((canvasH - srcH) / 2);
      out = await sharp({
        create: {
          width: srcW,
          height: canvasH,
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      })
        .composite([{ input, top: padY, left: 0 }])
        .jpeg({ quality: 95 })
        .toBuffer();
    } else {
      // too tall -> add width
      const canvasW = Math.round(srcH * targetAspect);
      const padX = Math.floor((canvasW - srcW) / 2);
      out = await sharp({
        create: {
          width: canvasW,
          height: srcH,
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      })
        .composite([{ input, top: 0, left: padX }])
        .jpeg({ quality: 95 })
        .toBuffer();
    }
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET!,
      Key: variantKey,
      Body: out,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return {
    imageUrl: variantUrl,
    imageAspectRatio: targetAspect,
    wasTransformed: true,
  };
}
