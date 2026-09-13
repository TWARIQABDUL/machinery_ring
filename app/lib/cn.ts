/** Joins truthy class names together. A tiny local stand-in for clsx. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
