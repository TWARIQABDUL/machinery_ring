import { Form } from "react-router";
import pool from "../../db";
import { requireUserSession } from "../../db/session.server";
import Panel from "../components/admin/panel";
import StatusBadge from "../components/status-badge";
import DeleteButton from "../components/admin/delete-button";
import { btnSm } from "../components/admin/field";
import { REQUEST_STATUSES, REQUEST_STATUS_TONE } from "../lib/request-status";
import { buildMarketplaceInquiryWhatsAppUrl } from "../lib/whatsapp";
import { cn } from "../lib/cn";
import type { Route } from "./+types/dashboard-marketplace-inquiries";

type InquiryRow = {
  id: number;
  full_name: string;
  phone: string;
  district: string | null;
  sector: string | null;
  cell: string | null;
  village: string | null;
  item_name: string | null;
  quantity: string | null;
  additional_info: string | null;
  status: string;
  whatsapp_sent_at: string | null;
  created_at: string;
};

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserSession(request);
  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status") ?? "all";
  const validFilter = statusFilter === "all" || (REQUEST_STATUSES as readonly string[]).includes(statusFilter);
  const filter = validFilter ? statusFilter : "all";

  const { rows } = await pool.query<InquiryRow>(
    `SELECT mi.*, m.name AS item_name
     FROM marketplace_inquiries mi
     LEFT JOIN marketplace_items m ON m.id = mi.item_id
     ${filter !== "all" ? "WHERE mi.status = $1" : ""}
     ORDER BY mi.created_at DESC`,
    filter !== "all" ? [filter] : []
  );

  return { inquiries: rows, statusFilter: filter };
}

export async function action({ request }: Route.ActionArgs) {
  await requireUserSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = Number(formData.get("id"));

  if (intent === "delete") {
    await pool.query("DELETE FROM marketplace_inquiries WHERE id = $1", [id]);
  } else if (intent === "update_status") {
    const status = formData.get("status")?.toString() ?? "new";
    await pool.query("UPDATE marketplace_inquiries SET status = $1 WHERE id = $2", [status, id]);
  } else if (intent === "mark_whatsapp_sent") {
    await pool.query("UPDATE marketplace_inquiries SET whatsapp_sent_at = NOW() WHERE id = $1", [id]);
  }

  return { success: true };
}

const FILTERS = ["all", ...REQUEST_STATUSES] as const;

export default function DashboardMarketplaceInquiries({ loaderData }: Route.ComponentProps) {
  const { inquiries, statusFilter } = loaderData;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Marketplace inquiries</h1>
        <p className="text-[14.5px] text-muted">Inquiries submitted from marketplace item pages.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <a
            key={filter}
            href={filter === "all" ? "/dashboard/marketplace-inquiries" : `/dashboard/marketplace-inquiries?status=${filter}`}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13px] font-semibold capitalize",
              statusFilter === filter ? "bg-brand-600 text-white" : "border border-line text-ink-soft hover:bg-brand-50"
            )}
          >
            {filter}
          </a>
        ))}
      </div>

      <Panel>
        {inquiries.length === 0 ? (
          <p className="text-[14px] text-muted-2">No inquiries {statusFilter !== "all" ? `with status "${statusFilter}"` : "yet"}.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {inquiries.map((inq) => {
              const location = [inq.village, inq.cell, inq.sector, inq.district].filter(Boolean).join(", ");
              const whatsappUrl = buildMarketplaceInquiryWhatsAppUrl({
                id: inq.id,
                fullName: inq.full_name,
                phone: inq.phone,
                location,
                itemName: inq.item_name ?? "an item that's since been removed",
                quantity: inq.quantity,
                additionalInfo: inq.additional_info,
              });

              return (
                <div key={inq.id} className="flex flex-col gap-3 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[15px] font-bold text-ink">{inq.full_name}</span>
                        <StatusBadge tone={REQUEST_STATUS_TONE[inq.status as keyof typeof REQUEST_STATUS_TONE] ?? "neutral"} size="sm">
                          {inq.status}
                        </StatusBadge>
                        {inq.whatsapp_sent_at && (
                          <StatusBadge tone="neutral" size="sm">
                            WhatsApp sent
                          </StatusBadge>
                        )}
                      </div>
                      <span className="text-[13px] text-muted-2">
                        {inq.phone}
                        {location ? ` · ${location}` : ""} · {inq.item_name ?? "Item removed"}
                      </span>
                      <span className="text-[12px] text-muted-2">
                        Submitted{" "}
                        {new Date(inq.created_at).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Form method="post">
                        <input type="hidden" name="id" value={inq.id} />
                        <input type="hidden" name="intent" value="update_status" />
                        <select
                          name="status"
                          defaultValue={inq.status}
                          onChange={(event) => event.currentTarget.form?.requestSubmit()}
                          className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-[13px] font-semibold capitalize text-ink focus:border-brand-600 focus:outline-none"
                        >
                          {REQUEST_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </Form>
                      <a href={whatsappUrl} target="_blank" rel="noreferrer" className={btnSm}>
                        Open in WhatsApp
                      </a>
                      {!inq.whatsapp_sent_at && (
                        <Form method="post">
                          <input type="hidden" name="id" value={inq.id} />
                          <input type="hidden" name="intent" value="mark_whatsapp_sent" />
                          <button type="submit" className={btnSm}>
                            Mark sent
                          </button>
                        </Form>
                      )}
                      <Form method="post">
                        <input type="hidden" name="id" value={inq.id} />
                        <DeleteButton confirmText={`Delete the inquiry from "${inq.full_name}"? This cannot be undone.`} />
                      </Form>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-1 rounded-lg bg-[#F7F9F7] px-4 py-3 text-[13.5px] text-ink-soft sm:grid-cols-2">
                    <span>
                      <strong className="text-ink">Item:</strong> {inq.item_name ?? "—"}
                    </span>
                    <span>
                      <strong className="text-ink">Quantity:</strong> {inq.quantity ?? "—"}
                    </span>
                    {inq.additional_info && (
                      <span className="sm:col-span-2">
                        <strong className="text-ink">Notes:</strong> {inq.additional_info}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
