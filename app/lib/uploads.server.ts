import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/**
 * Saves an uploaded image file (from a multipart form field) under
 * public/images/<subdir>/ and returns its public path, e.g. "/images/gallery/<uuid>.jpg".
 * Returns null if no file was submitted for that field.
 */
export async function saveUploadedImage(file: FormDataEntryValue | null, subdir: string): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(PUBLIC_DIR, "images", subdir);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return `/images/${subdir}/${filename}`;
}

/** Best-effort removal of a previously saved public image path. Ignores files that are already gone. */
export async function deletePublicImage(publicPath: string | null | undefined) {
  if (!publicPath || !publicPath.startsWith("/images/")) return;
  try {
    await unlink(path.join(PUBLIC_DIR, publicPath));
  } catch {
    // already gone, or never existed on disk — fine to ignore
  }
}
