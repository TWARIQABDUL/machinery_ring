import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { cn } from "../../lib/cn";

const STORAGE_KEY = "mr-admin-sidebar-collapsed";

const TABS = [
  {
    to: "/dashboard",
    label: "Overview",
    end: true,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    to: "/dashboard/requests",
    label: "Requests",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  {
    to: "/dashboard/marketplace-inquiries",
    label: "Inquiries",
    icon: <path d="M4 4h16v11H9l-4 4.5V4Z" />,
  },
  {
    to: "/dashboard/services",
    label: "Services",
    icon: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z" />,
  },
  {
    to: "/dashboard/marketplace",
    label: "Marketplace",
    icon: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    ),
  },
  {
    to: "/dashboard/gallery",
    label: "Gallery",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="M21 15l-5-5L5 20" />
      </>
    ),
  },
  {
    to: "/dashboard/blog",
    label: "Blog",
    icon: <path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1V5ZM12 6v13" />,
  },
  {
    to: "/dashboard/rings",
    label: "Rings",
    icon: (
      <path d="M9 8a3.2 3.2 0 1 0 0 6.4A3.2 3.2 0 0 0 9 8ZM3 20c0-3.6 2.7-6 6-6s6 2.4 6 6M17.5 9a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8ZM15.3 20c.3-2.7 2-4.7 4.7-5.1" />
    ),
  },
];

/** The switcher between admin sections: a collapsible sticky sidebar from md up, a scrollable pill row below it. */
export default function AdminNav() {
  const [collapsed, setCollapsed] = useState(false);

  // Read the remembered state after mount only, so server-rendered markup
  // (always expanded) matches the client's first render and hydration is safe.
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // localStorage unavailable — just stay expanded
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore — nothing to persist to
      }
      return next;
    });
  }

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className={cn(
          "hidden shrink-0 flex-col gap-1 rounded-2xl border border-line bg-white p-2 transition-[width] duration-200 md:sticky md:top-8 md:flex",
          collapsed ? "md:w-[56px]" : "md:w-48"
        )}
      >
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
          className={cn(
            "mb-1 flex h-8 w-8 items-center justify-center rounded-lg text-muted-2 hover:bg-brand-50 hover:text-brand-700",
            collapsed ? "mx-auto" : "self-end"
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("transition-transform", collapsed && "rotate-180")}
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end} className="group" title={collapsed ? tab.label : undefined}>
            {({ isActive }) => (
              <span
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold transition",
                  collapsed && "justify-center px-0",
                  isActive ? "bg-brand-600 text-white" : "text-ink-soft group-hover:bg-brand-50"
                )}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isActive ? "#ffffff" : "#1B7A3D"}
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  {tab.icon}
                </svg>
                {!collapsed && tab.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mobile pill row */}
      <nav className="flex flex-wrap gap-1.5 border-b border-line pb-4 md:hidden">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
                isActive ? "bg-brand-600 text-white" : "text-ink-soft hover:bg-brand-50"
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
