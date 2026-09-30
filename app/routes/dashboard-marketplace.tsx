import { useEffect, useState } from "react";
import { Form, useActionData } from "react-router";
import pool from "../../db";
import { requireUserSession } from "../../db/session.server";
import { slugify } from "../lib/slugify";
import { saveUploadedFiles, deletePublicImage, type UploadedMedia } from "../lib/uploads.server";
import Panel from "../components/admin/panel";
import StatusBadge from "../components/status-badge";
import DeleteButton from "../components/admin/delete-button";
import MediaPicker from "../components/admin/media-picker";
import {
  TextField,
  TextAreaField,
  SelectField,
  CheckboxField,
  btnPrimary,
  btnGhost,
  btnSm,
} from "../components/admin/field";
import type { Route } from "./+types/dashboard-marketplace";

const CATEGORY_OPTIONS = [
  { value: "equipment", label: "Equipment" },
  { value: "spare_parts", label: "Spare parts" },
  { value: "inputs", label: "Inputs" },
  { value: "other", label: "Other" },
];

type ItemRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  condition: "new" | "used" | null;
  price: string | null;
  price_unit: string | null;
  image_path: string | null;
  status: "in_stock" | "out_of_stock";
  is_published: boolean;
  sort_order: number;
};

type MediaRow = {
  id: number;
  item_id: number;
  media_type: "image" | "video";
  media_path: string;
  is_primary: boolean;
  sort_order: number;
};

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserSession(request);
  const [{ rows: items }, { rows: media }] = await Promise.all([
    pool.query<ItemRow>("SELECT * FROM marketplace_items ORDER BY sort_order, name"),
    pool.query<MediaRow>("SELECT * FROM marketplace_item_media ORDER BY item_id, sort_order, id"),
  ]);

  const mediaByItem: Record<number, MediaRow[]> = {};
  for (const row of media) {
    (mediaByItem[row.item_id] ??= []).push(row);
  }

  return { items, mediaByItem };
}

type ActionResult = { error: string } | { success: true } | undefined;

/**
 * Inserts a batch of uploaded files as media rows for an item, and works out
 * which (if any) becomes the new main image: the one the admin clicked in the
 * picker, or — only if the item doesn't already have a main image — the
 * first photo in the batch. Keeps marketplace_items.image_path in sync
 * either way, since the listing page and cards read that column directly.
 */
