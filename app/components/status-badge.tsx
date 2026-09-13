import type { ReactNode } from "react";
import { cn } from "../lib/cn";

const TONES = {
  solid: "bg-brand-600 text-white",
  amber: "bg-[#FBEEDD] text-[#B5711F]",
  overlay: "border border-white/40 bg-white/15 text-white",
  neutral: "bg-[#F1F4F1] text-muted",
  danger: "bg-red-50 text-red-700",
};

/** A small bold, uppercase pill — "Available now", "In development", "Photo pending". */
export default function StatusBadge({
  tone = "solid",
  size = "md",
  className,
  children,
}: {
  tone?: keyof typeof TONES;
  size?: "sm" | "md";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full font-bold uppercase tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-xs",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
