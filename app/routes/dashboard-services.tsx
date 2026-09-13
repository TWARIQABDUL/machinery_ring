import { useEffect, useState } from "react";
import { Form, useActionData } from "react-router";
import pool from "../../db";
import { requireUserSession } from "../../db/session.server";
import { slugify } from "../lib/slugify";
import Panel from "../components/admin/panel";
import StatusBadge from "../components/status-badge";
import DeleteButton from "../components/admin/delete-button";
import { TextField, TextAreaField, SelectField, CheckboxField, btnPrimary, btnGhost, btnSm } from "../components/admin/field";
import type { Route } from "./+types/dashboard-services";

type ServiceRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: "available" | "in_development";
  price: string | null;
  price_unit: string | null;
  is_published: boolean;
  sort_order: number;
};

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserSession(request);
  const { rows } = await pool.query<ServiceRow>("SELECT * FROM services ORDER BY sort_order, name");
  return { services: rows };
}

type ActionResult = { error: string } | { success: true } | undefined;

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  await requireUserSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const get = (name: string) => (formData.get(name)?.toString() ?? "").trim();

  if (intent === "delete") {
    const id = Number(get("id"));
    await pool.query("DELETE FROM services WHERE id = $1", [id]);
    return { success: true };
  }

  const name = get("name");
  if (!name) return { error: "Please enter a service name." };
  const slug = get("slug") || slugify(name);
  const description = get("description") || null;
  const status = get("status") === "in_development" ? "in_development" : "available";
  const priceRaw = get("price");
  const price = priceRaw ? Number(priceRaw) : null;
  const priceUnit = get("price_unit") || null;
  const isPublished = formData.get("is_published") ? true : false;
  const sortOrder = Number(get("sort_order")) || 0;

  try {
    if (intent === "update") {
      const id = Number(get("id"));
      await pool.query(
        `UPDATE services SET name=$1, slug=$2, description=$3, status=$4, price=$5, price_unit=$6, is_published=$7, sort_order=$8, updated_at=NOW()
         WHERE id=$9`,
        [name, slug, description, status, price, priceUnit, isPublished, sortOrder, id]
      );
    } else {
      await pool.query(
        `INSERT INTO services (name, slug, description, status, price, price_unit, is_published, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [name, slug, description, status, price, priceUnit, isPublished, sortOrder]
      );
    }
  } catch (err: any) {
    if (err?.code === "23505") return { error: `The slug "${slug}" is already used by another service.` };
    throw err;
  }

  return { success: true };
}

export default function DashboardServices({ loaderData }: Route.ComponentProps) {
  const { services } = loaderData;
  const actionData = useActionData() as ActionResult;
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Once a create/update/delete succeeds, collapse whichever form was open
  // instead of leaving it sitting there showing values that are now stale.
  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      setShowCreateForm(false);
      setEditingId(null);
    }
  }, [actionData]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Services</h1>
        <p className="text-[14.5px] text-muted">Create and manage what shows on the public Services page, including price.</p>
      </div>

      {actionData && "error" in actionData && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{actionData.error}</p>
      )}

      <Panel
        title={`All services (${services.length})`}
        action={
          !showCreateForm && (
            <button type="button" onClick={() => setShowCreateForm(true)} className={btnPrimary}>
              + Add service
            </button>
          )
        }
      >
        {showCreateForm && (
          <div className="mb-6 border-b border-line pb-6">
            <ServiceForm onCancel={() => setShowCreateForm(false)} />
          </div>
        )}

        {services.length === 0 && !showCreateForm ? (
          <p className="text-[14px] text-muted-2">No services yet — click "Add service" above.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {services.map((service) =>
              editingId === service.id ? (
                <div key={service.id} className="py-5">
                  <ServiceForm service={service} onCancel={() => setEditingId(null)} />
                </div>
              ) : (
                <div key={service.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-bold text-ink">{service.name}</span>
                      <StatusBadge tone={service.status === "available" ? "solid" : "amber"} size="sm">
                        {service.status === "available" ? "Available" : "In development"}
                      </StatusBadge>
                      {!service.is_published && (
                        <StatusBadge tone="neutral" size="sm">
                          Unpublished
                        </StatusBadge>
                      )}
                    </div>
                    <span className="text-[13px] text-muted-2">
                      /{service.slug}
                      {service.price ? ` · RWF ${Number(service.price).toLocaleString()}${service.price_unit ? ` ${service.price_unit}` : ""}` : " · price not set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setEditingId(service.id)} className={btnSm}>
                      Edit
                    </button>
                    <Form method="post">
                      <input type="hidden" name="id" value={service.id} />
                      <DeleteButton confirmText={`Delete "${service.name}"? This cannot be undone.`} />
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

function ServiceForm({ service, onCancel }: { service?: ServiceRow; onCancel?: () => void }) {
  return (
    <Form method="post" className="flex flex-col gap-4">
      {service && <input type="hidden" name="id" value={service.id} />}
      <input type="hidden" name="intent" value={service ? "update" : "create"} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Name" name="name" required defaultValue={service?.name} />
        <TextField
          label="Slug"
          name="slug"
          defaultValue={service?.slug}
          placeholder="leave blank to generate"
          hint="Used in links; auto-generated from the name if left blank."
        />
      </div>

      <TextAreaField label="Description" name="description" rows={3} defaultValue={service?.description ?? undefined} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField label="Status" name="status" defaultValue={service?.status ?? "available"}>
          <option value="available">Available</option>
          <option value="in_development">In development</option>
        </SelectField>
        <TextField label="Sort order" name="sort_order" type="number" defaultValue={service?.sort_order ?? 0} hint="Lower numbers appear first." />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Price (RWF)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={service?.price ?? undefined}
          hint="Leave blank to keep showing 'Contact us for the rate'."
        />
        <TextField label="Price unit" name="price_unit" placeholder="e.g. per hectare, per day" defaultValue={service?.price_unit ?? undefined} />
      </div>

      <CheckboxField label="Published on the public Services page" name="is_published" defaultChecked={service?.is_published ?? true} />

      <div className="flex gap-3">
        <button type="submit" className={btnPrimary}>
          {service ? "Save changes" : "Add service"}
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