async function insertMediaBatch(itemId: number, uploaded: UploadedMedia[], primaryIndex: number | null) {
  if (uploaded.length === 0) return;

  const { rows: sortRows } = await pool.query(
    "SELECT COALESCE(MAX(sort_order), -1) AS max_sort FROM marketplace_item_media WHERE item_id = $1",
    [itemId]
  );
  let nextSort = Number(sortRows[0].max_sort) + 1;

  const { rows: existingPrimary } = await pool.query(
    "SELECT id FROM marketplace_item_media WHERE item_id = $1 AND is_primary = true",
    [itemId]
  );
  const hasPrimary = existingPrimary.length > 0;

  const chosenIsValid = primaryIndex !== null && uploaded[primaryIndex]?.type === "image";
  if (chosenIsValid) {
    await pool.query("UPDATE marketplace_item_media SET is_primary = false WHERE item_id = $1", [itemId]);
  }

  let newPrimaryPath: string | null = null;

  for (let i = 0; i < uploaded.length; i++) {
    const media = uploaded[i];
    const isChosen = chosenIsValid && i === primaryIndex;
    const isFallback = !chosenIsValid && !hasPrimary && media.type === "image" && newPrimaryPath === null;
    const makePrimary = isChosen || isFallback;

    await pool.query(
      "INSERT INTO marketplace_item_media (item_id, media_type, media_path, is_primary, sort_order) VALUES ($1,$2,$3,$4,$5)",
      [itemId, media.type, media.path, makePrimary, nextSort]
    );
    if (makePrimary) newPrimaryPath = media.path;
    nextSort++;
  }

  if (newPrimaryPath) {
    await pool.query("UPDATE marketplace_items SET image_path = $1 WHERE id = $2", [newPrimaryPath, itemId]);
  }
}

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  await requireUserSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const get = (name: string) => (formData.get(name)?.toString() ?? "").trim();

  if (intent === "delete") {
    const id = Number(get("id"));
    const [{ rows: mediaRows }, { rows: itemRows }] = await Promise.all([
      pool.query("SELECT media_path FROM marketplace_item_media WHERE item_id = $1", [id]),
      pool.query("SELECT image_path FROM marketplace_items WHERE id = $1", [id]),
    ]);
    await pool.query("DELETE FROM marketplace_items WHERE id = $1", [id]); // cascades media rows
    for (const row of mediaRows) await deletePublicImage(row.media_path);
    if (itemRows[0]?.image_path) await deletePublicImage(itemRows[0].image_path);
    return { success: true };
  }

  if (intent === "delete_media") {
    const mediaId = Number(get("media_id"));
    const itemId = Number(get("item_id"));
    const { rows } = await pool.query("SELECT media_path, media_type, is_primary FROM marketplace_item_media WHERE id = $1", [mediaId]);
    const media = rows[0];
    await pool.query("DELETE FROM marketplace_item_media WHERE id = $1", [mediaId]);
    if (media) await deletePublicImage(media.media_path);

    if (media?.is_primary) {
      const { rows: nextRows } = await pool.query(
        "SELECT id, media_path FROM marketplace_item_media WHERE item_id = $1 AND media_type = 'image' ORDER BY sort_order, id LIMIT 1",
        [itemId]
      );
      const next = nextRows[0];
      if (next) {
        await pool.query("UPDATE marketplace_item_media SET is_primary = true WHERE id = $1", [next.id]);
        await pool.query("UPDATE marketplace_items SET image_path = $1 WHERE id = $2", [next.media_path, itemId]);
      } else {
        await pool.query("UPDATE marketplace_items SET image_path = NULL WHERE id = $1", [itemId]);
      }
    }
    return { success: true };
  }

  if (intent === "set_primary_media") {
    const mediaId = Number(get("media_id"));
    const itemId = Number(get("item_id"));
    const { rows } = await pool.query(
      "SELECT media_path, media_type FROM marketplace_item_media WHERE id = $1 AND item_id = $2",
      [mediaId, itemId]
    );
    const media = rows[0];
    if (media && media.media_type === "image") {
      await pool.query("UPDATE marketplace_item_media SET is_primary = false WHERE item_id = $1", [itemId]);
      await pool.query("UPDATE marketplace_item_media SET is_primary = true WHERE id = $1", [mediaId]);
      await pool.query("UPDATE marketplace_items SET image_path = $1 WHERE id = $2", [media.media_path, itemId]);
    }
    return { success: true };
  }

  if (intent === "add_media") {
    const itemId = Number(get("item_id"));
    const files = formData.getAll("media");
    const primaryIndexRaw = get("primary_index");
    const primaryIndex = primaryIndexRaw ? Number(primaryIndexRaw) : null;
    const uploaded = await saveUploadedFiles(files, "marketplace");
    if (uploaded.length === 0) return { error: "Please choose at least one photo or video to add." };
    await insertMediaBatch(itemId, uploaded, primaryIndex);
    return { success: true };
  }

  const name = get("name");
  if (!name) return { error: "Please enter an item name." };
  const slug = get("slug") || slugify(name);
  const description = get("description") || null;
  const category = get("category") || null;
  const condition = get("condition") || null;
  const priceRaw = get("price");
  const price = priceRaw ? Number(priceRaw) : null;
  const priceUnit = get("price_unit") || null;
  const status = get("status") === "out_of_stock" ? "out_of_stock" : "in_stock";
  const isPublished = formData.get("is_published") ? true : false;
  const sortOrder = Number(get("sort_order")) || 0;

  try {
    if (intent === "update") {
      const id = Number(get("id"));
      await pool.query(
        `UPDATE marketplace_items
         SET name=$1, slug=$2, description=$3, category=$4, condition=$5, price=$6, price_unit=$7, status=$8, is_published=$9, sort_order=$10, updated_at=NOW()
         WHERE id=$11`,
        [name, slug, description, category, condition, price, priceUnit, status, isPublished, sortOrder, id]
      );
    } else {
      const { rows } = await pool.query<{ id: number }>(
        `INSERT INTO marketplace_items (name, slug, description, category, condition, price, price_unit, status, is_published, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
        [name, slug, description, category, condition, price, priceUnit, status, isPublished, sortOrder]
      );
      const newId = rows[0].id;
      const files = formData.getAll("media");
      const primaryIndexRaw = get("primary_index");
      const primaryIndex = primaryIndexRaw ? Number(primaryIndexRaw) : null;
      const uploaded = await saveUploadedFiles(files, "marketplace");
      await insertMediaBatch(newId, uploaded, primaryIndex);
    }
  } catch (err: any) {
    if (err?.code === "23505") return { error: `The slug "${slug}" is already used by another item.` };
    throw err;
  }

  return { success: true };
}

function formatPrice(row: ItemRow) {
  if (!row.price) return "price not set";
  return `RWF ${Number(row.price).toLocaleString()}${row.price_unit ? ` ${row.price_unit}` : ""}`;
}

export default function DashboardMarketplace({ loaderData }: Route.ComponentProps) {
  const { items, mediaByItem } = loaderData;
  const actionData = useActionData() as ActionResult;
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      setShowCreateForm(false);
    }
  }, [actionData]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Marketplace</h1>
        <p className="text-[14.5px] text-muted">Equipment, spare parts and inputs shown on the public Marketplace page.</p>
      </div>

      {actionData && "error" in actionData && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{actionData.error}</p>
      )}

      <Panel
        title={`All items (${items.length})`}
        action={
          !showCreateForm && (
            <button type="button" onClick={() => setShowCreateForm(true)} className={btnPrimary}>
              + Add item
            </button>
          )
        }
      >
        {showCreateForm && (
          <div className="mb-6 border-b border-line pb-6">
            <ItemForm onCancel={() => setShowCreateForm(false)} />
          </div>
        )}

        {items.length === 0 && !showCreateForm ? (
          <p className="text-[14px] text-muted-2">No items yet — click "Add item" above.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {items.map((item) =>
              editingId === item.id ? (
                <div key={item.id} className="flex flex-col gap-6 py-5">
                  <ItemForm item={item} onCancel={() => setEditingId(null)} />
                  <MediaManager item={item} media={mediaByItem[item.id] ?? []} />
                </div>
              ) : (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="flex items-center gap-3.5">
                    {item.image_path ? (
                      <img src={item.image_path} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <div className="h-12 w-16 shrink-0 rounded-lg bg-[#F7F9F7]" />
                    )}
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[15px] font-bold text-ink">{item.name}</span>
                        <StatusBadge tone={item.status === "in_stock" ? "solid" : "neutral"} size="sm">
                          {item.status === "in_stock" ? "In stock" : "Out of stock"}
                        </StatusBadge>
                        {!item.is_published && (
                          <StatusBadge tone="neutral" size="sm">
                            Unpublished
                          </StatusBadge>
                        )}
                      </div>
                      <span className="text-[13px] text-muted-2">
                        /{item.slug} · {formatPrice(item)}
                        {item.category ? ` · ${CATEGORY_OPTIONS.find((c) => c.value === item.category)?.label ?? item.category}` : ""}
                        {(mediaByItem[item.id]?.length ?? 0) > 0 ? ` · ${mediaByItem[item.id].length} photo/video` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setEditingId(item.id)} className={btnSm}>
                      Edit
                    </button>
                    <Form method="post">
                      <input type="hidden" name="id" value={item.id} />
                      <DeleteButton confirmText={`Delete "${item.name}"? This cannot be undone.`} />
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

function ItemForm({ item, onCancel }: { item?: ItemRow; onCancel?: () => void }) {
  return (
    <Form method="post" encType="multipart/form-data" className="flex flex-col gap-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="intent" value={item ? "update" : "create"} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Name" name="name" required defaultValue={item?.name} />
        <TextField
          label="Slug"
          name="slug"
          defaultValue={item?.slug}
          placeholder="leave blank to generate"
          hint="Used in the item's link; auto-generated from the name if left blank."
        />
      </div>

      <TextAreaField label="Description" name="description" rows={3} defaultValue={item?.description ?? undefined} />

      {!item && <MediaPicker hint="Add one or more photos, and a video if you have one. Optional." />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SelectField label="Category" name="category" defaultValue={item?.category ?? ""}>
          <option value="">No category</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        <SelectField label="Condition" name="condition" defaultValue={item?.condition ?? ""}>
          <option value="">Not specified</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </SelectField>
        <SelectField label="Stock status" name="status" defaultValue={item?.status ?? "in_stock"}>
          <option value="in_stock">In stock</option>
          <option value="out_of_stock">Out of stock</option>
        </SelectField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField
          label="Price (RWF)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={item?.price ?? undefined}
          hint="Leave blank to show 'Contact us for the price'."
        />
        <TextField label="Price unit" name="price_unit" placeholder="e.g. per unit, per bag" defaultValue={item?.price_unit ?? undefined} />
        <TextField label="Sort order" name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} hint="Lower numbers appear first." />
      </div>

      <CheckboxField label="Published on the public Marketplace page" name="is_published" defaultChecked={item?.is_published ?? true} />

      <div className="flex gap-3">
        <button type="submit" className={btnPrimary}>
          {item ? "Save changes" : "Add item"}
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

function MediaManager({ item, media }: { item: ItemRow; media: MediaRow[] }) {
  return (
    <div className="rounded-xl border border-line bg-[#F7F9F7] p-5">
      <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-muted">Photos & video</h3>

      {media.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {media.map((m) => (
            <div key={m.id} className="flex flex-col items-center gap-1.5">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-line bg-brand-50">
                {m.media_type === "image" ? (
                  <img src={m.media_path} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 text-brand-700">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7Z" />
                    </svg>
                    <span className="text-[9px] font-semibold uppercase">Video</span>
                  </div>
                )}
                {m.is_primary && (
                  <span className="absolute right-1 top-1 rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    MAIN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {m.media_type === "image" && !m.is_primary && (
                  <Form method="post">
                    <input type="hidden" name="intent" value="set_primary_media" />
                    <input type="hidden" name="item_id" value={item.id} />
                    <input type="hidden" name="media_id" value={m.id} />
                    <button type="submit" className="text-[10.5px] font-semibold text-brand-700 hover:text-brand-900">
                      Set main
                    </button>
                  </Form>
                )}
                <Form method="post">
                  <input type="hidden" name="intent" value="delete_media" />
                  <input type="hidden" name="item_id" value={item.id} />
                  <input type="hidden" name="media_id" value={m.id} />
                  <button
                    type="submit"
                    onClick={(event) => {
                      if (!confirm("Remove this photo/video?")) event.preventDefault();
                    }}
                    className="text-[10.5px] font-semibold text-red-700 hover:text-red-900"
                  >
                    Remove
                  </button>
                </Form>
              </div>
            </div>
          ))}
        </div>
      )}

      <Form method="post" encType="multipart/form-data" className="flex flex-col gap-3">
        <input type="hidden" name="intent" value="add_media" />
        <input type="hidden" name="item_id" value={item.id} />
        <MediaPicker hint="Add more photos, or a video." />
        <button type="submit" className={btnSm + " w-fit"}>
          Upload
        </button>
      </Form>
    </div>
  );
}
