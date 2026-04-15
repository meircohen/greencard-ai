import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const getS3Client = () => {
  const endpoint = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;

  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  });
};

export interface UploadResult {
  url: string;
  key: string;
}

export async function uploadDocument(
  file: Buffer | Uint8Array,
  caseId: string,
  documentType: string,
  filename: string,
): Promise<UploadResult> {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('R2_BUCKET_NAME environment variable is not set');
  }

  const timestamp = Date.now();
  const sanitizedFileName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `cases/${caseId}/${documentType}/${timestamp}-${sanitizedFileName}`;

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
  });

  try {
    await client.send(command);

    const publicUrl = `${process.env.R2_PUBLIC_URL || `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`}/${key}`;

    return {
      url: publicUrl,
      key,
    };
  } catch (error) {
    console.error('Failed to upload document to R2:', error);
    throw new Error('Failed to upload document to storage');
  }
}

export async function deleteDocument(key: string): Promise<void> {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('R2_BUCKET_NAME environment variable is not set');
  }

  const client = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    await client.send(command);
  } catch (error) {
    console.error('Failed to delete document from R2:', error);
    throw new Error('Failed to delete document from storage');
  }
}

export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600,
): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('R2_BUCKET_NAME environment variable is not set');
  }

  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(client, command, {
      expiresIn,
    });
    return signedUrl;
  } catch (error) {
    console.error('Failed to generate signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
}
