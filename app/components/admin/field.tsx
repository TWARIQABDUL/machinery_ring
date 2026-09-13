import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

const baseControl =
  "rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-2 focus:border-brand-600 focus:outline-none disabled:bg-[#F7F9F7] disabled:text-muted-2";

export const btnPrimary = "rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700";
export const btnGhost = "rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-brand-50";
export const btnSm = "rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-brand-50";

type FieldExtras = { label: ReactNode; hint?: string; className?: string };

/** A labelled text/number/date input, styled consistently across every admin form. */
export function TextField({ label, hint, className, ...props }: FieldExtras & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
      {label}
      <input {...props} className={cn(baseControl, className)} />
      {hint && <span className="text-[12px] font-normal text-muted-2">{hint}</span>}
    </label>
  );
}

/** A labelled multi-line text input. */
export function TextAreaField({
  label,
  hint,
  className,
  ...props
}: FieldExtras & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
      {label}
      <textarea {...props} className={cn(baseControl, className)} />
      {hint && <span className="text-[12px] font-normal text-muted-2">{hint}</span>}
    </label>
  );
}

/** A labelled dropdown — pass <option> children as usual. */
export function SelectField({
  label,
  hint,
  className,
  children,
  ...props
}: FieldExtras & { children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
      {label}
      <select {...props} className={cn(baseControl, className)}>
        {children}
      </select>
      {hint && <span className="text-[12px] font-normal text-muted-2">{hint}</span>}
    </label>
  );
}

/** A checkbox with its label to the right, sized for one-handed clicking. */
export function CheckboxField({
  label,
  className,
  ...props
}: { label: ReactNode; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("flex items-center gap-2.5 text-[13px] font-medium text-ink-soft", className)}>
      <input type="checkbox" {...props} className="h-[18px] w-[18px] shrink-0 rounded border-[#B9CBBE] accent-brand-600" />
      {label}
    </label>
  );
}
