import { NavLink } from "react-router";
import { cn } from "../../lib/cn";

const TABS = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/requests", label: "Requests" },
  { to: "/dashboard/services", label: "Services" },
  { to: "/dashboard/gallery", label: "Gallery" },
  { to: "/dashboard/blog", label: "Blog" },
  { to: "/dashboard/rings", label: "Rings" },
];

/** The tab bar switching between admin sections, shared by every /dashboard/* page. */
export default function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-1.5 border-b border-line pb-4">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            cn(
              "rounded-lg px-3.5 py-2 text-sm font-semibold transition",
              isActive ? "bg-brand-600 text-white" : "text-ink-soft hover:bg-brand-50"
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
