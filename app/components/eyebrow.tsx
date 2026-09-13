import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/** The small uppercase label used above section headings ("Our team", "Our partners", ...). */
export default function Eyebrow({
  tone = "light",
  className,
  children,
}: {
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "text-[13px] font-bold uppercase tracking-wide",
        tone === "dark" ? "text-[#9FD3AE]" : "text-brand-700",
        className
      )}
    >
      {children}
    </span>
  );
}
