import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export default function FilterChip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
        active
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-[#D6E3D9] bg-white text-ink-soft hover:border-brand-600 hover:text-brand-700"
      )}
    >
      {children}
    </button>
  );
}
