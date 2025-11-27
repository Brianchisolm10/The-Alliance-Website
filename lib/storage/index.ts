/**
 * File Storage Service
 * 
 * Handles uploading and retrieving files from storage
 * Supports both Vercel Blob and AWS S3
 */

import { put, del } from '@vercel/blob';

/**
 * Storage configuration
 */
const STORAGE_TYPE = process.env.BLOB_READ_WRITE_TOKEN ? 'vercel-blob' : 'aws-s3';

/**
 * Upload a file buffer to storage
 */
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string = 'application/pdf'
): Promise<string> {
  try {
    if (STORAGE_TYPE === 'vercel-blob') {
      return await uploadToVercelBlob(buffer, filename, contentType);
    } else {
      return await uploadToS3(buffer, filename, contentType);
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    if (STORAGE_TYPE === 'vercel-blob') {
      await deleteFromVercelBlob(fileUrl);
    } else {
      await deleteFromS3(fileUrl);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error(
      `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Upload to Vercel Blob
 */
async function uploadToVercelBlob(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }

  const blob = await put(filename, buffer, {
    access: 'public',
    contentType,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return blob.url;
}

/**
 * Delete from Vercel Blob
 */
async function deleteFromVercelBlob(fileUrl: string): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }

  await del(fileUrl, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

/**
 * Upload to AWS S3
 */
async function uploadToS3(
  _buffer: Buffer,
  _filename: string,
  _contentType: string
): Promise<string> {
  // Check if AWS credentials are configured
  if (
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.AWS_REGION ||
    !process.env.AWS_S3_BUCKET
  ) {
    throw new Error('AWS S3 credentials are not fully configured');
  }

  // For now, throw an error indicating S3 support needs to be implemented
  // This can be implemented when needed using @aws-sdk/client-s3
  throw new Error(
    'AWS S3 storage is not yet implemented. Please use Vercel Blob or implement S3 support.'
  );
}

/**
 * Delete from AWS S3
 */
async function deleteFromS3(_fileUrl: string): Promise<void> {
  throw new Error(
    'AWS S3 storage is not yet implemented. Please use Vercel Blob or implement S3 support.'
  );
}

/**
 * Get storage type being used
 */
export function getStorageType(): 'vercel-blob' | 'aws-s3' | 'none' {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return 'vercel-blob';
  } else if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.AWS_S3_BUCKET
  ) {
    return 'aws-s3';
  }
  return 'none';
}

/**
 * Check if storage is configured
 */
export function isStorageConfigured(): boolean {
  return getStorageType() !== 'none';
}
