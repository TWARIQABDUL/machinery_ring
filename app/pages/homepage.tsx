import { Link } from "react-router";
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
    body: "Equipment, spare parts and inputs the cooperative can source or arrange.",
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
      <section className="relative overflow-hidden bg-white">
        <Container className="grid gap-14 py-16 md:grid-cols-2 md:items-center md:py-20">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-[13px] font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              Farmer&#8209;led cooperation &middot; Gashora Sector, Bugesera
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              {t("home.title")}
            </h1>
            <p className="max-w-[32em] text-lg text-muted">{t("home.body")}</p>
            <div className="flex flex-wrap gap-3.5">
              <Link
                to="/contact#request"
                className="rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-brand-700"
              >
                {t("cta.requestService")}
              </Link>
              <Link
                to="/services"
                className="rounded-lg border-[1.5px] border-brand-200 bg-white px-6 py-3.5 text-base font-semibold text-brand-700 hover:bg-brand-50"
              >
                {t("cta.seeServices")}
              </Link>
            </div>
          </div>

          {/* Sliding image stack */}
          <div className="relative py-6 pr-6 md:pr-12">
            <div className="absolute right-0 top-2 h-[92%] w-[82%] rounded-[22px] bg-brand-50" />
            <div className="relative aspect-[3/2]">
              <div className="hero-slide overflow-hidden rounded-2xl bg-brand-900 shadow-[0_20px_45px_-20px_rgba(15,61,36,0.45)]">
                <img
                  src="https://images.pexels.com/photos/34594551/pexels-photo-34594551.jpeg?auto=compress&cs=tinysrgb&w=1280"
                  alt="Lush green fields stretching across the hills — the kind of landscape Machinery Ring Rwanda farmers work every season"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(9,38,22,0.82)] to-transparent px-4.5 pb-3.5 pt-5">
                  <span className="text-[13px] font-medium text-white">
                    Green fields across the growing season — the landscape MR Rwanda farmers work together.
                  </span>
                </div>
              </div>

              <div className="hero-slide overflow-hidden rounded-2xl bg-brand-900 shadow-[0_20px_45px_-20px_rgba(15,61,36,0.45)]">
                <img
                  src="/images/gallery/SAGA0271.jpg"
                  alt="Farmers and trainers gathered around machinery during a Machinery Ring Rwanda training event"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(9,38,22,0.82)] to-transparent px-4.5 pb-3.5 pt-5">
                  <span className="text-[13px] font-medium text-white">
                    Hands-on training — farmers learning to use shared machinery across the Ring.
                  </span>
                </div>
              </div>

              <div className="hero-slide overflow-hidden rounded-2xl bg-brand-900 shadow-[0_20px_45px_-20px_rgba(15,61,36,0.45)]">
                <img
                  src="https://images.pexels.com/photos/12835164/pexels-photo-12835164.jpeg?auto=compress&cs=tinysrgb&w=1280"
                  alt="Crops growing on a plantation, showing productive agricultural land under cultivation"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(9,38,22,0.82)] to-transparent px-4.5 pb-3.5 pt-5">
                  <span className="text-[13px] font-medium text-white">
                    Productive land under cultivation — supported by shared machinery access.
                  </span>
                </div>
              </div>

              <div className="hero-slide overflow-hidden rounded-2xl bg-brand-900 shadow-[0_20px_45px_-20px_rgba(15,61,36,0.45)]">
                <img
                  src="/images/gallery/9L9A7764.JPG"
                  alt="Machinery Ring Rwanda farmers celebrating together at a field day with shared equipment"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(9,38,22,0.82)] to-transparent px-4.5 pb-3.5 pt-5">
                  <span className="text-[13px] font-medium text-white">
                    The Machinery Ring Rwanda community — farmers and partners united through shared access.
                  </span>
                </div>
              </div>

              <div className="absolute inset-x-0 -bottom-6 z-10 flex justify-center gap-1.5">
                <span className="hero-dot" />
                <span className="hero-dot" />
                <span className="hero-dot" />
                <span className="hero-dot" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-navy">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col gap-1 py-8 ${i === 0 ? "pr-6" : i === STATS.length - 1 ? "pl-6" : "px-6"}`}
              >
                <span className="font-display text-[30px] font-extrabold text-brand-600">{stat.value}</span>
                <span className="text-[13px] text-[#A9CFB6]">{stat.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── How we support farmers ── */}
      <section className="bg-white">
        <Container className="py-16 md:py-20">
          <SectionHeading
            eyebrow={t("home.supportEyebrow")}
            title="Machinery, learning and organisation. Together."
            className="mb-10 max-w-[40em]"
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[3fr_2fr]">
            {/* Large image card */}
            <div className="relative min-h-[320px] overflow-hidden rounded-2xl md:min-h-0">
              <img
                src="/images/gallery/SAGA0306.jpg"
                alt="Farmers gathered at a Machinery Ring Rwanda demonstration and training event"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-7">
                <p className="text-[22px] font-bold leading-snug text-white">
                  Farmers working together, every season
                </p>
                <Link
                  to="/our-work"
                  className="inline-flex w-fit items-center gap-1.5 border-b border-white/40 pb-0.5 text-sm font-semibold text-white"
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
                  className="flex flex-col gap-2.5 rounded-2xl border border-line bg-[#F7F9F7] p-6"
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
      <section className="bg-[#F7F9F7]">
        <Container className="py-16 md:py-20">
          <SectionHeading
            eyebrow="Explore"
            title="Everything Machinery Ring Rwanda does"
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
        title="Tell us what you need"
        description="Contact us with your location, crop, required service and preferred timing. We will discuss availability, cost and the next steps."
        actions={[
          { label: t("cta.requestService"), to: "/contact#request" },
          { label: "Call +250 781 444 069", href: "tel:+250781444069", variant: "secondary" },
        ]}
      />
    </div>
  );
}
