import { Link } from "react-router";
import pool from "../../db";
import PageHeader from "../components/page-header";
import Container from "../components/container";
import IconBadge from "../components/icon-badge";
import StatusBadge from "../components/status-badge";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";
import { cached } from "../lib/cache.server";
import type { Route } from "./+types/servicespage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Services | Machinery Ring Rwanda" }];
}

// One shared icon for every card — the `services` table doesn't carry a
// per-service icon, so we use a single consistent "service" mark instead of
// inventing a specific one per row.
const SERVICE_ICON = (
  <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z" />
);

type ServiceRow = {
  slug: string;
  name: string;
  description: string | null;
  status: "available" | "in_development";
  price: string | null;
  price_unit: string | null;
  image_path: string | null;
};

export async function loader() {
  const rows = await cached("services:published", 60_000, async () => {
    const result = await pool.query<ServiceRow>(
      "SELECT slug, name, description, status, price, price_unit, image_path FROM services WHERE is_published = true ORDER BY sort_order, name"
    );
    return result.rows;
  });
  return {
    available: rows.filter((row) => row.status === "available"),
    developing: rows.filter((row) => row.status === "in_development"),
  };
}

function formatPrice(row: ServiceRow) {
  if (!row.price) return null;
  return `RWF ${Number(row.price).toLocaleString()}${row.price_unit ? ` ${row.price_unit}` : ""}`;
}

// The `services` table has no category column yet, so we group "available"
// services for display by matching keywords in their name/description. This
// keeps mechanization work visually separate from training/advisory
// activities per client feedback, without a schema change — if the client
// wants admins to set this directly, add a `category` column instead.
type ServiceCategoryKey = "mechanization" | "training" | "advisory";

const SERVICE_CATEGORIES: { key: ServiceCategoryKey; title: string; description: string }[] = [
  {
    key: "mechanization",
    title: "Mechanization Services",
    description:
      "Planting support uses available planting equipment, including hand-held planters. Seed, fertiliser and other input arrangements are agreed separately.",
  },
  {
    key: "training",
    title: "Training & Capacity Building",
    description:
      "Practical learning on machinery use, crop establishment, soil health, spraying practices, post-harvest handling and farm-business skills.",
  },
  {
    key: "advisory",
    title: "Agricultural Advisory Support",
    description: "Guidance to help farmers plan ahead and make the most of the services and training above.",
  },
];

function categorizeService(service: ServiceRow): ServiceCategoryKey {
  const text = `${service.name} ${service.description ?? ""}`.toLowerCase();
  if (text.includes("advisory") || text.includes("advice")) return "advisory";
  if (text.includes("training") || text.includes("learning") || text.includes("capacity")) return "training";
  return "mechanization";
}

const FALLBACK_IMAGES = [
  {
    src: "https://images.pexels.com/photos/34594551/pexels-photo-34594551.jpeg?auto=compress&cs=tinysrgb&w=1280",
    alt: "Green fields — agricultural land ready for machinery services",
  },
  {
    src: "https://images.pexels.com/photos/14314165/pexels-photo-14314165.jpeg?auto=compress&cs=tinysrgb&w=1280",
    alt: "Farmers working together in the field",
  },
  {
    src: "https://images.pexels.com/photos/12835164/pexels-photo-12835164.jpeg?auto=compress&cs=tinysrgb&w=1280",
    alt: "Crops growing on productive agricultural land",
  },
  {
    src: "https://images.pexels.com/photos/39662345/pexels-photo-39662345.jpeg?auto=compress&cs=tinysrgb&w=1280",
    alt: "Women farmers harvesting in verdant fields",
  },
];

/**
 * The slider's CSS (app.css `.svc-slide`) is tuned for a fixed 4-slot cycle,
 * so we always feed it exactly 4 slides: capped at 4 if there are more,
 * repeated from the top if there are fewer, so it never sits on dead air.
 */
function buildSliderSlides<T>(items: T[], slotCount = 4): T[] {
  if (items.length === 0) return [];
  if (items.length >= slotCount) return items.slice(0, slotCount);
  return Array.from({ length: slotCount }, (_, i) => items[i % items.length]);
}

