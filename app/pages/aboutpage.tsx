import { Link } from "react-router";
import pool from "../../db";
import Container from "../components/container";
import SectionHeading from "../components/section-heading";
import IconBadge from "../components/icon-badge";
import WhatsAppIcon from "../components/whatsapp-icon";
import ArrowLink from "../components/arrow-link";
import CtaBand from "../components/cta-band";
import type { Route } from "./+types/aboutpage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "About Us | Machinery Ring Rwanda" }];
}

type RingRow = { id: number; name: string; whatsapp_invite_link: string };
const PENDING_LINK_MARKER = "INVITE-LINK-PENDING";

export async function loader() {
  const { rows } = await pool.query<RingRow>(
    "SELECT id, name, whatsapp_invite_link FROM rings WHERE is_active = true ORDER BY sort_order, name"
  );
  return { rings: rows };
}


const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Share what you need",
    body: "Farmers bring requests to their local Ring — the crop, the service and the timing. The Ring coordinates who can provide it and when.",
  },
  {
    num: "02",
    title: "Equipment meets the work",
    body: "Machinery owners offer services to fellow members at agreed rates that cover real costs. No single household needs to buy every machine.",
  },
  {
    num: "03",
    title: "Skills follow the access",
    body: "Training, demonstrations and field days help farmers use equipment well and manage seasonal work more effectively.",
  },
];

const MISSION_POINTS = [
  "Coordinate machinery access and service delivery across local Rings",
  "Develop practical farming, post-harvest and business skills",
  "Strengthen local leadership, group structure and coordination",
];

const APPROACH_POINTS = [
  "Farmer priorities shape which services are developed first",
  "Equipment access and practical training work together",
  "Women's participation is built into every programme, not added on",
];

const TEAM = [
  {
    initials: "SM",
    name: "Simeon Musabende Umunyempuhwe",
    role: "Project Manager",
    bio: "Coordinates implementation, farmer support, service planning and partner engagement. Works with local Rings and institutions to turn farmers' needs into practical activities.",
    featured: true,
  },
  {
    initials: "EN",
    name: "Eric Niyonzima",
    role: "Assistant Project Manager & ICT Personnel",
    bio: "Supports field coordination, local boards, service planning and recordkeeping, including using digital tools to organise information and support communication.",
    featured: false,
  },
  {
    initials: "CM",
    name: "Chloella Munezero",
    role: "Technical Expert, Financial Reporting and M&E",
    bio: "Supports financial administration, activity monitoring and reporting, plus support for women's savings groups, financial literacy and organisational skills.",
    featured: false,
  },
];

const PARTNERS = [
  "Machinery Ring Foundation",
  "GIZ Rwanda",
  "sequa gGmbH",
  "German Development Cooperation",
];

const JOIN_CARDS = [
  {
    title: "Joining a Machinery Ring",
    body: "Contact our team or a local Ring representative to learn about membership, the applicable conditions and available services. Non-members may also enquire about services and the terms that apply to them.",
    linkLabel: "Contact us",
  },
  {
    title: "Work with us",
    body: "We welcome discussions about suitable agricultural machinery, farmer training, women's participation and local service development. Contact us with the location, farming need and proposed area of collaboration.",
    linkLabel: "Start a conversation",
  },
];

