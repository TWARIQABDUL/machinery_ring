import { cn } from "../lib/cn";

const SIZES = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-9 w-9 text-[13px]",
  lg: "h-[38px] w-[38px] text-[13px]",
  xl: "h-[52px] w-[52px] text-[17px]",
};

/** The circular "MR" logo mark — header, footer, auth screens, admin shell. */
export default function BrandMark({ size = "md", className }: { size?: keyof typeof SIZES; className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand-600 font-display font-extrabold tracking-tight text-white",
        SIZES[size],
        className
      )}
    >
      MR
    </span>
  );
}
