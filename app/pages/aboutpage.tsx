import PageHeader from "../components/page-header";
import Container from "../components/container";
import LabeledSection from "../components/labeled-section";
import SectionHeading from "../components/section-heading";
import IconBadge from "../components/icon-badge";
import InitialsAvatar from "../components/initials-avatar";
import ArrowLink from "../components/arrow-link";
import type { Route } from "./+types/aboutpage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "About Us — Machinery Ring Rwanda" }];
}

// Static for now — will read from the `rings` table once the Rings admin exists.
const RINGS = ["Kagomasi", "Biryogo", "Nyabagendwa", "Kabuye", "Mwendo"];

const TEAM = [
  {
    initials: "SM",
    name: "Simeon Musabende Umunyempuhwe",
    role: "Project Manager",
    bio: "Coordinates implementation, farmer support, service planning and partner engagement. Works with local Rings and institutions to turn farmers' needs into practical activities.",
  },
  {
    initials: "EN",
    name: "Eric Niyonzima",
    role: "Assistant Project Manager & ICT Personnel",
    bio: "Supports field coordination, local boards, service planning and recordkeeping, including using digital tools to organise information and support communication.",
  },
  {
    initials: "CM",
    name: "Chloella Munezero",
    role: "Technical Expert — Financial Reporting, M&E",
    bio: "Supports financial administration, activity monitoring and reporting, plus support for women's savings groups, financial literacy and organisational skills.",
  },
];

const PARTNERS = ["Machinery Ring Foundation", "GIZ Rwanda", "sequa gGmbH", "German Development Cooperation"];

const JOIN_CARDS = [
  {
    title: "Joining a Machinery Ring",
    body: "Contact our team or a local Ring representative to learn about membership, the applicable conditions and available services. Farmers can also coordinate requests with neighbours so that work and machinery movements can be planned together. Non-members may enquire about services and the terms that apply to them.",
    linkLabel: "Contact us",
  },
  {
    title: "Work with us",
    body: "We welcome discussions about suitable agricultural machinery, farmer training, women's participation and local service development. Contact us with the location, farming need and proposed area of collaboration.",
    linkLabel: "Start a conversation",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        crumb="About Us"
        title="About Machinery Ring Rwanda"
        intro="We work with local farmer groups to coordinate service needs, develop practical skills and strengthen the organisation required to manage agricultural activities."
      />

      <LabeledSection label="Who we are">
        <p className="text-[17px] leading-[1.7] text-ink-soft">
          Machinery Ring Rwanda supports farmers in accessing agricultural machinery and related services through
          cooperation. We work with local farmer groups to coordinate service needs, develop practical skills and
          strengthen the organisation required to manage agricultural activities.
        </p>
      </LabeledSection>

      {/* What is a Machinery Ring */}
      <section className="bg-brand-50/60">
        <Container className="py-16">
          <div className="flex flex-col gap-3 rounded-2xl border border-line border-l-4 border-l-brand-600 bg-white p-9">
            <span className="text-[13px] font-bold uppercase tracking-wide text-brand-700">What is a Machinery Ring</span>
            <p className="text-[17px] leading-[1.75] text-[#28352E]">
              A Machinery Ring (MR) is a local, farmer-led self-help organisation that helps members access agricultural
              machinery and related services through cooperation. Farmers who own machinery can offer services to other
              members at agreed rates that cover the cost of providing them. A farmer may provide one service while
              hiring another from a fellow member. This approach improves equipment use and gives farmers access to
              mechanisation without each farmer having to purchase their own machinery.
            </p>
          </div>
        </Container>
      </section>

      <LabeledSection label="Our development in Rwanda">
        <p className="text-[17px] leading-[1.7] text-ink-soft">
          Implementation in Rwanda began in 2024 through a project supporting the Machinery Ring approach in Kenya and
          Rwanda. Activities have included establishing local Rings, introducing equipment, organising farmer training
          and developing demonstration farms. Machinery Ring Rwanda obtained legal recognition in 2025.
        </p>
        <p className="text-[17px] leading-[1.7] text-ink-soft">
          Our purpose is to strengthen farmers' access to suitable machinery, practical knowledge and coordinated
          services. Local participation helps shape which services are needed and how they can be organised.
        </p>
      </LabeledSection>

      {/* Our local Rings */}
      <section className="bg-[#F7F9F7]">
        <Container className="py-16">
          <SectionHeading
            eyebrow="Our local Rings"
            title="Our established network in Gashora Sector, Bugesera District"
            description="Local boards and trained farmer facilitators support communication, group activities and service coordination in each Ring."
            className="mb-9"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {RINGS.map((ring) => (
              <div key={ring} className="flex flex-col items-center gap-2.5 rounded-2xl border border-line bg-white px-4 py-5.5 text-center">
                <IconBadge size="sm">
                  <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
                  <circle cx="12" cy="9.5" r="2.2" />
                </IconBadge>
                <span className="text-[14.5px] font-bold text-ink">{ring}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our team */}
      <section className="bg-[#F7F9F7]">
        <Container className="pb-16">
          <SectionHeading
            eyebrow="Our team"
            title="Coordinating activities and supporting local Rings"
            description="The project team coordinates activities, supports local Rings and works with technical and development partners. Local Ring boards help organise members and communicate farmers' priorities."
            className="mb-10"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TEAM.map((person) => (
              <div key={person.initials} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
                <InitialsAvatar initials={person.initials} variant="photo-frame" />
                <div>
                  <h3 className="text-[17px] font-bold text-ink">{person.name}</h3>
                  <span className="text-[13px] font-semibold text-brand-700">{person.role}</span>
                </div>
                <p className="text-sm text-muted">{person.bio}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[12.5px] text-muted-2">
            Portraits shown are placeholders — each falls back to initials until a photo is supplied.
          </p>
        </Container>
      </section>

      {/* Our partners */}
      <section className="bg-white">
        <Container className="py-16">
          <SectionHeading
            eyebrow="Our partners"
            title="Who we work with"
            description="The Machinery Ring Foundation led the implementation of the Kenya–Rwanda project in Rwanda, with support from GIZ Rwanda and sequa gGmbH under German Development Cooperation. Farmers and local leaders help identify priorities and coordinate participation."
            className="max-w-[40em]"
          />
        </Container>
        <div className="marquee-mask mt-8">
          <div className="marquee-track px-6">
            {[...PARTNERS, ...PARTNERS].map((partner, i) => (
              <div
                key={`${partner}-${i}`}
                aria-hidden={i >= PARTNERS.length}
                className="flex h-20 min-w-[220px] items-center justify-center rounded-xl border border-line bg-[#F7F9F7] px-5 text-center text-[13px] font-semibold text-muted"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
        <Container className="pt-5">
          <p className="text-[13.5px] text-muted-2">
            Cooperation with technical and local institutions supports specific activities, including
            business-development training and links between savings groups and local financial services. Logos shown
            are placeholders pending approved partner artwork.
          </p>
        </Container>
      </section>

      {/* Joining / Work with us */}
      <section className="bg-brand-50">
        <Container className="grid gap-6 py-14 md:grid-cols-2">
          {JOIN_CARDS.map((card) => (
            <div key={card.title} className="flex flex-col gap-3 rounded-2xl border border-[#DDEBE1] bg-white p-8">
              <h3 className="text-lg font-bold text-ink">{card.title}</h3>
              <p className="text-[14.5px] text-muted">{card.body}</p>
              <ArrowLink to="/contact" className="mt-1.5">
                {card.linkLabel}
              </ArrowLink>
            </div>
          ))}
        </Container>
      </section>
    </div>
  );
}
