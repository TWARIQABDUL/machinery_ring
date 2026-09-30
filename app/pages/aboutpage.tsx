import { Link } from "react-router";
import pool from "../../db";
import Container from "../components/container";
import SectionHeading from "../components/section-heading";
import IconBadge from "../components/icon-badge";
import WhatsAppIcon from "../components/whatsapp-icon";
import ArrowLink from "../components/arrow-link";
import CtaBand from "../components/cta-band";
import { useT, type StringKey } from "../lib/i18n";
import { cached } from "../lib/cache.server";
import type { Route } from "./+types/aboutpage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "About Us | Machinery Ring Rwanda" }];
}

type RingRow = { id: number; name: string; whatsapp_invite_link: string };
const PENDING_LINK_MARKER = "INVITE-LINK-PENDING";

export async function loader() {
  const rings = await cached("rings:active", 60_000, async () => {
    const { rows } = await pool.query<RingRow>(
      "SELECT id, name, whatsapp_invite_link FROM rings WHERE is_active = true ORDER BY sort_order, name"
    );
    return rows;
  });
  return { rings };
}

const HOW_IT_WORKS: { num: string; titleKey: StringKey; bodyKey: StringKey }[] = [
  { num: "01", titleKey: "about.step1.title", bodyKey: "about.step1.body" },
  { num: "02", titleKey: "about.step2.title", bodyKey: "about.step2.body" },
  { num: "03", titleKey: "about.step3.title", bodyKey: "about.step3.body" },
];

const MISSION_POINTS: StringKey[] = ["about.mission1", "about.mission2", "about.mission3"];
const APPROACH_POINTS: StringKey[] = ["about.approach1", "about.approach2", "about.approach3"];

const TEAM: { initials: string; name: string; role: string; bioKey: StringKey }[] = [
  { initials: "SM", name: "Simeon Musabende Umunyempuhwe", role: "Project Manager", bioKey: "about.team1.bio" },
  { initials: "EN", name: "Eric Niyonzima", role: "Assistant Project Manager & ICT Personnel", bioKey: "about.team2.bio" },
  { initials: "CM", name: "Chloella Munezero", role: "Technical Expert, Financial Reporting and M&E", bioKey: "about.team3.bio" },
];

