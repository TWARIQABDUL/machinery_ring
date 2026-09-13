import { Link } from "react-router";
import Container from "../components/container";
import SectionHeading from "../components/section-heading";
import IconBadge from "../components/icon-badge";
import StatusBadge from "../components/status-badge";
import Stat from "../components/stat";
import CtaBand from "../components/cta-band";
import type { Route } from "./+types/homepage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Machinery Ring Rwanda — Access agricultural machinery through farmer cooperation" },
    {
      name: "description",
      content:
        "Machinery Ring Rwanda brings farmers together to access agricultural machinery, practical training and coordinated services in Gashora Sector, Bugesera District.",
    },
  ];
}

const SUPPORT_PILLARS = [
  {
    title: "Agricultural services",
    body: "Planting support, maize shelling and rice threshing, with availability and arrangements confirmed for each request.",
    icon: <path d="M12 21v-9M12 13c1-4 4-6 7-6-1 4-4 6-7 6ZM12 15c-1-3-3.5-5-6.5-5 1 3 3.5 5 6.5 5Z" />,
  },
  {
    title: "Practical learning",
    body: "Training and demonstrations on machinery use, farming practices, post-harvest handling and farm-business skills.",
    icon: <path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1V5ZM12 6v13" />,
  },
  {
    title: "Farmer organisation",
    body: "Support for local leadership, group coordination and women's participation.",
    icon: (
      <path d="M9 8a3.2 3.2 0 1 0 0 6.4A3.2 3.2 0 0 0 9 8ZM3 20c0-3.6 2.7-6 6-6s6 2.4 6 6M17.5 9a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8ZM15.3 20c.3-2.7 2-4.7 4.7-5.1" />
    ),
  },
];

const EXPLORE_LINKS = [
  { to: "/services", title: "Explore our services", body: "Planting, shelling, threshing, training and more — available now and being developed." },
  { to: "/our-work", title: "See our work", body: "The Kenya–Rwanda mechanisation project, demonstration farms and field updates." },
  { to: "/gallery", title: "Browse the gallery", body: "Photos from field days, training and equipment demonstrations." },
  { to: "/blog", title: "Read the blog", body: "Updates from local Rings, field days and training." },
];

const STATS = [
  { value: "817", label: "registered farmers" },
  { value: "5", label: "local Rings in Gashora" },
  { value: "25", label: "training events held" },
  { value: "900+", label: "participant attendances" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <Container className="grid gap-14 py-16 md:grid-cols-2 md:items-center md:py-20">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-[13px] font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              Farmer&#8209;led cooperation &middot; Gashora Sector, Bugesera
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              Access agricultural machinery through farmer cooperation
            </h1>
            <p className="max-w-[32em] text-lg text-muted">
              Machinery Ring Rwanda brings farmers together to access agricultural machinery, practical training and
              coordinated services &mdash; so no household has to buy and maintain every machine it needs.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link
                to="/contact#request"
                className="rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-brand-700"
              >
                Request a service
              </Link>
              <Link
                to="/services"
                className="rounded-lg border-[1.5px] border-brand-200 bg-white px-6 py-3.5 text-base font-semibold text-brand-700 hover:bg-brand-50"
              >
                See our services
              </Link>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1B7A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
              </svg>
              <span className="text-[14.5px] text-muted">
                <strong className="text-ink">817 registered farmers</strong> across 5 local Rings{" "}
                <Link to="/our-work" className="text-brand-700 hover:text-brand-900">
                  &middot; see our work &rarr;
                </Link>
              </span>
            </div>
          </div>

          <div className="relative py-6 pr-6 md:pr-12">
            <div className="absolute right-0 top-2 h-[92%] w-[82%] rounded-[22px] bg-brand-50" />
            <div className="relative aspect-[3/2]">
              <div className="hero-slide overflow-hidden rounded-2xl bg-brand-900 shadow-[0_20px_45px_-20px_rgba(15,61,36,0.45)]">
                <img
                  src="/images/hero-photo.jpg"
                  alt="Farmers and cooperative staff gather around agricultural machinery at an MR Rwanda field event"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(9,38,22,0.82)] to-transparent px-4.5 pb-3.5 pt-5">
                  <span className="text-[13px] font-medium text-white">
                    Participants gather around agricultural machinery during an MR Rwanda activity.
                  </span>
                </div>
              </div>

              <div className="hero-slide flex items-center justify-center overflow-hidden rounded-2xl bg-brand-100 shadow-[0_20px_45px_-20px_rgba(15,61,36,0.45)]">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#B9D6C2" strokeWidth="1.3">
                  <path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1V5Z" />
                  <path d="M12 6v13" />
                </svg>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1.5 bg-gradient-to-t from-[rgba(9,38,22,0.82)] to-transparent px-4.5 pb-3.5 pt-5 text-[13px] text-white">
                  <StatusBadge tone="overlay" size="sm">Photo pending</StatusBadge>
                  Farmers receiving hands&#8209;on training in machinery use and maintenance.
                </div>
              </div>

              <div className="hero-slide flex items-center justify-center overflow-hidden rounded-2xl bg-brand-100 shadow-[0_20px_45px_-20px_rgba(15,61,36,0.45)]">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#B9D6C2" strokeWidth="1.3">
                  <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
                  <circle cx="12" cy="9.5" r="2.2" />
                </svg>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1.5 bg-gradient-to-t from-[rgba(9,38,22,0.82)] to-transparent px-4.5 pb-3.5 pt-5 text-[13px] text-white">
                  <StatusBadge tone="overlay" size="sm">Photo pending</StatusBadge>
                  A local Ring field day in Gashora Sector.
                </div>
              </div>

              <div className="absolute inset-x-0 -bottom-6 z-10 flex justify-center gap-1.5">
                <span className="hero-dot" />
                <span className="hero-dot" />
                <span className="hero-dot" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How we support farmers */}
      <section className="bg-[#F7F9F7]">
        <Container className="py-16 md:py-20">
          <SectionHeading
            eyebrow="How we support farmers"
            title="Machinery, learning and organisation — together"
            className="mb-10 max-w-[40em]"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {SUPPORT_PILLARS.map((pillar) => (
              <div key={pillar.title} className="flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-7">
                <IconBadge>{pillar.icon}</IconBadge>
                <h3 className="text-lg font-bold text-ink">{pillar.title}</h3>
                <p className="text-[15px] text-muted">{pillar.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Explore more */}
      <section className="bg-white">
        <Container className="pb-16 md:pb-20">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {EXPLORE_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-brand-50 px-6.5 py-6"
              >
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[17px] font-bold text-ink">{item.title}</h3>
                  <p className="text-[13.5px] text-muted">{item.body}</p>
                </div>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1B7A3D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Where we stand today */}
      <section className="bg-brand-900 text-white">
        <Container className="flex flex-col gap-8 py-16">
          <SectionHeading
            eyebrow="Where we stand today"
            title="Five local Rings, growing together"
            tone="dark"
            action={{ to: "/our-work", label: "See our work" }}
            className="max-w-[32em]"
          />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <Stat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
          <p className="text-[12.5px] text-[#8FBF9F]">
            Project records presented August 2026. Attendances include people joining more than one session.
          </p>
        </Container>
      </section>

      <CtaBand
        title="Tell us what you need"
        description="Contact us with your location, crop, required service and preferred timing. We will discuss availability, cost and the next steps."
        actions={[
          { label: "Request a service", to: "/contact#request" },
          { label: "Call +250 781 707 587", href: "tel:+250781707587", variant: "secondary" },
        ]}
      />
    </div>
  );
}
