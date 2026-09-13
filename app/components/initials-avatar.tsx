import { cn } from "../lib/cn";

/**
 * Shows a person's initials — a photo would replace this the moment one is
 * supplied. `badge` is the compact circular form (Contact); `photo-frame` is
 * the larger square slot with a "photo pending" corner badge (team cards).
 */
export default function InitialsAvatar({
  initials,
  variant = "badge",
  className,
}: {
  initials: string;
  variant?: "badge" | "photo-frame";
  className?: string;
}) {
  if (variant === "photo-frame") {
    return (
      <div className={cn("relative flex aspect-square w-full items-center justify-center rounded-[14px] bg-brand-50", className)}>
        <span className="font-display text-[28px] font-extrabold text-brand-600">{initials}</span>
        <span className="absolute bottom-2 right-2 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-line bg-white">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A978F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
            <circle cx="12" cy="13" r="3.2" />
          </svg>
        </span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 font-display text-base font-extrabold text-white",
        className
      )}
    >
      {initials}
    </span>
  );
}
