import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { minioClient, BUCKET, ensureBucket, publicUrlFor } from "./storage.server";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/**
 * Saves an uploaded image file (from a multipart form field) into the MinIO
 * media bucket, under <subdir>/<uuid>.<ext>, and returns its public URL.
 * Returns null if no file was submitted for that field.
 */
export async function saveUploadedImage(file: FormDataEntryValue | null, subdir: string): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;

  await ensureBucket();

  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const objectName = `${subdir}/${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await minioClient.putObject(BUCKET, objectName, buffer, buffer.length, {
    "Content-Type": file.type || "image/jpeg",
  });

  return publicUrlFor(objectName);
}

/**
 * Best-effort removal of a previously saved image, given whatever URL/path is
 * stored for it. Handles both MinIO object URLs (current uploads) and the
 * older "/images/<subdir>/<file>" local paths (from before MinIO was added),
 * so photos uploaded either way get cleaned up when replaced or deleted.
 */
export async function deletePublicImage(imagePath: string | null | undefined) {
  if (!imagePath) return;

  const minioPrefix = publicUrlFor("");
  if (imagePath.startsWith(minioPrefix)) {
    const objectName = imagePath.slice(minioPrefix.length);
    try {
      await minioClient.removeObject(BUCKET, objectName);
    } catch {
      // already gone — fine
    }
    return;
  }

  if (imagePath.startsWith("/images/")) {
    try {
      await unlink(path.join(PUBLIC_DIR, imagePath));
    } catch {
      // already gone, or never existed on disk — fine to ignore
    }
  }
}
