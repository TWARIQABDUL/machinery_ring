import { Client as MinioClient } from "minio";
import dotenv from "dotenv";
dotenv.config({ override: true, quiet: true });

const endPoint = process.env.MINIO_ENDPOINT || "localhost";
const port = Number(process.env.MINIO_PORT) || 9000;
const useSSL = process.env.MINIO_USE_SSL === "true";

export const BUCKET = process.env.MINIO_BUCKET || "mrrwanda-media";

export const minioClient = new MinioClient({
  endPoint,
  port,
  useSSL,
  accessKey: process.env.MINIO_ROOT_USER || "mrrwanda",
  secretKey: process.env.MINIO_ROOT_PASSWORD || "devpassword123",
});

let bucketReady: Promise<void> | null = null;

/**
 * Makes sure the media bucket exists and allows anonymous reads (uploads are
 * admin-only, but the resulting photos need to be viewable on the public
 * site without signed URLs). Runs the check once per server process.
 */
export function ensureBucket(): Promise<void> {
  if (!bucketReady) {
    bucketReady = (async () => {
      const exists = await minioClient.bucketExists(BUCKET).catch(() => false);
      if (!exists) {
        await minioClient.makeBucket(BUCKET);
      }
      await minioClient.setBucketPolicy(
        BUCKET,
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: { AWS: ["*"] },
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${BUCKET}/*`],
            },
          ],
        })
      );
    })();
  }
  return bucketReady;
}

/** The URL an uploaded object can be viewed at directly, since the bucket is anonymous-read. */
export function publicUrlFor(objectName: string): string {
  const base = process.env.MINIO_PUBLIC_URL || `http://${endPoint}:${port}`;
  return `${base}/${BUCKET}/${objectName}`;
}
