import type { ReactNode } from "react";
import Container from "./container";
import Eyebrow from "./eyebrow";
import { cn } from "../lib/cn";

/**
 * The narrow-label / wide-copy two-column layout used for straightforward
 * "tell the reader one thing" sections (Who we are, Our development, ...).
 */
export default function LabeledSection({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className="bg-white">
      <Container className={cn("grid gap-14 py-16 md:grid-cols-[0.9fr_1.1fr]", className)}>
        <Eyebrow>{label}</Eyebrow>
        <div className="flex flex-col gap-4">{children}</div>
      </Container>
    </section>
  );
}
