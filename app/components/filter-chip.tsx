import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/** A selectable filter pill, e.g. the Gallery category row. Visual only for now — no filtering wired yet. */
export default function FilterChip({ active, children }: { active?: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-full border px-4 py-2 text-[13px] font-medium",
        active ? "border-brand-600 bg-brand-600 text-white" : "border-[#D6E3D9] bg-white text-ink-soft"
      )}
    >
      {children}
    </span>
  );
}
