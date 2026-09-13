import type { ReactNode } from "react";
import { btnSm } from "./field";
import { cn } from "../../lib/cn";

/**
 * A submit button that asks for confirmation before submitting — used inside a
 * <Form> that already carries the hidden id/intent fields for the delete action.
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
  return (
    <button
      type="submit"
      name="intent"
      value="delete"
      onClick={(event) => {
        if (!confirm(confirmText)) event.preventDefault();
      }}
      className={cn(btnSm, "border-red-200 text-red-700 hover:bg-red-50", className)}
    >
      {children}
    </button>
  );
}
