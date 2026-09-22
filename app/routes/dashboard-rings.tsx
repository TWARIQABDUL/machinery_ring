import { useState } from "react";
import { Form, useActionData } from "react-router";
import pool from "../../db";
import { requireUserSession } from "../../db/session.server";
import Panel from "../components/admin/panel";
import StatusBadge from "../components/status-badge";
import DeleteButton from "../components/admin/delete-button";
import { TextField, CheckboxField, btnPrimary, btnGhost, btnSm } from "../components/admin/field";
import type { Route } from "./+types/dashboard-rings";

type RingRow = {
  id: number;
  name: string;
  whatsapp_invite_link: string;
  is_active: boolean;
  sort_order: number;
};

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserSession(request);
  const { rows } = await pool.query<RingRow>("SELECT * FROM rings ORDER BY sort_order, name");
  return { rings: rows };
}

type ActionResult = { error: string } | { success: true } | undefined;

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  await requireUserSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const get = (name: string) => (formData.get(name)?.toString() ?? "").trim();

  if (intent === "delete") {
    const id = Number(get("id"));
    await pool.query("DELETE FROM rings WHERE id = $1", [id]);
    return { success: true };
  }

  const name = get("name");
  const whatsappLink = get("whatsapp_invite_link");
  if (!name) return { error: "Please enter the Ring's name." };
  if (!whatsappLink) return { error: "Please enter a WhatsApp invite link." };
  const isActive = formData.get("is_active") ? true : false;
  const sortOrder = Number(get("sort_order")) || 0;

  try {
    if (intent === "update") {
      const id = Number(get("id"));
      await pool.query(
        "UPDATE rings SET name=$1, whatsapp_invite_link=$2, is_active=$3, sort_order=$4 WHERE id=$5",
        [name, whatsappLink, isActive, sortOrder, id]
      );
    } else {
      await pool.query(
        "INSERT INTO rings (name, whatsapp_invite_link, is_active, sort_order) VALUES ($1,$2,$3,$4)",
        [name, whatsappLink, isActive, sortOrder]
      );
    }
  } catch (err: any) {
    if (err?.code === "23505") return { error: `A Ring named "${name}" already exists.` };
    throw err;
  }

  return { success: true };
}

export default function DashboardRings({ loaderData }: Route.ComponentProps) {
  const { rings } = loaderData;
  const actionData = useActionData() as ActionResult;
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Rings</h1>
        <p className="text-[14.5px] text-muted">Local Rings farmers can select on the Contact form. Name and WhatsApp group invite link.</p>
      </div>

      {actionData && "error" in actionData && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{actionData.error}</p>
      )}

      <Panel title="Add a Ring">
        <RingForm />
      </Panel>

      <Panel title={`All Rings (${rings.length})`}>
        {rings.length === 0 ? (
          <p className="text-[14px] text-muted-2">No Rings yet. Add the first one above.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {rings.map((ring) =>
              editingId === ring.id ? (
                <div key={ring.id} className="py-5">
                  <RingForm ring={ring} onCancel={() => setEditingId(null)} />
                </div>
              ) : (
                <div key={ring.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-bold text-ink">{ring.name}</span>
                      {!ring.is_active && (
                        <StatusBadge tone="neutral" size="sm">
                          Inactive
                        </StatusBadge>
                      )}
                    </div>
                    <a
                      href={ring.whatsapp_invite_link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-fit text-[13px] text-brand-700 hover:text-brand-900"
                    >
                      {ring.whatsapp_invite_link}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setEditingId(ring.id)} className={btnSm}>
                      Edit
                    </button>
                    <Form method="post">
                      <input type="hidden" name="id" value={ring.id} />
                      <DeleteButton confirmText={`Delete "${ring.name}"? This cannot be undone.`} />
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

function RingForm({ ring, onCancel }: { ring?: RingRow; onCancel?: () => void }) {
  return (
    <Form method="post" className="flex flex-col gap-4">
      {ring && <input type="hidden" name="id" value={ring.id} />}
      <input type="hidden" name="intent" value={ring ? "update" : "create"} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Name" name="name" required defaultValue={ring?.name} />
        <TextField label="Sort order" name="sort_order" type="number" defaultValue={ring?.sort_order ?? 0} hint="Lower numbers appear first." />
      </div>

      <TextField
        label="WhatsApp invite link"
        name="whatsapp_invite_link"
        required
        placeholder="https://chat.whatsapp.com/..."
        defaultValue={ring?.whatsapp_invite_link}
      />

      <CheckboxField label="Active (selectable on the Contact form)" name="is_active" defaultChecked={ring?.is_active ?? true} />

      <div className="flex gap-3">
        <button type="submit" className={btnPrimary}>
          {ring ? "Save changes" : "Add Ring"}
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
