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
        "inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide",
        tone === "dark" ? "text-[#9FD3AE]" : "text-muted",
        className
      )}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
      {children}
    </span>
  );
}
