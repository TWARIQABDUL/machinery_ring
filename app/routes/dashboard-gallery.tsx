import { useState } from "react";
import { Form, useActionData } from "react-router";
import pool from "../../db";
import { requireUserSession } from "../../db/session.server";
import { saveUploadedImage, deletePublicImage } from "../lib/uploads.server";
import Panel from "../components/admin/panel";
import StatusBadge from "../components/status-badge";
import DeleteButton from "../components/admin/delete-button";
import { TextField, SelectField, CheckboxField, btnPrimary, btnGhost, btnSm } from "../components/admin/field";
import type { Route } from "./+types/dashboard-gallery";

type GalleryRow = {
  id: number;
  image_path: string;
  caption: string | null;
  category: string | null;
  is_published: boolean;
  sort_order: number;
};

const CATEGORY_OPTIONS = [
  { value: "equipment", label: "Equipment" },
  { value: "training", label: "Training" },
  { value: "field_days", label: "Field days" },
  { value: "demonstration_farms", label: "Demonstration farms" },
];

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserSession(request);
  const { rows } = await pool.query<GalleryRow>("SELECT * FROM gallery_items ORDER BY sort_order, created_at DESC");
  return { photos: rows };
}

type ActionResult = { error: string } | { success: true } | undefined;

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  await requireUserSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const get = (name: string) => (formData.get(name)?.toString() ?? "").trim();

  if (intent === "delete") {
    const id = Number(get("id"));
    const { rows } = await pool.query("SELECT image_path FROM gallery_items WHERE id = $1", [id]);
    await pool.query("DELETE FROM gallery_items WHERE id = $1", [id]);
    if (rows[0]) await deletePublicImage(rows[0].image_path);
    return { success: true };
  }

  const caption = get("caption") || null;
  const category = get("category") || null;
  const isPublished = formData.get("is_published") ? true : false;
  const sortOrder = Number(get("sort_order")) || 0;
  const uploadedPath = await saveUploadedImage(formData.get("image"), "gallery");

  if (intent === "update") {
    const id = Number(get("id"));
    if (uploadedPath) {
      const { rows } = await pool.query("SELECT image_path FROM gallery_items WHERE id = $1", [id]);
      await pool.query(
        "UPDATE gallery_items SET image_path=$1, caption=$2, category=$3, is_published=$4, sort_order=$5 WHERE id=$6",
        [uploadedPath, caption, category, isPublished, sortOrder, id]
      );
      if (rows[0]) await deletePublicImage(rows[0].image_path);
    } else {
      await pool.query(
        "UPDATE gallery_items SET caption=$1, category=$2, is_published=$3, sort_order=$4 WHERE id=$5",
        [caption, category, isPublished, sortOrder, id]
      );
    }
    return { success: true };
  }

  if (!uploadedPath) return { error: "Please choose a photo to upload." };
  await pool.query(
    "INSERT INTO gallery_items (image_path, caption, category, is_published, sort_order) VALUES ($1,$2,$3,$4,$5)",
    [uploadedPath, caption, category, isPublished, sortOrder]
  );
  return { success: true };
}

export default function DashboardGallery({ loaderData }: Route.ComponentProps) {
  const { photos } = loaderData;
  const actionData = useActionData() as ActionResult;
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Gallery</h1>
        <p className="text-[14.5px] text-muted">Upload and manage the photos shown on the public Gallery page.</p>
      </div>

      {actionData && "error" in actionData && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{actionData.error}</p>
      )}

      <Panel title="Add a photo">
        <PhotoForm />
      </Panel>

      <Panel title={`All photos (${photos.length})`}>
        {photos.length === 0 ? (
          <p className="text-[14px] text-muted-2">No photos yet. Upload the first one above.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) =>
              editingId === photo.id ? (
                <div key={photo.id} className="rounded-xl border border-line p-4 sm:col-span-2 lg:col-span-3">
                  <PhotoForm photo={photo} onCancel={() => setEditingId(null)} />
                </div>
              ) : (
                <div key={photo.id} className="flex flex-col gap-2.5 rounded-xl border border-line p-3">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-brand-100">
                    <img src={photo.image_path} alt={photo.caption ?? ""} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {photo.category && (
                      <StatusBadge tone="neutral" size="sm">
                        {CATEGORY_OPTIONS.find((c) => c.value === photo.category)?.label ?? photo.category}
                      </StatusBadge>
                    )}
                    {!photo.is_published && (
                      <StatusBadge tone="amber" size="sm">
                        Unpublished
                      </StatusBadge>
                    )}
                  </div>
                  <p className="line-clamp-2 text-[13px] text-muted">{photo.caption || "No caption"}</p>
                  <div className="mt-auto flex items-center gap-2 pt-1">
                    <button type="button" onClick={() => setEditingId(photo.id)} className={btnSm}>
                      Edit
                    </button>
                    <Form method="post">
                      <input type="hidden" name="id" value={photo.id} />
                      <DeleteButton confirmText="Delete this photo? This cannot be undone." />
                    </Form>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}

function PhotoForm({ photo, onCancel }: { photo?: GalleryRow; onCancel?: () => void }) {
  return (
    <Form method="post" encType="multipart/form-data" className="flex flex-col gap-4">
      {photo && <input type="hidden" name="id" value={photo.id} />}
      <input type="hidden" name="intent" value={photo ? "update" : "create"} />

      <TextField
        label="Photo"
        name="image"
        type="file"
        accept="image/*"
        required={!photo}
        hint={photo ? "Leave blank to keep the current photo." : undefined}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField label="Category" name="category" defaultValue={photo?.category ?? ""}>
          <option value="">No category</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        <TextField label="Sort order" name="sort_order" type="number" defaultValue={photo?.sort_order ?? 0} hint="Lower numbers appear first." />
      </div>

      <TextField label="Caption" name="caption" defaultValue={photo?.caption ?? undefined} />

      <CheckboxField label="Published on the public Gallery page" name="is_published" defaultChecked={photo?.is_published ?? true} />

      <div className="flex gap-3">
        <button type="submit" className={btnPrimary}>
          {photo ? "Save changes" : "Add photo"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={btnGhost}>
            Cancel
          </button>
        )}
      </div>
    </Form>
  );
}
