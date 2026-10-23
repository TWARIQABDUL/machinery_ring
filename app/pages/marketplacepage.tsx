import { useState } from "react";
import { Link } from "react-router";
import pool from "../../db";
import PageHeader from "../components/page-header";
import Container from "../components/container";
import FilterChip from "../components/filter-chip";
import StatusBadge from "../components/status-badge";
import CtaBand from "../components/cta-band";
import { cached } from "../lib/cache.server";
import type { Route } from "./+types/marketplacepage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Marketplace | Machinery Ring Rwanda" }];
}

const CATEGORIES = ["All", "Equipment", "Spare parts", "Inputs", "Other"];

const CATEGORY_LABELS: Record<string, string> = {
  equipment: "Equipment",
  spare_parts: "Spare parts",
  inputs: "Inputs",
  other: "Other",
};

type ItemRow = {
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

export async function loader() {
  const items = await cached("marketplace:published", 60_000, async () => {
    const { rows } = await pool.query<ItemRow>(
      "SELECT slug, name, description, category, condition, price, price_unit, image_path, status FROM marketplace_items WHERE is_published = true ORDER BY sort_order, name"
    );
    return rows;
  });
  return { items };
}

function formatPrice(row: ItemRow) {
  if (!row.price) return "Contact for price";
  return `RWF ${Number(row.price).toLocaleString()}${row.price_unit ? ` ${row.price_unit}` : ""}`;
}

export default function MarketplacePage({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((item) => (item.category ? CATEGORY_LABELS[item.category] : null) === activeCategory);

  return (
    <div>
      <PageHeader
        crumb="Marketplace"
        title="Marketplace"
        intro="Equipment, spare parts and inputs Machinery Ring Rwanda sources or has arranged access to. Browse what's available, then send an inquiry — a request here doesn't confirm a purchase until we've discussed availability and price with you."
      />

      <section className="bg-white">
        <Container className="pt-8">
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => (
              <FilterChip key={cat} active={cat === activeCategory} onClick={() => setActiveCategory(cat)}>
                {cat}
              </FilterChip>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-10">
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-line bg-[#F7F9F7] px-6 py-12 text-center text-[14.5px] text-muted">
              {items.length === 0
                ? "No items are listed yet — check back soon."
                : `No items in "${activeCategory}" right now.`}{" "}
              <Link to="/contact" className="font-semibold text-brand-700 hover:text-brand-900">
                Contact us
              </Link>{" "}
              if you're after something specific.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <Link
                  key={item.slug}
                  to={`/marketplace/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:border-brand-200"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-brand-100">
                    {item.image_path ? (
                      <img
                        src={item.image_path}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B9D6C2" strokeWidth="1.3">
                          <path d="M5 8h14l-1 12H6L5 8Z" />
                          <path d="M9 8a3 3 0 0 1 6 0" />
                        </svg>
                      </div>
                    )}
                    {item.status === "out_of_stock" && (
                      <span className="absolute left-3 top-3">
                        <StatusBadge tone="neutral" size="sm">
                          Out of stock
                        </StatusBadge>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-5">
                    {item.category && (
                      <span className="text-[11.5px] font-bold uppercase tracking-wide text-brand-700">
                        {CATEGORY_LABELS[item.category] ?? item.category}
                        {item.condition ? ` · ${item.condition === "new" ? "New" : "Used"}` : ""}
                      </span>
                    )}
                    <h3 className="text-[16px] font-bold text-ink">{item.name}</h3>
                    {item.description && <p className="line-clamp-2 text-[13.5px] text-muted">{item.description}</p>}
                    <span className="mt-auto pt-2 text-[14.5px] font-bold text-ink">{formatPrice(item)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      <CtaBand
        title="Looking for something not listed here?"
        description="Contact us with what you need — we'll let you know if it's something we can source or arrange."
        actions={[{ label: "Contact us", to: "/contact" }]}
      />
    </div>
  );
}
