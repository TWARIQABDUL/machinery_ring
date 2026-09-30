import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/** The site's shared content column: centered, capped at 1200px, with side gutters. */
export default function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto max-w-[1200px] px-4", className)}>{children}</div>;
}
