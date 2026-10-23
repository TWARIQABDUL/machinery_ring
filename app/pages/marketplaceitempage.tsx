import { useState } from "react";
import { Link, data } from "react-router";
import pool from "../../db";
import Container from "../components/container";
import StatusBadge from "../components/status-badge";
import WhatsAppIcon from "../components/whatsapp-icon";
import SubmitButton from "../components/submit-button";
import { useT } from "../lib/i18n";
import { buildMarketplaceInquiryWhatsAppUrl } from "../lib/whatsapp";
import { cached } from "../lib/cache.server";
import { cn } from "../lib/cn";
import type { Route } from "./+types/marketplaceitempage";

const CATEGORY_LABELS: Record<string, string> = {
  equipment: "Equipment",
  spare_parts: "Spare parts",
  inputs: "Inputs",
  other: "Other",
};

type ItemRow = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  condition: "new" | "used" | null;
  price: string | null;
  price_unit: string | null;
  image_path: string | null;
  status: "in_stock" | "out_of_stock";
};

type MediaItem = { id: number; media_type: "image" | "video"; media_path: string };

export async function loader({ params }: Route.LoaderArgs) {
  const result = await cached(`marketplace-item:${params.slug}`, 60_000, async () => {
    const { rows } = await pool.query<ItemRow>(
      "SELECT id, slug, name, description, category, condition, price, price_unit, image_path, status FROM marketplace_items WHERE slug = $1 AND is_published = true",
      [params.slug]
    );
    const item = rows[0];
    if (!item) return null;

    const { rows: mediaRows } = await pool.query<MediaItem>(
      "SELECT id, media_type, media_path FROM marketplace_item_media WHERE item_id = $1 ORDER BY is_primary DESC, sort_order, id",
      [item.id]
    );
    // Items uploaded before the gallery feature existed have no media rows —
    // fall back to the single legacy image so they still display something.
    const media: MediaItem[] = mediaRows.length > 0 ? mediaRows : item.image_path ? [{ id: 0, media_type: "image", media_path: item.image_path }] : [];

    return { item, media };
  });

  if (!result) throw data("Item not found", { status: 404 });
  return result;
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.item.name ?? "Item"} — Marketplace | Machinery Ring Rwanda` }];
}

function formatPrice(item: ItemRow) {
  if (!item.price) return "Contact for price";
  return `RWF ${Number(item.price).toLocaleString()}${item.price_unit ? ` ${item.price_unit}` : ""}`;
}

type ActionResult =
  | { success: true; whatsappUrl: string }
  | { success: false; error: string; values: Record<string, string> };

export async function action({ request, params }: Route.ActionArgs): Promise<ActionResult> {
  const { rows: itemRows } = await pool.query<ItemRow>(
    "SELECT id, name FROM marketplace_items WHERE slug = $1 AND is_published = true",
    [params.slug]
  );
  const item = itemRows[0];
  const values: Record<string, string> = {};
  const formData = await request.formData();
  for (const [key, value] of formData.entries()) values[key] = value.toString();

  if (!item) return { success: false, error: "This item is no longer available.", values };

  const get = (name: string) => (formData.get(name)?.toString() ?? "").trim();
  const fullName = get("full_name");
  const phone = get("phone");
  const district = get("district");
  const sector = get("sector");
  const cell = get("cell");
  const village = get("village");
  const quantity = get("quantity");
  const additionalInfo = get("additional_info");
  const consent = formData.get("consent");

  if (!fullName || !phone) {
    return { success: false, error: "Please enter your name and telephone number.", values };
  }
  if (!consent) {
    return { success: false, error: "Please agree to be contacted about this inquiry before submitting.", values };
  }

  const { rows } = await pool.query(
    `INSERT INTO marketplace_inquiries (full_name, phone, district, sector, cell, village, item_id, quantity, additional_info)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING id`,
    [fullName, phone, district || null, sector || null, cell || null, village || null, item.id, quantity || null, additionalInfo || null]
  );
  const inquiryId = rows[0].id;
  const location = [village, cell, sector, district].filter(Boolean).join(", ");

  const whatsappUrl = buildMarketplaceInquiryWhatsAppUrl({
    id: inquiryId,
    fullName,
    phone,
    location,
    itemName: item.name,
    quantity,
    additionalInfo,
  });

  return { success: true, whatsappUrl };
}

const inputClass =
  "rounded-lg border border-line bg-white px-3.5 py-3 text-sm text-ink placeholder:text-muted-2 focus:border-brand-600 focus:outline-none";

export default function MarketplaceItemPage({ loaderData, actionData }: Route.ComponentProps) {
  const { item, media } = loaderData;
  const result = actionData as ActionResult | undefined;
  const values = result && !result.success ? result.values : {};
  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex];
  const t = useT();

  return (
    <div>
      <section className="border-b border-line bg-cream">
        <Container className="flex flex-col gap-3.5 py-10">
          <span className="text-[13px] text-muted-2">
            <Link to="/" className="text-muted-2 hover:text-deep">
              Home
            </Link>
            &nbsp;/&nbsp;
            <Link to="/marketplace" className="text-muted-2 hover:text-deep">
              Marketplace
            </Link>
            &nbsp;/&nbsp;{item.name}
          </span>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="grid gap-10 py-12 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-brand-100">
              {!active ? (
                <div className="flex h-full items-center justify-center">
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#B9D6C2" strokeWidth="1.3">
                    <path d="M5 8h14l-1 12H6L5 8Z" />
                    <path d="M9 8a3 3 0 0 1 6 0" />
                  </svg>
                </div>
              ) : active.media_type === "video" ? (
                <video key={active.id} src={active.media_path} controls className="h-full w-full object-cover" />
              ) : (
                <img key={active.id} src={active.media_path} alt={item.name} className="h-full w-full object-cover" />
              )}
            </div>

            {media.length > 1 && (
              <div className="flex flex-wrap gap-2.5">
                {media.map((m, i) => (
                  <button
                    key={m.id || i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2",
                      i === activeIndex ? "border-brand-600" : "border-line hover:border-brand-200"
                    )}
                  >
                    {m.media_type === "video" ? (
                      <div className="flex h-full flex-col items-center justify-center gap-0.5 bg-brand-50 text-brand-700">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7Z" />
                        </svg>
                        <span className="text-[8px] font-semibold uppercase">Video</span>
                      </div>
                    ) : (
                      <img src={m.media_path} alt="" className="h-full w-full object-cover" loading="lazy" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {item.category && (
                <StatusBadge tone="neutral" size="sm">
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </StatusBadge>
              )}
              {item.condition && (
                <StatusBadge tone="neutral" size="sm">
                  {item.condition === "new" ? "New" : "Used"}
                </StatusBadge>
              )}
              {item.status === "out_of_stock" && (
                <StatusBadge tone="amber" size="sm">
                  Out of stock
                </StatusBadge>
              )}
            </div>
            <h1 className="font-display text-3xl font-extrabold text-ink">{item.name}</h1>
            <span className="text-2xl font-extrabold text-brand-700">{formatPrice(item)}</span>
            {item.description && <p className="text-[15.5px] leading-[1.7] text-muted">{item.description}</p>}
            <p className="text-[13px] text-muted-2">
              Sending an inquiry doesn't confirm a purchase — our team will contact you to confirm availability, price
              and next steps.
            </p>

            <div id="inquire" className="scroll-mt-24 rounded-2xl border border-line bg-[#F7F9F7] p-6">
              {result?.success ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wide text-brand-700">Inquiry received</span>
                    <p className="text-[14.5px] text-ink-soft">
                      Your inquiry has been received. Our team will contact you to confirm availability and price.
                    </p>
                  </div>
                  <a
                    href={result.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-700"
                  >
                    <WhatsAppIcon />
                    Send these details on WhatsApp
                  </a>
                  <p className="text-center text-[12.5px] text-muted-2">
                    Optional — opens WhatsApp with the details above pre-filled. Your inquiry is already saved either way.
                  </p>
                </div>
              ) : (
                <form method="post" className="flex flex-col gap-4">
                  <h2 className="text-lg font-bold text-ink">Inquire about this item</h2>
                  {result?.error && (
                    <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{result.error}</p>
                  )}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <input name="full_name" required placeholder={t("form.fullName")} defaultValue={values.full_name} className={inputClass} />
                    <input name="phone" required placeholder={t("form.phone")} defaultValue={values.phone} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    <input name="district" placeholder={t("form.district")} defaultValue={values.district} className={inputClass} />
                    <input name="sector" placeholder={t("form.sector")} defaultValue={values.sector} className={inputClass} />
                    <input name="cell" placeholder={t("form.cell")} defaultValue={values.cell} className={inputClass} />
                    <input name="village" placeholder={t("form.village")} defaultValue={values.village} className={inputClass} />
                  </div>
                  <input name="quantity" placeholder="Quantity needed (optional)" defaultValue={values.quantity} className={inputClass} />
                  <textarea
                    name="additional_info"
                    rows={3}
                    placeholder="Additional information (optional)"
                    defaultValue={values.additional_info}
                    className={inputClass}
                  />
                  <label className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] text-muted">
                    <input type="checkbox" name="consent" required className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-[#B9CBBE] accent-brand-600" />
                    I agree that Machinery Ring Rwanda may use these details to contact me about this inquiry.
                  </label>
                  <SubmitButton
                    pendingText="Sending…"
                    className="rounded-lg bg-brand-600 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-700"
                  >
                    Send inquiry
                  </SubmitButton>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
