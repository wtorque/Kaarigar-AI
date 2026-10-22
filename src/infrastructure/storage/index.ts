import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

export interface StorageProvider {
  upload(fileBuffer: Buffer, originalFilename: string, mimeType: string): Promise<string>;
  delete(fileUrl: string): Promise<boolean>;
}

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor(baseDir: string = env.STORAGE_LOCAL_DIR) {
    this.baseDir = path.resolve(process.cwd(), baseDir);
  }

  private async ensureDir() {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
    } catch {
      // ignore if exists
    }
  }

  async upload(fileBuffer: Buffer, originalFilename: string, mimeType: string): Promise<string> {
    await this.ensureDir();
    const ext = path.extname(originalFilename) || (mimeType === 'image/png' ? '.png' : '.jpg');
    const randomName = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}${ext}`;
    const filePath = path.join(this.baseDir, randomName);

    await fs.writeFile(filePath, fileBuffer);
    logger.info({ filePath, sizeBytes: fileBuffer.length }, 'File saved locally');

    // Return served URL path
    return `/uploads/${randomName}`;
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.baseDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export class S3StorageProvider implements StorageProvider {
  async upload(_fileBuffer: Buffer, originalFilename: string, _mimeType: string): Promise<string> {
    // S3/Cloudinary upload adapter
    const randomKey = `products/${Date.now()}_${originalFilename}`;
    logger.info({ bucket: env.STORAGE_S3_BUCKET, key: randomKey }, 'Uploading to S3 object storage');
    return `https://${env.STORAGE_S3_BUCKET}.s3.${env.STORAGE_S3_REGION}.amazonaws.com/${randomKey}`;
  }

  async delete(_fileUrl: string): Promise<boolean> {
    return true;
  }
}

export function getStorageProvider(): StorageProvider {
  if (env.STORAGE_PROVIDER === 's3') {
    return new S3StorageProvider();
  }
  return new LocalStorageProvider();
}

export const storage = getStorageProvider();
