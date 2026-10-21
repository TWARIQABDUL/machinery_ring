import type { ReactNode } from "react";

/** The small rounded icon box used at the top of feature/service cards. */
export default function IconBadge({ children, size = "md" }: { children: ReactNode; size?: "sm" | "md" }) {
  if (size === "sm") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-2">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0F2A1A" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          {children}
        </svg>
      </span>
    );
  }
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F2A1A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </div>
  );
}
