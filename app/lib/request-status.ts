export const REQUEST_STATUSES = ["new", "contacted", "confirmed", "completed", "cancelled"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

/** Shared status → badge tone mapping for service requests, used on the dashboard overview and Requests pages. */
export const REQUEST_STATUS_TONE: Record<RequestStatus, "solid" | "amber" | "neutral" | "danger"> = {
  new: "amber",
  contacted: "neutral",
  confirmed: "solid",
  completed: "solid",
  cancelled: "danger",
};
