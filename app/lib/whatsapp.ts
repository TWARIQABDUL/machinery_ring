// +250 781 707 587, in wa.me format (no leading +/0s).
export const WHATSAPP_NUMBER = "250781707587";

export type ServiceRequestMessageInput = {
  id: number;
  fullName: string;
  phone: string;
  location?: string | null;
  membershipLine: string;
  serviceName?: string | null;
  crop?: string | null;
  areaOrQuantity?: string | null;
  preferredTiming?: string | null;
  additionalInfo?: string | null;
};

/** Builds the same pre-filled wa.me message wherever a service request needs to be sent on WhatsApp. */
export function buildServiceRequestWhatsAppUrl(input: ServiceRequestMessageInput): string {
  const lines = [
    `Service request #${input.id} — Machinery Ring Rwanda website`,
    `Name: ${input.fullName}`,
    `Phone: ${input.phone}`,
    input.location ? `Location: ${input.location}` : null,
    `Ring / membership: ${input.membershipLine}`,
    input.serviceName ? `Service: ${input.serviceName}` : null,
    input.crop ? `Crop: ${input.crop}` : null,
    input.areaOrQuantity ? `Area or quantity: ${input.areaOrQuantity}` : null,
    input.preferredTiming ? `Preferred timing: ${input.preferredTiming}` : null,
    input.additionalInfo ? `Notes: ${input.additionalInfo}` : null,
  ].filter(Boolean);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export type MarketplaceInquiryMessageInput = {
  id: number;
  fullName: string;
  phone: string;
  location?: string | null;
  itemName: string;
  quantity?: string | null;
  additionalInfo?: string | null;
};

/** Builds the same pre-filled wa.me message wherever a marketplace inquiry needs to be sent on WhatsApp. */
export function buildMarketplaceInquiryWhatsAppUrl(input: MarketplaceInquiryMessageInput): string {
  const lines = [
    `Marketplace inquiry #${input.id} — Machinery Ring Rwanda website`,
    `Item: ${input.itemName}`,
    `Name: ${input.fullName}`,
    `Phone: ${input.phone}`,
    input.location ? `Location: ${input.location}` : null,
    input.quantity ? `Quantity: ${input.quantity}` : null,
    input.additionalInfo ? `Notes: ${input.additionalInfo}` : null,
  ].filter(Boolean);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
