import { Link } from "react-router";
import pool from "../../db";
import { requireUserSession } from "../../db/session.server";
import Panel from "../components/admin/panel";
import StatusBadge from "../components/status-badge";
import { REQUEST_STATUS_TONE } from "../lib/request-status";
import type { Route } from "./+types/dashboard-home";

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserSession(request);
  const [services, gallery, blog, rings, requests, recentRequests] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM services"),
    pool.query("SELECT COUNT(*) FROM gallery_items"),
    pool.query("SELECT COUNT(*) FILTER (WHERE status = 'published') AS published, COUNT(*) FILTER (WHERE status = 'draft') AS draft FROM blog_posts"),
    pool.query("SELECT COUNT(*) FROM rings"),
    pool.query("SELECT COUNT(*) FROM service_requests WHERE status = 'new'"),
    pool.query(
      "SELECT id, full_name, phone, status, created_at FROM service_requests ORDER BY created_at DESC LIMIT 5"
    ),
  ]);

  return {
    counts: {
      services: Number(services.rows[0].count),
      gallery: Number(gallery.rows[0].count),
      blogPublished: Number(blog.rows[0].published),
      blogDraft: Number(blog.rows[0].draft),
      rings: Number(rings.rows[0].count),
      newRequests: Number(requests.rows[0].count),
    },
    recentRequests: recentRequests.rows as {
      id: number;
      full_name: string;
      phone: string;
      status: string;
      created_at: string;
    }[],
  };
}

export default function DashboardHome({ loaderData }: Route.ComponentProps) {
  const { counts, recentRequests } = loaderData;

  const cards = [
    { label: "New service requests", value: counts.newRequests, to: "/dashboard/requests", highlight: counts.newRequests > 0 },
    { label: "Services", value: counts.services, to: "/dashboard/services" },
    { label: "Gallery photos", value: counts.gallery, to: "/dashboard/gallery" },
    { label: "Blog posts", value: `${counts.blogPublished} published, ${counts.blogDraft} draft`, to: "/dashboard/blog" },
    { label: "Rings", value: counts.rings, to: "/dashboard/rings" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Overview</h1>
        <p className="text-[14.5px] text-muted">What's happening across the site right now.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className={
              "flex flex-col gap-1.5 rounded-2xl border p-6 hover:border-brand-200 " +
              (card.highlight ? "border-brand-200 bg-brand-50" : "border-line bg-white")
            }
          >
            <span className="text-2xl font-extrabold text-ink">{card.value}</span>
            <span className="text-[13.5px] font-semibold text-muted">{card.label}</span>
          </Link>
        ))}
      </div>

      <Panel
        title="Latest requests"
        description="The 5 most recent service requests submitted from the Contact page."
        action={
          <Link to="/dashboard/requests" className="text-[13.5px] font-semibold text-brand-700 hover:text-brand-900">
            View all &rarr;
          </Link>
        }
      >
        {recentRequests.length === 0 ? (
          <p className="text-[14px] text-muted-2">No requests yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-ink">{request.full_name}</span>
                  <span className="text-[13px] text-muted-2">{request.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-muted-2">
                    {new Date(request.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  <StatusBadge tone={REQUEST_STATUS_TONE[request.status as keyof typeof REQUEST_STATUS_TONE] ?? "neutral"} size="sm">
                    {request.status}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
