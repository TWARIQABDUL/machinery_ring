import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "./spinner";
import { cn } from "../lib/cn";

/**
 * A submit button that shows it's working the instant its enclosing <form>
 * (or react-router <Form>) starts submitting — spinner, dimmed, disabled —
 * until the response comes back. Covers slow actions (an image upload, a
 * server round-trip) without any manual pending-state wiring at the call
 * site: useFormStatus reads it straight from the nearest ancestor form.
 */
export default function SubmitButton({
  children,
  pendingText,
  className,
  ...props
}: {
  children: ReactNode;
  pendingText?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(className, pending && "cursor-wait opacity-70")}
      {...props}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Spinner size={14} />
          {pendingText ?? children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