export default function ServicesPage({ loaderData }: Route.ComponentProps) {
  const { available, developing } = loaderData;
  const sliderSlides = buildSliderSlides(available);
  const t = useT();

  return (
    <div>
      <PageHeader crumb={t("nav.services")} title={t("services.title")} intro={t("services.intro")} />

      {sliderSlides.length > 0 && (
        <section className="bg-white">
          <Container className="pt-12">
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-[0_24px_50px_-30px_rgba(15,61,36,0.3)]">
              {sliderSlides.map((service, i) => (
                <div key={i} className="svc-slide bg-brand-100">
                  <img
                    src={service.image_path ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length].src}
                    alt={service.image_path ? service.name : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length].alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1.5 bg-gradient-to-t from-[rgba(9,38,22,0.85)] to-transparent px-6.5 pb-4.5 pt-8 text-white">
                    <h3 className="text-lg font-bold text-white">{service.name}</h3>
                    {service.description && (
                      <p className="line-clamp-2 text-[13.5px] text-[#E7F2EA]">{service.description}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="absolute inset-x-0 bottom-3.5 flex justify-center gap-1.5">
                {sliderSlides.map((_, i) => (
                  <span key={i} className="svc-dot" />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Available now */}
      {available.length > 0 && (
        <section className="bg-white">
          <Container className="py-14">
            <div className="mb-9 flex items-center gap-2.5">
              <StatusBadge tone="solid">{t("services.availableNow")}</StatusBadge>
              <span className="text-sm text-muted">{t("services.availableNote")}</span>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {SERVICE_CATEGORIES.map((category) => {
                const items = available.filter((service) => categorizeService(service) === category.key);
                if (items.length === 0) return null;
                return (
                  <div key={category.key} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-lg font-bold text-ink">{category.title}</h3>
                      <p className="text-[13.5px] leading-[1.6] text-muted">{category.description}</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      {items.map((service) => {
                        const price = formatPrice(service);
                        return (
                          <div
                            key={service.slug}
                            className="flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-6"
                          >
                            <IconBadge size="sm">{SERVICE_ICON}</IconBadge>
                            <h4 className="text-[15px] font-bold text-ink">{service.name}</h4>
                            {service.description && (
                              <p className="text-[13.5px] text-muted">{service.description}</p>
                            )}
                            {price && (
                              <span className="w-fit rounded-full bg-brand-50 px-3 py-1 text-[12.5px] font-semibold text-brand-700">
                                {price}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Services being developed */}
      {developing.length > 0 && (
        <section className="bg-[#F7F9F7]">
          <Container className="py-14">
            <div className="mb-7 flex items-center gap-2.5">
              <StatusBadge tone="amber">{t("services.inDevelopment")}</StatusBadge>
              <span className="text-sm text-muted">{t("services.developingNote")}</span>
            </div>
            <div className="flex flex-col">
              {developing.map((service, i) => (
                <div
                  key={service.slug}
                  className={cn(
                    "grid grid-cols-1 gap-3 border-t border-line py-5 sm:grid-cols-[220px_1fr] sm:gap-6",
                    i === developing.length - 1 && "border-b"
                  )}
                >
                  <h3 className="text-base font-bold text-ink">{service.name}</h3>
                  {service.description && <p className="text-[14.5px] text-muted">{service.description}</p>}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Prices and confirmation */}
      <section className="bg-white">
        <Container className="py-16">
          <div className="flex flex-col gap-3.5 rounded-2xl border border-line bg-brand-50 p-9">
            <h2 className="font-display text-[22px] font-extrabold text-ink">{t("services.pricesTitle")}</h2>
            <p className="text-[15.5px] leading-[1.7] text-ink-soft">{t("services.pricesBody")}</p>
            <Link
              to="/contact#request"
              className="mt-2 w-fit rounded-lg bg-brand-600 px-6 py-3 text-[15px] font-semibold text-white hover:bg-brand-700"
            >
              {t("cta.requestService")}
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
