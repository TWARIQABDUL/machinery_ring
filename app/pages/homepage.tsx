import { Link } from "react-router";
import SiteHeader from "../components/site-header";
import Container from "../components/container";
import SectionHeading from "../components/section-heading";
import IconBadge from "../components/icon-badge";
import CtaBand from "../components/cta-band";
import { cn } from "../lib/cn";
import { useT, type StringKey } from "../lib/i18n";
import type { Route } from "./+types/homepage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Machinery Ring Rwanda | Access agricultural machinery through farmer cooperation" },
    {
      name: "description",
      content:
        "Machinery Ring Rwanda brings farmers together to access agricultural machinery, practical training and coordinated services in Gashora Sector, Bugesera District.",
    },
  ];
}

const SUPPORT_PILLARS: { titleKey: StringKey; bodyKey: StringKey; icon: React.ReactNode }[] = [
  {
    titleKey: "home.pillar1.title",
    bodyKey: "home.pillar1.body",
    icon: <path d="M12 21v-9M12 13c1-4 4-6 7-6-1 4-4 6-7 6ZM12 15c-1-3-3.5-5-6.5-5 1 3 3.5 5 6.5 5Z" />,
  },
  {
    titleKey: "home.pillar2.title",
    bodyKey: "home.pillar2.body",
    icon: <path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1V5ZM12 6v13" />,
  },
  {
    titleKey: "home.pillar3.title",
    bodyKey: "home.pillar3.body",
    icon: (
      <path d="M9 8a3.2 3.2 0 1 0 0 6.4A3.2 3.2 0 0 0 9 8ZM3 20c0-3.6 2.7-6 6-6s6 2.4 6 6M17.5 9a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8ZM15.3 20c.3-2.7 2-4.7 4.7-5.1" />
    ),
  },
];

const EXPLORE_LINKS = [
  {
    to: "/services",
    title: "Explore our services",
    body: "Planting, shelling, threshing, training and more.",
    image: "/images/gallery/9L9A1980.JPG",
    imageAlt: "Machinery Ring Rwanda equipment displayed at a field day — tractors, shellers and planting machines",
  },
  {
    to: "/our-work",
    title: "See our work",
    body: "The Kenya–Rwanda project, demonstration farms and field updates.",
    image: "/images/gallery/SAGA0271.jpg",
    imageAlt: "Farmers and trainers gathered around machinery during a Machinery Ring Rwanda demonstration",
  },
  {
    to: "/gallery",
    title: "Browse the gallery",
    body: "Photos from field days, training and equipment demonstrations.",
    image: "/images/gallery/9L9A7910.JPG",
    imageAlt: "Farmer demonstrating a seeder to a crowd of participants at a Machinery Ring Rwanda field day",
  },
  {
    to: "/blog",
    title: "Read the blog",
    body: "Updates from local Rings, field days and training.",
    image: "/images/gallery/SAGA0314.jpg",
    imageAlt: "Farmers and partners engaged at a Machinery Ring Rwanda machinery demonstration event",
  },
  {
    to: "/marketplace",
    title: "Browse the marketplace",
    body: "Equipment, spare parts and inputs Machinery Ring Rwanda can source or arrange.",
    image: "https://images.pexels.com/photos/13387076/pexels-photo-13387076.jpeg?auto=compress&cs=tinysrgb&w=1280",
    imageAlt: "Tractor working in a field under a bright sky",
  },
];

const STATS = [
  { value: "817", label: "registered farmers" },
  { value: "5", label: "local Rings in Gashora" },
  { value: "25", label: "training events held" },
  { value: "900+", label: "participant attendances" },
];