const JOIN_CARDS: { titleKey: StringKey; bodyKey: StringKey; linkLabelKey: StringKey }[] = [
  { titleKey: "about.join1.title", bodyKey: "about.join1.body", linkLabelKey: "shared.contactUs" },
  { titleKey: "about.join2.title", bodyKey: "about.join2.body", linkLabelKey: "about.startConversation" },
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
  const t = useT();

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
              &nbsp;/&nbsp;{t("nav.about")}
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-[50px]">
              {t("about.hero.title")}
            </h1>
            <p className="text-[16.5px] leading-[1.7] text-[#CDE8D6]">{t("about.hero.body")}</p>
            <div className="flex flex-wrap gap-3.5 pt-1">
              <Link
                to="/contact"
                className="rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-brand-500"
              >
                {t("about.hero.cta1")}
              </Link>
              <Link
                to="/our-work"
                className="rounded-lg border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
              >
                {t("about.hero.cta2")}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Centered pull-quote ── */}
      <section className="bg-white">
        <Container className="py-14 md:py-16">
          <p className="mx-auto max-w-[46em] text-center text-[18px] leading-[1.8] text-ink-soft md:text-[20px]">
            {t("about.quote")}
          </p>
        </Container>
      </section>


      {/* ── How a Machinery Ring works — numbered steps ── */}
      <section className="bg-white">
        <Container className="py-16 md:py-20">
          <SectionHeading
            eyebrow={t("about.howEyebrow")}
            title={t("about.howTitle")}
            description={t("about.howDescription")}
            className="mb-12 max-w-[40em]"
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.num} className="flex flex-col gap-4 rounded-2xl bg-navy p-7">
                <span className="font-display text-[52px] font-extrabold leading-none text-white/20">
                  {step.num}
                </span>
                <h3 className="text-[17px] font-bold text-white">{t(step.titleKey)}</h3>
                <p className="text-[14.5px] leading-[1.7] text-[#A9CFB6]">{t(step.bodyKey)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Mission + Approach — side-by-side dual text columns ── */}
      <section className="bg-navy">
        <Container className="py-16 md:py-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
            {/* Left: Our mission */}
            <div className="flex flex-col gap-5">
              <span className="text-[13px] font-bold uppercase tracking-wide text-[#8FBF9F]">{t("about.missionEyebrow")}</span>
              <h2 className="font-display text-[28px] font-extrabold leading-tight text-white">
                {t("about.missionTitle")}
              </h2>
              <p className="text-[15.5px] leading-[1.75] text-[#CDE8D6]">{t("about.missionBody")}</p>
              <ul className="flex flex-col gap-3 pt-1">
                {MISSION_POINTS.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <Check dark />
                    <span className="text-[14.5px] text-[#CDE8D6]">{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right: Our approach */}
            <div className="flex flex-col gap-5 md:border-l md:border-white/10 md:pl-16">
              <span className="text-[13px] font-bold uppercase tracking-wide text-[#8FBF9F]">{t("about.approachEyebrow")}</span>
              <h2 className="font-display text-[28px] font-extrabold leading-tight text-white">
                {t("about.approachTitle")}
              </h2>
              <p className="text-[15.5px] leading-[1.75] text-[#CDE8D6]">{t("about.approachBody")}</p>
              <ul className="flex flex-col gap-3 pt-1">
                {APPROACH_POINTS.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <Check dark />
                    <span className="text-[14.5px] text-[#CDE8D6]">{t(key)}</span>
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
            <span className="text-[13px] font-bold uppercase tracking-wide text-brand-700">{t("about.devEyebrow")}</span>
            <h2 className="font-display text-[30px] font-extrabold leading-tight text-ink">{t("about.devTitle")}</h2>
            <p className="text-[15.5px] leading-[1.75] text-ink-soft">{t("about.devBody")}</p>
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
              <span className="text-[13px] font-medium text-white">{t("about.devCaption")}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Our local Rings ── */}
      {rings.length > 0 && (
        <section className="bg-[#F7F9F7]">
          <Container className="py-16">
            <SectionHeading
              eyebrow={t("about.ringsEyebrow")}
              title={t("about.ringsTitle")}
              description={t("about.ringsDescription")}
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
                        {t("shared.joinWhatsapp")}
                      </a>
                    ) : (
                      <span className="text-[12px] text-muted-2">{t("shared.joinLinkSoon")}</span>
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
            eyebrow={t("about.teamEyebrow")}
            title={t("about.teamTitle")}
            description={t("about.teamDescription")}
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
                <p className="text-[13.5px] leading-[1.7] text-muted">{t(TEAM[0].bioKey)}</p>
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
                    <p className="text-[13px] leading-[1.6] text-muted">{t(person.bioKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Joining / Work with us ── */}
      <section className="bg-white">
        <Container className="grid gap-6 py-14 md:grid-cols-2">
          {JOIN_CARDS.map((card) => (
            <div key={card.titleKey} className="flex flex-col gap-3 rounded-2xl border border-line bg-[#F7F9F7] p-8">
              <h3 className="text-lg font-bold text-ink">{t(card.titleKey)}</h3>
              <p className="text-[14.5px] text-muted">{t(card.bodyKey)}</p>
              <ArrowLink to="/contact" className="mt-1.5">
                {t(card.linkLabelKey)}
              </ArrowLink>
            </div>
          ))}
        </Container>
      </section>

      <CtaBand
        title={t("about.cta.title")}
        description={t("about.cta.description")}
        actions={[
          { label: t("shared.contactUs"), to: "/contact" },
          { label: t("cta.seeServices"), to: "/services", variant: "secondary" },
        ]}
      />
    </div>
  );
}
