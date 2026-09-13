import { useState } from "react";
import PageHeader from "../components/page-header";
import Container from "../components/container";
import FilterChip from "../components/filter-chip";
import StatusBadge from "../components/status-badge";
import CtaBand from "../components/cta-band";
import GalleryLightbox from "../components/gallery-lightbox";
import type { Route } from "./+types/gallerypage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Gallery — Machinery Ring Rwanda" }];
}

const CATEGORIES = ["All", "Equipment", "Training", "Field days", "Demonstration farms"];

// Static for now — will read from the `gallery_items` table once the Gallery admin exists.
const PHOTOS = [
  {
    tag: "Equipment",
    caption: "Participants gather around agricultural machinery during an MR Rwanda activity.",
    src: "/images/hero-photo.jpg",
  },
  { tag: "Equipment", caption: "Photo pending — explaining agricultural equipment during a Machinery Ring Rwanda display." },
  { tag: "Training", caption: "Photo pending — participants listen to a practical explanation beside processing equipment." },
  { tag: "Field days", caption: "Photo pending — field day in Mwendo, September 2024." },
  { tag: "Field days", caption: "Photo pending — field day in Kagomasi, September 2024." },
  { tag: "Field days", caption: "Photo pending — Mwendo and Kagomasi field days, January 2026." },
  { tag: "Training", caption: "Photo pending — women's leadership and communication training, January 2026." },
  { tag: "Training", caption: "Photo pending — Microsoft Word and Excel training, March 2026." },
  { tag: "Demonstration farms", caption: "Photo pending — demonstration farm activity in Gashora Sector." },
];

export default function GalleryPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
              <FilterChip key={cat} active={cat === "All"}>
                {cat}
              </FilterChip>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PHOTOS.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Open photo: ${photo.caption}`}
                className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-brand-200 bg-brand-100 text-left"
              >
                {photo.src && (
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-[rgba(9,38,22,0.82)] to-transparent px-3.5 py-3">
                  <StatusBadge tone="overlay" size="sm">{photo.tag}</StatusBadge>
                  <span className="text-xs leading-[1.4] text-white">{photo.caption}</span>
                </div>
                <span className="absolute inset-0 bg-transparent transition group-hover:bg-[rgba(0,0,0,0.1)]" />
              </button>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-muted-2">
            Only one photo above is a supplied image; the rest are placeholders marked pending until real photographs
            are confirmed for use.
          </p>
        </Container>
      </section>

      <CtaBand
        title="Have a photo from a Ring activity?"
        description="Contact us to share photos from field days, training or your own farm — with your permission, we'll add them here."
        actions={[{ label: "Contact us", to: "/contact" }]}
      />

      {openIndex !== null && (
        <GalleryLightbox
          photos={PHOTOS}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </div>
  );
}