export default function HomePage() {
  const t = useT();

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-deep px-3 pb-3 pt-3 md:px-6 md:pb-6 md:pt-6">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10">
          {/* Crossfading photo slideshow — these four images paint first, so the
              content below (added after them in markup) layers on top without
              needing z-index. */}
          <img
            src="https://images.pexels.com/photos/34594551/pexels-photo-34594551.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Aerial view of farmland across the hills — the landscape Machinery Ring Rwanda farmers work every season"
            className="hero-fade h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <img
            src="/images/gallery/SAGA0306.jpg"
            alt="Farmers gathered at a Machinery Ring Rwanda demonstration and training event"
            className="hero-fade h-full w-full object-cover"
          />
          <img
            src="/images/gallery/SAGA0271.jpg"
            alt="Farmers and trainers gathered around machinery during a Machinery Ring Rwanda training event"
            className="hero-fade h-full w-full object-cover"
          />
          <img
            src="/images/gallery/9L9A7764.JPG"
            alt="Machinery Ring Rwanda farmers celebrating together at a field day with shared equipment"
            className="hero-fade h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,42,26,0.12)] to-[rgba(15,42,26,0.58)]" />

          <div className="relative flex min-h-[560px] flex-col px-6 pb-8 pt-5 md:min-h-[600px] md:px-10 md:pb-10 md:pt-6">
            <div className="sticky top-0 z-50 -mx-6 -mt-5 bg-gradient-to-b from-deep/85 from-60% to-transparent px-6 pb-6 pt-5 md:-mx-10 md:-mt-6 md:px-10 md:pt-6">
              <SiteHeader variant="overlay" />
            </div>

            {/* Headline, description and CTAs grouped as one left-aligned block. */}
            <div className="mt-auto flex max-w-[640px] flex-col gap-5">
              <h1 className="font-display text-[32px] font-normal leading-[1.2] tracking-[-0.01em] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.6)] md:text-[48px]">
                {t("home.title")}
              </h1>
              <p className="max-w-[46em] text-[15px] leading-relaxed text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.55)] md:text-base">{t("home.body")}</p>
              <div className="flex flex-wrap gap-4 pt-1">
                <Link
                  to="/contact#request"
                  className="rounded-full bg-white px-7 py-4 text-[15px] font-semibold text-deep hover:bg-cream"
                >
                  {t("cta.requestService")}
                </Link>
                <Link
                  to="/services"
                  className="rounded-full border border-white/50 px-7 py-4 text-[15px] font-semibold text-white hover:bg-white/10"
                >
                  {t("cta.seeServices")}
                </Link>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <div className="flex shrink-0 items-center gap-6">
                <div className="hidden items-center gap-1.5 md:flex" aria-hidden="true">
                  <span className="hero-fade-dot" />
                  <span className="hero-fade-dot" />
                  <span className="hero-fade-dot" />
                  <span className="hero-fade-dot" />
                </div>
                <a
                  href="#support"
                  className="flex items-center gap-2.5 text-[13px] font-medium text-white/80 hover:text-white"
                >
                  Explore More
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-lime text-deep">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats pill — floats over the seam between the hero and the next section ── */}
      <div className="relative z-10 flex justify-center px-4">
        <div className="-mt-9 grid grid-cols-2 gap-x-8 gap-y-4 rounded-2xl border border-line bg-white px-7 py-5 shadow-[0_24px_48px_-20px_rgba(15,42,26,0.35)] sm:gap-x-12 md:-mt-11 md:flex md:gap-0 md:divide-x md:divide-line md:rounded-full md:px-3 md:py-1.5">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-0.5 text-center md:px-9 md:py-3.5">
                <span className="font-display text-[20px] font-bold text-deep md:text-[26px]">{stat.value}</span>
                <span className="text-[11px] text-muted md:whitespace-nowrap md:text-[12px]">{stat.label}</span>
              </div>
            ))}
        </div>
      </div>

      {/* ── How we support farmers ── */}
      <section id="support" className="bg-white">
        <Container className="py-16 md:py-20">
          <SectionHeading
            eyebrow={t("home.supportEyebrow")}
            title="How MR Rwanda Supports Farmers"
            className="mb-10 max-w-[40em]"
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[3fr_2fr]">
            {/* Large image card */}
            <div className="relative min-h-[320px] overflow-hidden rounded-2xl md:min-h-0">
              <img
                src="/images/gallery/SAGA0306.jpg"
                alt="Farmers gathered at a Machinery Ring Rwanda demonstration and training event"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-7">
                <p className="text-[22px] font-bold leading-snug text-white">
                  Farmers working together, every season
                </p>
                <Link
                  to="/our-work"
                  className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-deep hover:bg-cream"
                >
                  See our work
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Stacked pillar cards */}
            <div className="flex flex-col gap-4">
              {SUPPORT_PILLARS.map((pillar) => (
                <div
                  key={pillar.titleKey}
                  className="flex flex-col gap-2.5 rounded-2xl border border-line bg-cream-2 p-6"
                >
                  <IconBadge size="sm">{pillar.icon}</IconBadge>
                  <h3 className="text-base font-bold text-ink">{t(pillar.titleKey)}</h3>
                  <p className="text-[13.5px] text-muted">{t(pillar.bodyKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Explore ── */}
      <section className="bg-cream-2">
        <Container className="py-16 md:py-20">
          <SectionHeading
            eyebrow="Explore"
            title={
              <>
                <em className="accent-word">Everything</em> Machinery Ring Rwanda does
              </>
            }
            className="mb-10 max-w-[38em]"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {EXPLORE_LINKS.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative overflow-hidden rounded-2xl",
                  i === EXPLORE_LINKS.length - 1 && "sm:col-span-2"
                )}
              >
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,38,22,0.88)] via-[rgba(9,38,22,0.35)] to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[17px] font-bold text-white">{item.title}</h3>
                    <p className="text-[13px] text-[#CDE8D6]">{item.body}</p>
                  </div>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title={
          <>
            Tell us what you <em className="accent-word">need</em>
          </>
        }
        description="Contact us with your location, crop, required service and preferred timing. We will discuss availability, cost and the next steps."
        actions={[
          { label: t("cta.requestService"), to: "/contact#request" },
          { label: "Call +250 781 444 069", href: "tel:+250781444069", variant: "secondary" },
        ]}
      />
    </div>
  );
}
