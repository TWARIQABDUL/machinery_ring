import { Link } from "react-router";
import PageHeader from "../components/page-header";
import Container from "../components/container";
import IconBadge from "../components/icon-badge";
import StatusBadge from "../components/status-badge";
import { cn } from "../lib/cn";
import type { Route } from "./+types/servicespage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Services — Machinery Ring Rwanda" }];
}

// Static for now — will read from the `services` table once the Services admin exists.
const AVAILABLE_SERVICES = [
  {
    name: "Maize and bean planting",
    body: "Planting support uses available planting equipment, including hand-held planters. The team discusses field readiness, crop requirements and the appropriate equipment for the task. Seed, fertiliser and other input arrangements are agreed separately.",
    tellUs: "your crop, field location, area in hectares and preferred planting period.",
    icon: <path d="M12 21v-9M12 13c1-4 4-6 7-6-1 4-4 6-7 6ZM12 15c-1-3-3.5-5-6.5-5 1 3 3.5 5 6.5 5Z" />,
  },
  {
    name: "Maize shelling and rice threshing",
    body: "These services separate maize grain from the cob or rice grain from the harvested crop. Requests are assessed against crop readiness, machine suitability and operator availability. We agree the working area, handling arrangements and any transport charges before scheduling.",
    tellUs: "crop, estimated quantity in kilograms or tonnes, location and preferred date.",
    icon: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />,
  },
  {
    name: "Training and agricultural advisory support",
    body: "Our practical learning activities cover machinery use, crop establishment, soil health, spraying practices, post-harvest handling and farm-business skills. Farmers and groups can enquire about training or advisory support for a specific need.",
    tellUs: "the topic or skill you need support with, and your group size.",
    icon: <path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1V5ZM12 6v13" />,
  },
  {
    name: "Machinery operation and maintenance learning",
    body: "We support operators and farmer groups with practical learning on equipment operation, routine checks, cleaning and maintenance.",
    tellUs: "the machine type and the support needed.",
    icon: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z" />,
  },
];

const DEVELOPING_SERVICES = [
  {
    name: "Land preparation",
    body: "Depends on securing a suitable tractor, compatible implements and an operator. Farmers may register their interest, but dates can only be agreed once delivery capacity is confirmed.",
  },
  {
    name: "Irrigation",
    body: "Currently centres on demonstrations and practical learning rather than delivered irrigation work.",
  },
  {
    name: "Rice transplanting",
    body: "An area of service development. Contact us to discuss the support available for your location and task.",
  },
  {
    name: "Cassava and maize processing",
    body: "An area of service development. Contact us to discuss the support available for your location and task.",
  },
];

export default function ServicesPage() {
  return (
    <div>
      <PageHeader
        crumb="Services"
        title="Our Services"
        intro="We coordinate agricultural services and practical support through our local network. Tell us what you need so we can check the equipment, operator, location and timing before confirming the work and price."
      />

      {/* Services slider */}
      <section className="bg-white">
        <Container className="pt-12">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-[0_24px_50px_-30px_rgba(15,61,36,0.3)]">
            {AVAILABLE_SERVICES.map((service) => (
              <div key={service.name} className="svc-slide bg-brand-100">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#B9D6C2" strokeWidth="1.3">
                  {service.icon}
                </svg>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1.5 bg-gradient-to-t from-[rgba(9,38,22,0.85)] to-transparent px-6.5 pb-4.5 pt-8 text-white">
                  <StatusBadge tone="overlay" size="sm">Photo pending</StatusBadge>
                  <h3 className="text-lg font-bold text-white">{service.name}</h3>
                  <p className="text-[13.5px] text-[#E7F2EA]">{service.tellUs}</p>
                </div>
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-3.5 flex justify-center gap-1.5">
              {AVAILABLE_SERVICES.map((service) => (
                <span key={service.name} className="svc-dot" />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Available now */}
      <section className="bg-white">
        <Container className="py-14">
          <div className="mb-9 flex items-center gap-2.5">
            <StatusBadge tone="solid">Available now</StatusBadge>
            <span className="text-sm text-muted">Requests assessed and confirmed individually</span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {AVAILABLE_SERVICES.map((service) => (
              <div key={service.name} className="flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-7">
                <IconBadge>{service.icon}</IconBadge>
                <h3 className="text-lg font-bold text-ink">{service.name}</h3>
                <p className="text-[15px] text-muted">{service.body}</p>
                <div className="rounded-[10px] border border-line bg-[#F7F9F7] px-4 py-3.5 text-[13.5px] text-muted">
                  <strong className="text-ink">Tell us:</strong> {service.tellUs}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services being developed */}
      <section className="bg-[#F7F9F7]">
        <Container className="py-14">
          <div className="mb-7 flex items-center gap-2.5">
            <StatusBadge tone="amber">In development</StatusBadge>
            <span className="text-sm text-muted">Register interest — dates depend on confirmed capacity</span>
          </div>
          <div className="flex flex-col">
            {DEVELOPING_SERVICES.map((service, i) => (
              <div
                key={service.name}
                className={cn(
                  "grid grid-cols-1 gap-3 border-t border-line py-5 sm:grid-cols-[220px_1fr] sm:gap-6",
                  i === DEVELOPING_SERVICES.length - 1 && "border-b"
                )}
              >
                <h3 className="text-base font-bold text-ink">{service.name}</h3>
                <p className="text-[14.5px] text-muted">{service.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Prices and confirmation */}
      <section className="bg-white">
        <Container className="py-16">
          <div className="flex flex-col gap-3.5 rounded-2xl border border-line bg-brand-50 p-9">
            <h2 className="font-display text-[22px] font-extrabold text-ink">Prices and confirmation</h2>
            <p className="text-[15.5px] leading-[1.7] text-ink-soft">
              Contact us for the applicable rate. The team will explain the unit charged, any member or non-member rate
              and additional costs before you agree to the work. A service request becomes a booking only after
              availability, timing and price have been confirmed with you.
            </p>
            <Link
              to="/contact#request"
              className="mt-2 w-fit rounded-lg bg-brand-600 px-6 py-3 text-[15px] font-semibold text-white hover:bg-brand-700"
            >
              Request a service
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
