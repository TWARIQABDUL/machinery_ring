import { useNavigation } from "react-router";
import { cn } from "../lib/cn";

/**
 * A thin bar across the very top of the page that appears the instant any
 * navigation or loader/action starts (page-to-page, admin tab switches, form
 * submits that redirect) and disappears once it settles — so a click always
 * gives some visible response, even before the new page/data is ready.
 */
export default function TopProgressBar() {
  const navigation = useNavigation();
  const isActive = navigation.state !== "idle";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px] overflow-hidden bg-transparent transition-opacity duration-200",
        isActive ? "opacity-100" : "opacity-0"
      )}
    >
      {isActive && <div className="progress-bar-sweep h-full w-1/3 bg-brand-600" />}
    </div>
  );
}
