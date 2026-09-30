import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { btnSm } from "./field";
import Spinner from "../spinner";
import { cn } from "../../lib/cn";

/**
 * A submit button that asks for confirmation before submitting — used inside a
 * <Form> that already carries the hidden id/intent fields for the delete action.
 * Shows a spinner and disables itself the instant the delete is in flight.
 */
export default function DeleteButton({
  confirmText = "Delete this? This cannot be undone.",
  children = "Delete",
  className,
}: {
  confirmText?: string;
  children?: ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="intent"
      value="delete"
      disabled={pending}
      aria-busy={pending}
      onClick={(event) => {
        if (!confirm(confirmText)) event.preventDefault();
      }}
      className={cn(btnSm, "border-red-200 text-red-700 hover:bg-red-50", pending && "cursor-wait opacity-70", className)}
    >
      {pending ? (
        <span className="inline-flex items-center gap-1.5">
          <Spinner size={12} />
          Deleting…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
