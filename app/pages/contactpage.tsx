import pool from "../../db";
import PageHeader from "../components/page-header";
import Container from "../components/container";
import SectionHeading from "../components/section-heading";
import InitialsAvatar from "../components/initials-avatar";
import type { Route } from "./+types/contactpage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Contact — Machinery Ring Rwanda" }];
}

const WHATSAPP_NUMBER = "250781707587"; // +250 781 707 587, in wa.me format (no leading +/0s)

export async function loader() {
  const { rows: services } = await pool.query(
    "SELECT id, name FROM services WHERE status = 'available' AND is_published = true ORDER BY sort_order, name"
  );
  const { rows: rings } = await pool.query("SELECT id, name FROM rings WHERE is_active = true ORDER BY sort_order, name");
  return { services, rings } as { services: { id: number; name: string }[]; rings: { id: number; name: string }[] };
}

type ActionResult =
  | { success: true; whatsappUrl: string }
  | { success: false; error: string; values: Record<string, string> };

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  const formData = await request.formData();
  const get = (name: string) => (formData.get(name)?.toString() ?? "").trim();

  const fullName = get("full_name");
  const phone = get("phone");
  const district = get("district");
  const sector = get("sector");
  const cell = get("cell");
  const village = get("village");
  const membership = get("membership"); // "" = unsure, "non_member", or a ring id
  const serviceId = get("service_id");
  const crop = get("crop");
  const areaOrQuantity = get("area_or_quantity");
  const preferredTiming = get("preferred_timing");
  const additionalInfo = get("additional_info");
  const consent = formData.get("consent");

  const values = Object.fromEntries(formData.entries()) as Record<string, string>;

  if (!fullName || !phone) {
    return { success: false, error: "Please enter your name and telephone number.", values };
  }
  if (!consent) {
    return { success: false, error: "Please agree to be contacted about this request before submitting.", values };
  }

  let membershipStatus: "member" | "non_member" | "unsure" = "unsure";
  let ringId: number | null = null;
  let ringName: string | null = null;
  if (membership === "non_member") {
    membershipStatus = "non_member";
  } else if (membership) {
    const { rows } = await pool.query("SELECT id, name FROM rings WHERE id = $1", [Number(membership)]);
    if (rows[0]) {
      membershipStatus = "member";
      ringId = rows[0].id;
      ringName = rows[0].name;
    }
  }

  let serviceName: string | null = null;
  const serviceIdNum = serviceId ? Number(serviceId) : null;
  if (serviceIdNum) {
    const { rows } = await pool.query("SELECT name FROM services WHERE id = $1", [serviceIdNum]);
    serviceName = rows[0]?.name ?? null;
  }

  const { rows } = await pool.query(
    `INSERT INTO service_requests
      (full_name, phone, district, sector, cell, village, ring_id, membership_status, service_id, crop, area_or_quantity, preferred_timing, additional_info)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING id`,
    [
      fullName,
      phone,
      district || null,
      sector || null,
      cell || null,
      village || null,
      ringId,
      membershipStatus,
      serviceIdNum,
      crop || null,
      areaOrQuantity || null,
      preferredTiming || null,
      additionalInfo || null,
    ]
  );
  const requestId = rows[0].id;

  const location = [village, cell, sector, district].filter(Boolean).join(", ");
  const membershipLine =
    membershipStatus === "member" ? ringName : membershipStatus === "non_member" ? "Non-member" : "Unsure";

  const messageLines = [
    `Service request #${requestId} — Machinery Ring Rwanda website`,
    `Name: ${fullName}`,
    `Phone: ${phone}`,
    location ? `Location: ${location}` : null,
    `Ring / membership: ${membershipLine}`,
    serviceName ? `Service: ${serviceName}` : null,
    crop ? `Crop: ${crop}` : null,
    areaOrQuantity ? `Area or quantity: ${areaOrQuantity}` : null,
    preferredTiming ? `Preferred timing: ${preferredTiming}` : null,
    additionalInfo ? `Notes: ${additionalInfo}` : null,
  ].filter(Boolean);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageLines.join("\n"))}`;

  return { success: true, whatsappUrl };
}

const FAQS = [
  {
    q: "Can non-members enquire?",
    a: "Yes. Contact us to discuss availability and the applicable terms, including any difference in rates.",
  },
  {
    q: "Can I request a specific date?",
    a: "Yes. Give your preferred date or period. The team will confirm what can be arranged.",
  },
  {
    q: "Are transport and inputs included?",
    a: "The team will explain what the quoted price covers. Any additional charges and input responsibilities must be agreed before the work.",
  },
  {
    q: "Can farmers outside Gashora contact us?",
    a: "Yes. Contact us to discuss your location and needs. Support outside the established area depends on what can be arranged.",
  },
];

const inputClass =
  "rounded-lg border border-line bg-white px-3.5 py-3 text-sm text-ink placeholder:text-muted-2 focus:border-brand-600 focus:outline-none";

export default function ContactPage({ loaderData, actionData }: Route.ComponentProps) {
  const { services, rings } = loaderData;
  const result = actionData as ActionResult | undefined;
  const values = result && !result.success ? result.values : {};

  return (
    <div>
      <PageHeader
        crumb="Contact"
        title="Contact Machinery Ring Rwanda"
        intro="For services, membership, training or partnership enquiries, contact our team and tell us how we can help."
      />

      <section className="bg-white">
        <Container className="grid gap-10 py-14 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          {/* Contact card */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 rounded-2xl border border-line bg-brand-50 p-7">
              <InitialsAvatar initials="SM" className="text-base" />
              <div>
                <h3 className="text-lg font-bold text-ink">Simeon Musabende Umunyempuhwe</h3>
                <span className="text-[13px] font-semibold text-brand-700">Project Manager</span>
              </div>
              <div className="flex flex-col gap-2.5 text-[14.5px] text-ink-soft">
                <a href="tel:+250781707587" className="hover:text-brand-700">
                  +250 781 707 587
                </a>
                <a href="mailto:simeon.musabende@machineryrings.org" className="hover:text-brand-700">
                  simeon.musabende@machineryrings.org
                </a>
                <span>Gashora Sector, Bugesera District, Rwanda</span>
              </div>
              <p className="border-t border-[#DDEBE1] pt-3.5 text-[13.5px] text-muted">
                Our established operating area is Gashora Sector, Bugesera District, Rwanda. Contact us to arrange a
                visit. You can also make your request by telephone.
              </p>
            </div>
          </div>

          {/* Request a service */}
          <div id="request" className="scroll-mt-24 rounded-2xl border border-line bg-white p-9">
            {result?.success ? (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 rounded-xl border border-brand-200 bg-brand-50 p-6">
                  <span className="text-xs font-bold uppercase tracking-wide text-brand-700">Request received</span>
                  <p className="text-[15px] text-ink-soft">
                    Your request has been received. Our team will contact you to confirm availability, timing and
                    cost. Your booking is confirmed only after the arrangements have been agreed with you.
                  </p>
                </div>
                <a
                  href={result.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-700"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.5-.8-2.1-1.5-.5-.5-.8-1-1.1-1.5-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3Z" />
                  </svg>
                  Send these details on WhatsApp
                </a>
                <p className="text-center text-[13px] text-muted-2">
                  Optional — opens WhatsApp with the details above pre-filled to Simeon's number. Your request is
                  already saved either way.
                </p>
              </div>
            ) : (
              <RequestForm services={services} rings={rings} values={values} error={result?.error} />
            )}
          </div>
        </Container>
      </section>

      {/* Common questions */}
      <section className="bg-[#F7F9F7]">
        <Container className="py-16">
          <SectionHeading eyebrow="Common questions" title="Before you get in touch" className="mb-9" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {FAQS.map((faq) => (
              <div key={faq.q} className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-6">
                <h3 className="text-base font-bold text-ink">{faq.q}</h3>
                <p className="text-[14.5px] text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

function RequestForm({
  services,
  rings,
  values,
  error,
}: {
  services: { id: number; name: string }[];
  rings: { id: number; name: string }[];
  values: Record<string, string>;
  error?: string;
}) {
  return (
    <form method="post" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-extrabold text-ink">Request a service</h2>
        <p className="text-[14.5px] text-muted">
          Tell us the service you need and where your farm is located. Our team will contact you to discuss
          availability, timing and cost. Submitting a request does not confirm a booking.
        </p>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
          Full name
          <input name="full_name" required defaultValue={values.full_name} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
          Telephone number
          <input name="phone" required placeholder="e.g. 078X XXX XXX" defaultValue={values.phone} className={inputClass} />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-ink">Farm location</span>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <input name="district" placeholder="District" defaultValue={values.district} className={inputClass} />
          <input name="sector" placeholder="Sector" defaultValue={values.sector} className={inputClass} />
          <input name="cell" placeholder="Cell" defaultValue={values.cell} className={inputClass} />
          <input name="village" placeholder="Village" defaultValue={values.village} className={inputClass} />
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
        Local Ring or membership status
        <select name="membership" defaultValue={values.membership ?? ""} className={inputClass}>
          <option value="">Unsure</option>
          <option value="non_member">Non-member</option>
          {rings.map((ring) => (
            <option key={ring.id} value={ring.id}>
              {ring.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
          Service needed
          <select name="service_id" defaultValue={values.service_id ?? ""} className={inputClass}>
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
          Crop
          <input name="crop" placeholder="e.g. maize, rice, beans" defaultValue={values.crop} className={inputClass} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
          Area or quantity
          <input
            name="area_or_quantity"
            placeholder="e.g. 2 ha, or 500 kg"
            defaultValue={values.area_or_quantity}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
          Preferred date or period
          <input
            name="preferred_timing"
            placeholder="e.g. 12–16 October 2026"
            defaultValue={values.preferred_timing}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
        Additional information <span className="font-normal text-muted-2">(optional)</span>
        <textarea
          name="additional_info"
          rows={3}
          placeholder="Access or crop-readiness details that may affect the work"
          defaultValue={values.additional_info}
          className={inputClass}
        />
      </label>

      <label className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-[#B9CBBE] accent-brand-600" />
        I agree that Machinery Ring Rwanda may use these details to contact me and handle this request.{" "}
        <em className="not-italic text-muted-2">
          [Add a short privacy explanation describing who receives this information and how it is used.]
        </em>
      </label>

      <button type="submit" className="mt-1 rounded-lg bg-brand-600 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-700">
        Send request
      </button>
    </form>
  );
}
