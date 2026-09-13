import PageHeader from "../components/page-header";
import Container from "../components/container";
import LabeledSection from "../components/labeled-section";
import SectionHeading from "../components/section-heading";
import Stat from "../components/stat";
import PendingPhoto from "../components/pending-photo";
import CtaBand from "../components/cta-band";
import { cn } from "../lib/cn";
import type { Route } from "./+types/ourworkpage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Our Work — Machinery Ring Rwanda" }];
}

const STATS = [
  { value: "817", label: "registered farmers" },
  { value: "5", label: "local Rings" },
  { value: "25", label: "training events, 2024–2026" },
  { value: "900+", label: "participant attendances" },
];

const FIELD_UPDATES = [
  {
    when: "September 2024",
    body: "Field days took place in Mwendo on 4 September and Kagomasi on 5 September as part of the programme of machinery demonstrations and farmer engagement.",
  },
  {
    when: "January 2026",
    body: "Further field-day activities took place in Mwendo and Kagomasi on 8–9 January, continuing practical learning through the local Ring network.",
  },
  {
    when: "Jan–Mar 2026",
    body: "Women's leadership and communication training in January was followed by Microsoft Word and Excel training in March, supporting participation and practical organisational skills.",
  },
];

export default function OurWorkPage() {
  return (
    <div>
      <PageHeader
        crumb="Our Work"
        title="Our Work"
        intro="Our work combines farmer organisation, machinery access and practical learning. Local Rings help bring requests together, while training and field activities support the skills needed to use and manage equipment."
      />

      <LabeledSection label="The Kenya and Rwanda mechanisation project">
        <p className="text-[17px] leading-[1.7] text-ink-soft">
          The project "Sustainable mechanization of value chains through innovative, gender-sensitive business models —
          Machinery Rings in Kenya and Rwanda" runs from November 2023 to October 2026. Work in Rwanda began in 2024,
          focusing on local Rings, agricultural services, training and demonstration activities in Gashora.
        </p>
        <p className="text-sm text-muted-2">
          Implemented by the Machinery Ring Foundation, with support from GIZ Rwanda and sequa gGmbH under German
          Development Cooperation.
        </p>
      </LabeledSection>

      {/* Demonstration farms */}
      <section className="bg-[#F7F9F7]">
        <Container className="grid items-center gap-12 py-16 md:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-4">
            <span className="text-[13px] font-bold uppercase tracking-wide text-brand-700">
              Demonstration farms and practical learning
            </span>
            <p className="text-base leading-[1.7] text-ink-soft">
              Demonstration farms give farmers opportunities to examine equipment and farming practices under local
              conditions. Activities connect seasonal crop management with machinery suitability, soil management and
              post-harvest learning. Field experience also helps identify where equipment or service arrangements need
              improvement.
            </p>
          </div>
          <PendingPhoto
            caption="Participants listen to a practical explanation beside agricultural processing equipment."
            className="aspect-[4/3] rounded-2xl border border-brand-200"
          />
        </Container>
      </section>

      <LabeledSection label="Women's participation">
        <p className="text-[17px] leading-[1.7] text-ink-soft">
          We support women's participation through savings-group activities, financial literacy, leadership and
          digital-skills training. This work includes group management, savings and loan practices, and links with
          local financial institutions. These activities help women take part in the organisational and business work
          of their farmer groups.
        </p>
      </LabeledSection>

      {/* Our recorded reach */}
      <section className="bg-brand-900 text-white">
        <Container className="flex flex-col gap-8 py-16">
          <SectionHeading eyebrow="Our recorded reach" title="Where the Rings stand today" tone="dark" />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <Stat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
          <p className="max-w-[44em] text-[13px] text-[#8FBF9F]">
            Project records presented in August 2026 report 817 registered farmers across five local Rings. Records for
            2024–2026 report 25 training events and more than 900 participant attendances. Attendances include people
            joining more than one session.
          </p>
        </Container>
      </section>

      {/* Field updates */}
      <section className="bg-[#F7F9F7]">
        <Container className="py-16">
          <SectionHeading
            eyebrow="Field updates"
            title="Recent activity across the Rings"
            action={{ to: "/blog", label: "Read more on the Blog" }}
            className="max-w-[34em]"
          />
          <div className="mt-9 flex flex-col">
            {FIELD_UPDATES.map((update, i) => (
              <div
                key={update.when}
                className={cn(
                  "grid grid-cols-1 gap-2 border-t border-line py-5.5 sm:grid-cols-[170px_1fr] sm:gap-6",
                  i === FIELD_UPDATES.length - 1 && "border-b"
                )}
              >
                <span className="font-display text-[15px] font-bold text-brand-600">{update.when}</span>
                <p className="text-[15px] text-ink-soft">{update.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Want to be part of the next update?"
        description="Contact us about joining a local Ring or requesting a service."
        actions={[{ label: "Contact us", to: "/contact" }]}
      />
    </div>
  );
}
