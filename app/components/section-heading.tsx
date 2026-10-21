import Eyebrow from "./eyebrow";
import ArrowLink from "./arrow-link";
import { cn } from "../lib/cn";

/**
 * The eyebrow + title (+ optional description) that introduces a section's
 * content — a grid of cards, a list, a stats row. Pass `action` to lay it
 * out as a header row with a "see more" link on the right.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  action,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  tone?: "light" | "dark";
  action?: { to: string; label: string };
  className?: string;
}) {
  const intro = (
    <div className={cn("flex max-w-[38em] flex-col gap-3", className)}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2 className={cn("font-display text-2xl font-normal tracking-[-0.01em] md:text-[28px]", tone === "dark" ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {description && <p className={cn("text-[15.5px]", tone === "dark" ? "text-[#CDE8D6]" : "text-muted")}>{description}</p>}
    </div>
  );

  if (!action) return intro;

  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      {intro}
      <ArrowLink to={action.to} tone={tone}>
        {action.label}
      </ArrowLink>
    </div>
  );
}
