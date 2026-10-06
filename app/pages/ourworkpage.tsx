import { Link } from "react-router";
import Container from "../components/container";
import SectionHeading from "../components/section-heading";
import CtaBand from "../components/cta-band";
import type { Route } from "./+types/ourworkpage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Our Work | Machinery Ring Rwanda" }];
}

const STATS = [
  { value: "817", label: "Registered farmers across five Rings" },
  { value: "5", label: "Local Rings in Gashora Sector" },
  { value: "25", label: "Training events, 2024–2026" },
  { value: "900+", label: "Participant attendances recorded" },
];

const DEMO_IMAGES = [
  {
    src: "https://images.pexels.com/photos/34594551/pexels-photo-34594551.jpeg?auto=compress&cs=tinysrgb&w=1280",
    alt: "Lush green fields at a demonstration farm site",
    offset: "",
  },
  {
    src: "https://images.pexels.com/photos/12835164/pexels-photo-12835164.jpeg?auto=compress&cs=tinysrgb&w=1280",
    alt: "Crops growing on productive agricultural land",
    offset: "mt-8",
  },
  {
    src: "https://images.pexels.com/photos/14314165/pexels-photo-14314165.jpeg?auto=compress&cs=tinysrgb&w=1280",
    alt: "Farmers working together in the field",
    offset: "mt-4",
  },
];

const WOMEN_BULLETS = [
  "Savings-group activities and financial literacy training",
  "Leadership, communication and digital-skills development",
  "Links with local financial institutions and group management",
];

const FIELD_UPDATES = [
  {
    when: "September 2024",
    tag: "Field days",
    body: "Field days took place in Mwendo on 4 September and Kagomasi on 5 September as part of the programme of machinery demonstrations and farmer engagement.",
  },
  {
    when: "January 2026",
    tag: "Field days",
    body: "Further field-day activities took place in Mwendo and Kagomasi on 8–9 January, continuing practical learning through the local Ring network.",
  },
  {
    when: "Jan–Mar 2026",
    tag: "Training",
    body: "Women's leadership and communication training in January was followed by Microsoft Word and Excel training in March, supporting participation and practical organisational skills.",
  },
];

