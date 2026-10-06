import { useState } from "react";
import { Link } from "react-router";
import pool from "../../db";
import PageHeader from "../components/page-header";
import Container from "../components/container";
import FilterChip from "../components/filter-chip";
import StatusBadge from "../components/status-badge";
import CtaBand from "../components/cta-band";
import GalleryLightbox from "../components/gallery-lightbox";
import { cached } from "../lib/cache.server";
import type { Route } from "./+types/gallerypage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Gallery | Machinery Ring Rwanda" }];
}

const CATEGORIES = ["All", "Equipment", "Training", "Field days", "Demonstration farms"];

const CATEGORY_LABELS: Record<string, string> = {
  equipment: "Equipment",
  training: "Training",
  field_days: "Field days",
  demonstration_farms: "Demonstration farms",
};

export async function loader() {
  const rows = await cached("gallery:published", 60_000, async () => {
    const result = await pool.query(
      "SELECT image_path, caption, category FROM gallery_items WHERE is_published = true ORDER BY sort_order, created_at DESC"
    );
    return result.rows;
  });
  return {
    photos: rows.map((row) => ({
      tag: CATEGORY_LABELS[row.category as string] ?? "Gallery",
      caption: row.caption || "Photo from a Machinery Ring Rwanda activity.",
      src: row.image_path as string,
    })),
  };
}

export default function GalleryPage({ loaderData }: Route.ComponentProps) {
  const { photos } = loaderData;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? photos
    : photos.filter((p) => p.tag === activeCategory);

  return (
    <div>
      <PageHeader
        crumb="Gallery"
        title="Gallery"
        intro="Photos from field days, training and equipment demonstrations across our local Rings in Gashora Sector, Bugesera District."
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
              Photos are added here as they're confirmed from Ring activities. Check back soon, or{" "}
              <Link to="/contact" className="font-semibold text-brand-700 hover:text-brand-900">
                contact us
              </Link>{" "}
              if you have one to share.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`Open photo: ${photo.caption}`}
                  className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-brand-200 bg-brand-100 text-left"
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-[rgba(9,38,22,0.82)] to-transparent px-3.5 py-3">
                    <StatusBadge tone="overlay" size="sm">
                      {photo.tag}
                    </StatusBadge>
                    <span className="text-xs leading-[1.4] text-white">{photo.caption}</span>
                  </div>
                  <span className="absolute inset-0 bg-transparent transition group-hover:bg-[rgba(0,0,0,0.1)]" />
                </button>
              ))}
            </div>
          )}
        </Container>
      </section>

      <CtaBand
        title="Have a photo from a Ring activity?"
        description="Contact us to share photos from field days, training or your own farm. With your permission, we will add them here."
        actions={[{ label: "Contact us", to: "/contact" }]}
      />

      {openIndex !== null && (
        <GalleryLightbox
          photos={filtered}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </div>
  );
}