function Check({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${dark ? "bg-brand-700" : "bg-brand-100"}`}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke={dark ? "#A9CFB6" : "#1B7A3D"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

export default function AboutPage({ loaderData }: Route.ComponentProps) {
  const { rings } = loaderData;

  return (
    <div>
      {/* ── Full-bleed image hero ── */}
      <section className="relative min-h-[580px] overflow-hidden bg-brand-900">
        <img
          src="https://images.pexels.com/photos/34594551/pexels-photo-34594551.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Diagonal gradient: dark on left, fades to image on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/75 to-brand-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent" />

        <Container className="relative z-10 flex min-h-[580px] flex-col justify-end pb-16 md:justify-center md:py-24">
          <div className="flex max-w-[28em] flex-col gap-5">
            <span className="text-[13px] text-[#8FBF9F]">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              &nbsp;/&nbsp;About Us
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-[50px]">
              Farmer-led machinery cooperation in Rwanda
            </h1>
            <p className="text-[16.5px] leading-[1.7] text-[#CDE8D6]">
              We work with local farmer groups to coordinate machinery access, practical skills and the organisation
              needed to manage agricultural activities — together.
            </p>
            <div className="flex flex-wrap gap-3.5 pt-1">
              <Link
                to="/contact"
                className="rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-brand-500"
              >
                Get in touch
              </Link>
              <Link
                to="/our-work"
                className="rounded-lg border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
              >
                See our work
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Centered pull-quote ── */}
      <section className="bg-white">
        <Container className="py-14 md:py-16">
          <p className="mx-auto max-w-[46em] text-center text-[18px] leading-[1.8] text-ink-soft md:text-[20px]">
            <strong className="text-brand-700">817 farmers</strong> across five local Rings are changing how
            agricultural machinery is accessed in Rwanda — through{" "}
            <strong className="text-ink">cooperation, not individual ownership.</strong> No single household needs
            to buy every machine it needs.
          </p>
        </Container>
      </section>


      {/* ── How a Machinery Ring works — numbered steps ── */}
      <section className="bg-white">
        <Container className="py-16 md:py-20">
          <SectionHeading
            eyebrow="What is a Machinery Ring"
            title="How it works in three steps"
            description="A Machinery Ring is a local, farmer-led self-help organisation. Members share equipment access so every farm benefits from mechanisation without every farm owning every machine."
            className="mb-12 max-w-[40em]"
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.num} className="flex flex-col gap-4 rounded-2xl border border-line bg-[#F7F9F7] p-7">
                <span className="font-display text-[52px] font-extrabold leading-none text-brand-100">
                  {step.num}
                </span>
                <h3 className="text-[17px] font-bold text-ink">{step.title}</h3>
                <p className="text-[14.5px] leading-[1.7] text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Mission + Approach — side-by-side dual text columns ── */}
      <section className="bg-brand-900">
        <Container className="py-16 md:py-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
            {/* Left: Our mission */}
            <div className="flex flex-col gap-5">
              <span className="text-[13px] font-bold uppercase tracking-wide text-[#8FBF9F]">Our mission</span>
              <h2 className="font-display text-[28px] font-extrabold leading-tight text-white">
                Strengthen access to machinery, skills and coordination
              </h2>
              <p className="text-[15.5px] leading-[1.75] text-[#CDE8D6]">
                Our purpose is to ensure farmers in Gashora have reliable access to the equipment, knowledge and
                organisational support they need to farm productively.
              </p>
              <ul className="flex flex-col gap-3 pt-1">
                {MISSION_POINTS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check dark />
                    <span className="text-[14.5px] text-[#CDE8D6]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right: Our approach */}
            <div className="flex flex-col gap-5 md:border-l md:border-white/10 md:pl-16">
              <span className="text-[13px] font-bold uppercase tracking-wide text-[#8FBF9F]">Our approach</span>
              <h2 className="font-display text-[28px] font-extrabold leading-tight text-white">
                Local participation shapes every activity
              </h2>
              <p className="text-[15.5px] leading-[1.75] text-[#CDE8D6]">
                Services and programmes are built around what local Rings and farmers say they need, not the other
                way around. Coordination means listening first.
              </p>
              <ul className="flex flex-col gap-3 pt-1">
                {APPROACH_POINTS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check dark />
                    <span className="text-[14.5px] text-[#CDE8D6]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Our development — heading + wide landscape image ── */}
      <section className="bg-white">
        <Container className="py-16 md:py-20">
          <div className="mb-8 flex flex-col gap-3 max-w-[36em]">
            <span className="text-[13px] font-bold uppercase tracking-wide text-brand-700">
              Our development in Rwanda
            </span>
            <h2 className="font-display text-[30px] font-extrabold leading-tight text-ink">
              Growing from 2024 through a Kenya–Rwanda project
            </h2>
            <p className="text-[15.5px] leading-[1.75] text-ink-soft">
              Implementation in Rwanda began in 2024, focusing on establishing local Rings, introducing equipment,
              organising training and developing demonstration farms. Machinery Ring Rwanda obtained legal recognition
              in 2025. Local participation helps shape which services are developed and how they are organised.
            </p>
          </div>
          {/* Full-width wide image */}
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="https://images.pexels.com/photos/14314165/pexels-photo-14314165.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Farmers working together in the field — activities that form the basis of Ring work in Rwanda"
              className="aspect-[21/9] w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/70 to-transparent px-7 pb-5 pt-12">
              <span className="text-[13px] font-medium text-white">
                Field activities across Gashora Sector — the foundation of practical Ring work.
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Our local Rings ── */}
      {rings.length > 0 && (
        <section className="bg-[#F7F9F7]">
          <Container className="py-16">
            <SectionHeading
              eyebrow="Our local Rings"
              title="Our established network in Gashora Sector, Bugesera District"
              description="Local boards and trained farmer facilitators support communication, group activities and service coordination in each Ring. Join a Ring's WhatsApp group below, or contact us if you're not sure which one covers your area."
              className="mb-9 max-w-[44em]"
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {rings.map((ring) => {
                const hasLiveLink = !ring.whatsapp_invite_link.includes(PENDING_LINK_MARKER);
                return (
                  <div
                    key={ring.id}
                    className="flex flex-col items-center gap-2.5 rounded-2xl border border-line bg-white px-4 py-5.5 text-center"
                  >
                    <IconBadge size="sm">
                      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
                      <circle cx="12" cy="9.5" r="2.2" />
                    </IconBadge>
                    <span className="text-[14.5px] font-bold text-ink">{ring.name}</span>
                    {hasLiveLink ? (
                      <a
                        href={ring.whatsapp_invite_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-700 hover:text-brand-900"
                      >
                        <WhatsAppIcon size={14} />
                        Join on WhatsApp
                      </a>
                    ) : (
                      <span className="text-[12px] text-muted-2">Join link coming soon</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ── Team — featured card + two compact cards ── */}
      <section className="bg-white">
        <Container className="py-16">
          <SectionHeading
            eyebrow="Our team"
            title="Coordinating activities and supporting local Rings"
            description="The project team coordinates activities, supports local Rings and works with technical and development partners."
            className="mb-10 max-w-[40em]"
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[3fr_2fr]">
            {/* Featured card — horizontal, large */}
            <div className="flex gap-6 overflow-hidden rounded-2xl border border-line bg-[#F7F9F7] p-7">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-900">
                <span className="font-display text-2xl font-extrabold text-white">{TEAM[0].initials}</span>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-[17px] font-bold text-ink">{TEAM[0].name}</h3>
                  <span className="text-[13px] font-semibold text-brand-700">{TEAM[0].role}</span>
                </div>
                <p className="text-[13.5px] leading-[1.7] text-muted">{TEAM[0].bio}</p>
              </div>
            </div>
            {/* Two compact stacked cards */}
            <div className="flex flex-col gap-4">
              {TEAM.slice(1).map((person) => (
                <div key={person.initials} className="flex gap-4 rounded-2xl border border-line bg-[#F7F9F7] p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-900">
                    <span className="font-display text-sm font-extrabold text-white">{person.initials}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div>
                      <h3 className="text-[14.5px] font-bold text-ink">{person.name}</h3>
                      <span className="text-[12px] font-semibold text-brand-700">{person.role}</span>
                    </div>
                    <p className="text-[13px] leading-[1.6] text-muted">{person.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Our partners ── */}
      <section className="bg-[#F7F9F7]">
        <Container className="py-16">
          <SectionHeading
            eyebrow="Our partners"
            title="Who we work with"
            description="The Machinery Ring Foundation led the implementation of the Kenya–Rwanda project in Rwanda, with support from GIZ Rwanda and sequa gGmbH under German Development Cooperation."
            className="mb-8 max-w-[42em]"
          />
          <div className="flex flex-wrap gap-3">
            {PARTNERS.map((partner) => (
              <div
                key={partner}
                className="rounded-xl border border-line bg-white px-6 py-3.5 text-[14px] font-semibold text-ink"
              >
                {partner}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Joining / Work with us ── */}
      <section className="bg-white">
        <Container className="grid gap-6 py-14 md:grid-cols-2">
          {JOIN_CARDS.map((card) => (
            <div key={card.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-[#F7F9F7] p-8">
              <h3 className="text-lg font-bold text-ink">{card.title}</h3>
              <p className="text-[14.5px] text-muted">{card.body}</p>
              <ArrowLink to="/contact" className="mt-1.5">
                {card.linkLabel}
              </ArrowLink>
            </div>
          ))}
        </Container>
      </section>

      <CtaBand
        title="Ready to get involved?"
        description="Contact us about joining a local Ring, requesting a service, or working with us on farmer training and development."
        actions={[
          { label: "Contact us", to: "/contact" },
          { label: "See our services", to: "/services", variant: "secondary" },
        ]}
      />
    </div>
  );
}
