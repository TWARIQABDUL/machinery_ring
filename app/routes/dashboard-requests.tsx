import { Form } from "react-router";
import { useFormStatus } from "react-dom";
import pool from "../../db";
import { requireUserSession } from "../../db/session.server";
import Panel from "../components/admin/panel";
import StatusBadge from "../components/status-badge";
import DeleteButton from "../components/admin/delete-button";
import SubmitButton from "../components/submit-button";
import { btnSm } from "../components/admin/field";
import { REQUEST_STATUSES, REQUEST_STATUS_TONE } from "../lib/request-status";
import { buildServiceRequestWhatsAppUrl } from "../lib/whatsapp";
import { cn } from "../lib/cn";
import type { Route } from "./+types/dashboard-requests";

type RequestRow = {
  id: number;
  full_name: string;
  phone: string;
  district: string | null;
  sector: string | null;
  cell: string | null;
  village: string | null;
  membership_status: "member" | "non_member" | "unsure";
  ring_name: string | null;
  service_name: string | null;
  crop: string | null;
  area_or_quantity: string | null;
  preferred_timing: string | null;
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

  const { rows } = await pool.query<RequestRow>(
    `SELECT sr.*, s.name AS service_name, r.name AS ring_name
     FROM service_requests sr
     LEFT JOIN services s ON s.id = sr.service_id
     LEFT JOIN rings r ON r.id = sr.ring_id
     ${filter !== "all" ? "WHERE sr.status = $1" : ""}
     ORDER BY sr.created_at DESC`,
    filter !== "all" ? [filter] : []
  );

  return { requests: rows, statusFilter: filter };
}

export async function action({ request }: Route.ActionArgs) {
  await requireUserSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = Number(formData.get("id"));

  if (intent === "delete") {
    await pool.query("DELETE FROM service_requests WHERE id = $1", [id]);
  } else if (intent === "update_status") {
    const status = formData.get("status")?.toString() ?? "new";
    await pool.query("UPDATE service_requests SET status = $1 WHERE id = $2", [status, id]);
  } else if (intent === "mark_whatsapp_sent") {
    await pool.query("UPDATE service_requests SET whatsapp_sent_at = NOW() WHERE id = $1", [id]);
  }

  return { success: true };
}

const FILTERS = ["all", ...REQUEST_STATUSES] as const;

export default function DashboardRequests({ loaderData }: Route.ComponentProps) {
  const { requests, statusFilter } = loaderData;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Service requests</h1>
        <p className="text-[14.5px] text-muted">Requests submitted from the Contact page's "Request a service" form.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <a
            key={filter}
            href={filter === "all" ? "/dashboard/requests" : `/dashboard/requests?status=${filter}`}
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
        {requests.length === 0 ? (
          <p className="text-[14px] text-muted-2">No requests {statusFilter !== "all" ? `with status "${statusFilter}"` : "yet"}.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {requests.map((req) => {
              const location = [req.village, req.cell, req.sector, req.district].filter(Boolean).join(", ");
              const membershipLine =
                req.membership_status === "member"
                  ? req.ring_name ?? "Member"
                  : req.membership_status === "non_member"
                    ? "Non-member"
                    : "Unsure";
              const whatsappUrl = buildServiceRequestWhatsAppUrl({
                id: req.id,
                fullName: req.full_name,
                phone: req.phone,
                location,
                membershipLine,
                serviceName: req.service_name,
                crop: req.crop,
                areaOrQuantity: req.area_or_quantity,
                preferredTiming: req.preferred_timing,
                additionalInfo: req.additional_info,
              });

              return (
                <div key={req.id} className="flex flex-col gap-3 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[15px] font-bold text-ink">{req.full_name}</span>
                        <StatusBadge tone={REQUEST_STATUS_TONE[req.status as keyof typeof REQUEST_STATUS_TONE] ?? "neutral"} size="sm">
                          {req.status}
                        </StatusBadge>
                        {req.whatsapp_sent_at && (
                          <StatusBadge tone="neutral" size="sm">
                            WhatsApp sent
                          </StatusBadge>
                        )}
                      </div>
                      <span className="text-[13px] text-muted-2">
                        {req.phone}
                        {location ? ` · ${location}` : ""} · {membershipLine}
                      </span>
                      <span className="text-[12px] text-muted-2">
                        Submitted{" "}
                        {new Date(req.created_at).toLocaleString("en-GB", {
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
                        <input type="hidden" name="id" value={req.id} />
                        <input type="hidden" name="intent" value="update_status" />
                        <StatusSelect status={req.status} />
                      </Form>
                      <a href={whatsappUrl} target="_blank" rel="noreferrer" className={btnSm}>
                        Open in WhatsApp
                      </a>
                      {!req.whatsapp_sent_at && (
                        <Form method="post">
                          <input type="hidden" name="id" value={req.id} />
                          <input type="hidden" name="intent" value="mark_whatsapp_sent" />
                          <SubmitButton pendingText="Marking…" className={btnSm}>
                            Mark sent
                          </SubmitButton>
                        </Form>
                      )}
                      <Form method="post">
                        <input type="hidden" name="id" value={req.id} />
                        <DeleteButton confirmText={`Delete the request from "${req.full_name}"? This cannot be undone.`} />
                      </Form>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-1 rounded-lg bg-[#F7F9F7] px-4 py-3 text-[13.5px] text-ink-soft sm:grid-cols-2">
                    <span>
                      <strong className="text-ink">Service:</strong> {req.service_name ?? "-"}
                    </span>
                    <span>
                      <strong className="text-ink">Crop:</strong> {req.crop ?? "-"}
                    </span>
                    <span>
                      <strong className="text-ink">Area / quantity:</strong> {req.area_or_quantity ?? "-"}
                    </span>
                    <span>
                      <strong className="text-ink">Preferred timing:</strong> {req.preferred_timing ?? "-"}
                    </span>
                    {req.additional_info && (
                      <span className="sm:col-span-2">
                        <strong className="text-ink">Notes:</strong> {req.additional_info}
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

function StatusSelect({ status }: { status: string }) {
  const { pending } = useFormStatus();
  return (
    <select
      name="status"
      defaultValue={status}
      disabled={pending}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className={cn(
        "rounded-lg border border-line bg-white px-2.5 py-1.5 text-[13px] font-semibold capitalize text-ink focus:border-brand-600 focus:outline-none",
        pending && "cursor-wait opacity-60"
      )}
    >
      {REQUEST_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