export default function OurWorkPage() {
  return (
    <div>
      {/* ── Split-panel hero ── */}
      <section className="grid min-h-[560px] md:grid-cols-2">
        {/* Left: solid dark panel */}
        <div className="flex flex-col justify-center gap-6 bg-navy px-8 py-16 md:px-14 md:py-24">
          <span className="text-[13px] text-[#8FBF9F]">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            &nbsp;/&nbsp;Our Work
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-[46px]">
            How we work with farmers across five local Rings
          </h1>
          <p className="text-[16.5px] leading-[1.7] text-[#CDE8D6]">
            Our work combines farmer organisation, machinery access and practical learning. Local Rings bring
            requests together, while training and field activities build the skills needed to use and manage
            equipment.
          </p>
          <div className="flex flex-wrap gap-3.5 pt-1">
            <Link
              to="/contact"
              className="rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-brand-500"
            >
              Contact us
            </Link>
            <Link
              to="/gallery"
              className="rounded-lg border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
            >
              Browse the gallery
            </Link>
          </div>
        </div>
        {/* Right: full-height image */}
        <div className="relative min-h-[320px] md:min-h-0">
          <img
            src="/images/gallery/SAGA0299.jpg"
            alt="Machinery Ring Rwanda event — farmers and partners gathered for a machinery demonstration day"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      {/* ── Large stats — huge numbers ── */}
      <section className="bg-navy">
        <Container className="py-14 md:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-3">
                <span className="font-display text-[52px] font-extrabold leading-none text-brand-600 md:text-[64px]">
                  {stat.value}
                </span>
                <div className="h-[3px] w-10 rounded-full bg-brand-600" />
                <span className="text-[13.5px] text-[#A9CFB6]">{stat.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[12.5px] text-white/40">
            Project records presented in August 2026. Attendances include people joining more than one session.
          </p>
        </Container>
      </section>

      {/* ── The Kenya & Rwanda project — centred ── */}
      <section className="bg-white">
        <Container className="py-16 md:py-20">
          <div className="mx-auto flex max-w-[48em] flex-col items-center gap-6 text-center">
            <span className="rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-widest text-brand-700">
              November 2023 – October 2026
            </span>
            <h2 className="font-display text-[30px] font-extrabold leading-tight text-ink md:text-[36px]">
              Sustainable mechanization through gender-sensitive Machinery Ring business models
            </h2>
            <p className="text-[16px] leading-[1.75] text-ink-soft">
              The project "Sustainable mechanization of value chains through innovative, gender-sensitive business
              models: Machinery Rings in Kenya and Rwanda" brings the Machinery Ring approach to East Africa. In
              Rwanda, activities focus on Gashora Sector — establishing local Rings, introducing equipment,
              organising farmer training and running demonstration farms.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              {["GIZ Rwanda"].map((p) => (
                <span
                  key={p}
                  className="rounded-xl border border-line bg-[#F7F9F7] px-5 py-2.5 text-[13px] font-semibold text-ink"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Demonstration farms — 3-image photo strip ── */}
      <section className="bg-[#F7F9F7]">
        <Container className="py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-3 max-w-[38em]">
            <span className="text-[13px] font-bold uppercase tracking-wide text-brand-700">
              Demonstration farms and practical learning
            </span>
            <h2 className="font-display text-[30px] font-extrabold leading-tight text-ink">
              Learning in the field, with real equipment
            </h2>
            <p className="text-[15.5px] leading-[1.75] text-ink-soft">
              Demonstration farms give farmers opportunities to examine equipment and farming practices under local
              conditions. Activities connect seasonal crop management with machinery suitability, soil management and
              post-harvest learning.
            </p>
          </div>
          {/* Photo strip — 3 images with vertical offsets */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {DEMO_IMAGES.map((img) => (
              <div key={img.src} className={`overflow-hidden rounded-2xl ${img.offset}`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="aspect-[3/4] w-full object-cover md:aspect-[4/5]"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
          <p className="mt-5 text-[13px] text-muted-2">
            Field experience also helps identify where equipment or service arrangements need improvement.
          </p>
        </Container>
      </section>

      {/* ── Women's participation — full-bleed image with text overlay ── */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/39662345/pexels-photo-39662345.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/97 via-brand-900/85 to-brand-900/50" />
        <Container className="relative z-10 py-20 md:py-24">
          <div className="flex max-w-[36em] flex-col gap-5">
            <span className="text-[13px] font-bold uppercase tracking-wide text-[#8FBF9F]">
              Women's participation
            </span>
            <h2 className="font-display text-[32px] font-extrabold leading-tight text-white md:text-[38px]">
              Supporting women's roles in farmer groups and beyond
            </h2>
            <p className="text-[16px] leading-[1.75] text-[#CDE8D6]">
              We support women's participation through savings-group activities, financial literacy, leadership and
              digital-skills training. These activities help women take part in the organisational and business work
              of their farmer groups and build lasting connections with local financial institutions.
            </p>
            <ul className="flex flex-col gap-3 pt-1">
              {WOMEN_BULLETS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-700">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#A9CFB6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="text-[15px] text-[#CDE8D6]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── Field updates — vertical timeline ── */}
      <section className="bg-[#F7F9F7]">
        <Container className="py-16 md:py-20">
          <SectionHeading
            eyebrow="Field updates"
            title="Recent activity across the Rings"
            action={{ to: "/blog", label: "Read more on the Blog" }}
            className="mb-12 max-w-[34em]"
          />
          <div className="flex flex-col">
            {FIELD_UPDATES.map((update, i) => (
              <div key={update.when} className="flex gap-6 md:gap-10">
                {/* Timeline spine: dot + vertical line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600 ring-4 ring-brand-100">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  {i < FIELD_UPDATES.length - 1 && (
                    <div className="my-1 w-px flex-1 bg-brand-200" />
                  )}
                </div>
                {/* Content */}
                <div className={`flex flex-col gap-2 pb-10 ${i === FIELD_UPDATES.length - 1 ? "pb-0" : ""}`}>
                  <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-brand-700">
                      {update.tag}
                    </span>
                    <span className="font-display text-[13.5px] font-bold text-brand-600">{update.when}</span>
                  </div>
                  <p className="text-[15px] leading-[1.7] text-ink-soft">{update.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Want to be part of the next update?"
        description="Contact us about joining a local Ring, requesting a service, or attending a field day."
        actions={[
          { label: "Contact us", to: "/contact" },
          { label: "Read the blog", to: "/blog", variant: "secondary" },
        ]}
      />
    </div>
  );
}
