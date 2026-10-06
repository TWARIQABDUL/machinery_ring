import { Link } from "react-router";
import Container from "../components/container";
import CtaBand from "../components/cta-band";
import { useT, type StringKey } from "../lib/i18n";
import type { Route } from "./+types/ourworkpage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Our Work | Machinery Ring Rwanda" }];
}

const STATS: { value: string; labelKey: StringKey }[] = [
  { value: "817", labelKey: "ourwork.stat1" },
  { value: "5", labelKey: "ourwork.stat2" },
  { value: "25", labelKey: "ourwork.stat3" },
  { value: "900+", labelKey: "ourwork.stat4" },
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

const WOMEN_BULLETS: StringKey[] = ["ourwork.women1", "ourwork.women2", "ourwork.women3"];

export default function OurWorkPage() {
  const t = useT();

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
            &nbsp;/&nbsp;{t("nav.ourWork")}
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-[46px]">
            {t("ourwork.hero.title")}
          </h1>
          <p className="text-[16.5px] leading-[1.7] text-[#CDE8D6]">{t("ourwork.hero.body")}</p>
          <div className="flex flex-wrap gap-3.5 pt-1">
            <Link
              to="/contact"
              className="rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-brand-500"
            >
              {t("shared.contactUs")}
            </Link>
            <Link
              to="/gallery"
              className="rounded-lg border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
            >
              {t("ourwork.browseGallery")}
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
              <div key={stat.labelKey} className="flex flex-col gap-3">
                <span className="font-display text-[52px] font-extrabold leading-none text-brand-600 md:text-[64px]">
                  {stat.value}
                </span>
                <div className="h-[3px] w-10 rounded-full bg-brand-600" />
                <span className="text-[13.5px] text-[#A9CFB6]">{t(stat.labelKey)}</span>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[12.5px] text-white/40">{t("ourwork.statsNote")}</p>
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
              {t("ourwork.project.title")}
            </h2>
            <p className="text-[16px] leading-[1.75] text-ink-soft">{t("ourwork.project.body")}</p>
          </div>
        </Container>
      </section>

      {/* ── Demonstration farms — 3-image photo strip ── */}
      <section className="bg-[#F7F9F7]">
        <Container className="py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-3 max-w-[38em]">
            <span className="text-[13px] font-bold uppercase tracking-wide text-brand-700">{t("ourwork.demo.eyebrow")}</span>
            <h2 className="font-display text-[30px] font-extrabold leading-tight text-ink">{t("ourwork.demo.title")}</h2>
            <p className="text-[15.5px] leading-[1.75] text-ink-soft">{t("ourwork.demo.body")}</p>
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
          <p className="mt-5 text-[13px] text-muted-2">{t("ourwork.demo.footnote")}</p>
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
            <span className="text-[13px] font-bold uppercase tracking-wide text-[#8FBF9F]">{t("ourwork.women.eyebrow")}</span>
            <h2 className="font-display text-[32px] font-extrabold leading-tight text-white md:text-[38px]">
              {t("ourwork.women.title")}
            </h2>
            <p className="text-[16px] leading-[1.75] text-[#CDE8D6]">{t("ourwork.women.body")}</p>
            <ul className="flex flex-col gap-3 pt-1">
              {WOMEN_BULLETS.map((key) => (
                <li key={key} className="flex items-start gap-3">
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
                  <span className="text-[15px] text-[#CDE8D6]">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CtaBand
        title={t("ourwork.cta.title")}
        description={t("ourwork.cta.description")}
        actions={[
          { label: t("shared.contactUs"), to: "/contact" },
          { label: t("ourwork.readBlog"), to: "/blog", variant: "secondary" },
        ]}
      />
    </div>
  );
}
