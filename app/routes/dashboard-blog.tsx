import { useState } from "react";
import { Form, useActionData } from "react-router";
import pool from "../../db";
import { requireUserSession } from "../../db/session.server";
import { slugify } from "../lib/slugify";
import { saveUploadedImage, deletePublicImage } from "../lib/uploads.server";
import Panel from "../components/admin/panel";
import StatusBadge from "../components/status-badge";
import DeleteButton from "../components/admin/delete-button";
import { TextField, TextAreaField, SelectField, btnPrimary, btnGhost, btnSm } from "../components/admin/field";
import type { Route } from "./+types/dashboard-blog";

type BlogRow = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image_path: string | null;
  tag: string | null;
  status: "draft" | "published";
  published_at: string | null;
};

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserSession(request);
  const { rows } = await pool.query<BlogRow>("SELECT * FROM blog_posts ORDER BY created_at DESC");
  return { posts: rows };
}

type ActionResult = { error: string } | { success: true } | undefined;

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  await requireUserSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const get = (name: string) => (formData.get(name)?.toString() ?? "").trim();

  if (intent === "delete") {
    const id = Number(get("id"));
    const { rows } = await pool.query("SELECT cover_image_path FROM blog_posts WHERE id = $1", [id]);
    await pool.query("DELETE FROM blog_posts WHERE id = $1", [id]);
    if (rows[0]) await deletePublicImage(rows[0].cover_image_path);
    return { success: true };
  }

  const title = get("title");
  if (!title) return { error: "Please enter a title." };
  const slug = get("slug") || slugify(title);
  const excerpt = get("excerpt") || null;
  const body = get("body");
  if (!body) return { error: "Please write the post body." };
  const tag = get("tag") || null;
  const status = get("status") === "published" ? "published" : "draft";
  const uploadedCover = await saveUploadedImage(formData.get("cover_image"), "blog");

  try {
    if (intent === "update") {
      const id = Number(get("id"));
      const { rows } = await pool.query("SELECT cover_image_path, status, published_at FROM blog_posts WHERE id = $1", [id]);
      const existing = rows[0];
      const coverImagePath = uploadedCover ?? existing?.cover_image_path ?? null;
      const publishedAt = status === "published" ? existing?.published_at ?? new Date() : existing?.published_at ?? null;

      await pool.query(
        `UPDATE blog_posts SET title=$1, slug=$2, excerpt=$3, body=$4, cover_image_path=$5, tag=$6, status=$7, published_at=$8, updated_at=NOW()
         WHERE id=$9`,
        [title, slug, excerpt, body, coverImagePath, tag, status, publishedAt, id]
      );
      if (uploadedCover && existing?.cover_image_path) await deletePublicImage(existing.cover_image_path);
    } else {
      await pool.query(
        `INSERT INTO blog_posts (title, slug, excerpt, body, cover_image_path, tag, status, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [title, slug, excerpt, body, uploadedCover, tag, status, status === "published" ? new Date() : null]
      );
    }
  } catch (err: any) {
    if (err?.code === "23505") return { error: `The slug "${slug}" is already used by another post.` };
    throw err;
  }

  return { success: true };
}

export default function DashboardBlog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  const actionData = useActionData() as ActionResult;
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Blog</h1>
        <p className="text-[14.5px] text-muted">Write, edit and publish updates shown on the public Blog page.</p>
      </div>

      {actionData && "error" in actionData && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{actionData.error}</p>
      )}

      <Panel title="Write a post">
        <PostForm />
      </Panel>

      <Panel title={`All posts (${posts.length})`}>
        {posts.length === 0 ? (
          <p className="text-[14px] text-muted-2">No posts yet — write the first one above.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {posts.map((post) =>
              editingId === post.id ? (
                <div key={post.id} className="py-5">
                  <PostForm post={post} onCancel={() => setEditingId(null)} />
                </div>
              ) : (
                <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-bold text-ink">{post.title}</span>
                      <StatusBadge tone={post.status === "published" ? "solid" : "neutral"} size="sm">
                        {post.status}
                      </StatusBadge>
                    </div>
                    <span className="text-[13px] text-muted-2">
                      /{post.slug}
                      {post.tag ? ` · ${post.tag}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setEditingId(post.id)} className={btnSm}>
                      Edit
                    </button>
                    <Form method="post">
                      <input type="hidden" name="id" value={post.id} />
                      <DeleteButton confirmText={`Delete "${post.title}"? This cannot be undone.`} />
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

function PostForm({ post, onCancel }: { post?: BlogRow; onCancel?: () => void }) {
  return (
    <Form method="post" encType="multipart/form-data" className="flex flex-col gap-4">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="intent" value={post ? "update" : "create"} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Title" name="title" required defaultValue={post?.title} />
        <TextField label="Slug" name="slug" defaultValue={post?.slug} placeholder="leave blank to generate" hint="Auto-generated from the title if left blank." />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Tag" name="tag" placeholder="e.g. Field days, Women's participation" defaultValue={post?.tag ?? undefined} />
        <SelectField label="Status" name="status" defaultValue={post?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </SelectField>
      </div>

      <TextAreaField label="Excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt ?? undefined} hint="Short summary shown in the post grid." />
      <TextAreaField label="Body" name="body" rows={8} required defaultValue={post?.body} />

      <TextField
        label="Cover image"
        name="cover_image"
        type="file"
        accept="image/*"
        hint={post ? "Leave blank to keep the current cover image." : "Optional."}
      />

      <div className="flex gap-3">
        <button type="submit" className={btnPrimary}>
          {post ? "Save changes" : "Add post"}
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
