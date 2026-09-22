import { Link } from "react-router";
import pool from "../../db";
import PageHeader from "../components/page-header";
import Container from "../components/container";
import IconBadge from "../components/icon-badge";
import StatusBadge from "../components/status-badge";
import { cn } from "../lib/cn";
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
  const { rows } = await pool.query<ServiceRow>(
    "SELECT slug, name, description, status, price, price_unit, image_path FROM services WHERE is_published = true ORDER BY sort_order, name"
  );
  return {
    available: rows.filter((row) => row.status === "available"),
    developing: rows.filter((row) => row.status === "in_development"),
  };
}

function formatPrice(row: ServiceRow) {
  if (!row.price) return null;
  return `RWF ${Number(row.price).toLocaleString()}${row.price_unit ? ` ${row.price_unit}` : ""}`;
}

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

  return (
    <div>
      <PageHeader
        crumb="Services"
        title="Our Services"
        intro="We coordinate agricultural services and practical support through our local network. Tell us what you need so we can check the equipment, operator, location and timing before confirming the work and price."
      />

      {sliderSlides.length > 0 && (
        <section className="bg-white">
          <Container className="pt-12">
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-[0_24px_50px_-30px_rgba(15,61,36,0.3)]">
              {sliderSlides.map((service, i) => (
                <div key={i} className="svc-slide bg-brand-100">
                  {service.image_path ? (
                    <img src={service.image_path} alt={service.name} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#B9D6C2" strokeWidth="1.3">
                      {SERVICE_ICON}
                    </svg>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1.5 bg-gradient-to-t from-[rgba(9,38,22,0.85)] to-transparent px-6.5 pb-4.5 pt-8 text-white">
                    {!service.image_path && (
                      <StatusBadge tone="overlay" size="sm">
                        Photo pending
                      </StatusBadge>
                    )}
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
              <StatusBadge tone="solid">Available now</StatusBadge>
              <span className="text-sm text-muted">Requests assessed and confirmed individually</span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {available.map((service) => {
                const price = formatPrice(service);
                return (
                  <div key={service.slug} className="flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-7">
                    <IconBadge>{SERVICE_ICON}</IconBadge>
                    <h3 className="text-lg font-bold text-ink">{service.name}</h3>
                    {service.description && <p className="text-[15px] text-muted">{service.description}</p>}
                    {price && (
                      <span className="w-fit rounded-full bg-brand-50 px-3 py-1 text-[13px] font-semibold text-brand-700">
                        {price}
                      </span>
                    )}
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
              <StatusBadge tone="amber">In development</StatusBadge>
              <span className="text-sm text-muted">Register interest. Dates depend on confirmed capacity.</span>
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
            <h2 className="font-display text-[22px] font-extrabold text-ink">Prices and confirmation</h2>
            <p className="text-[15.5px] leading-[1.7] text-ink-soft">
              Contact us for the applicable rate. The team will explain the unit charged, any member or non-member rate
              and additional costs before you agree to the work. A service request becomes a booking only after
              availability, timing and price have been confirmed with you.
            </p>
            <Link
              to="/contact#request"
              className="mt-2 w-fit rounded-lg bg-brand-600 px-6 py-3 text-[15px] font-semibold text-white hover:bg-brand-700"
            >
              Request a service
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
