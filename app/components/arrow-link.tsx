import type { ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "../lib/cn";

/** A text link with a trailing chevron, used for "see more" style navigation. */
export default function ArrowLink({
  to,
  tone = "light",
  className,
  children,
}: {
  to: string;
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 text-sm font-semibold",
        tone === "dark" ? "border-b border-white/40 pb-0.5 text-white" : "text-brand-700 hover:text-brand-900",
        className
      )}
    >
      {children}
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
