import { useState } from "react";
import { NavLink } from "react-router";
import Container from "./container";
import BrandMark from "./brand-mark";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/our-work", label: "Our Work" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "text-brand-600 font-bold"
    : "text-ink-soft hover:text-brand-600";
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* Utility bar */}
      <div className="bg-brand-900 text-[#CDE4D5] text-[13px]">
        <Container className="flex flex-wrap items-center justify-between gap-1.5 py-2.5">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8FB8A0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3l3 5-2 2c1 2 3 4 5 5l2-2 5 3-1 3c-9 1-16-6-15-15Z" /></svg>
              +250 781 707 587
            </span>
            <span className="hidden items-center gap-2 sm:flex">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8FB8A0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
              simeon.musabende@machineryrings.org
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 text-[#8FB8A0] md:flex">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8FB8A0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.2" /></svg>
              Gashora Sector, Bugesera District
            </span>
            <span className="opacity-35">|</span>
            <div className="flex gap-2.5 text-[#8FB8A0]">
              <span className="font-semibold text-white">EN</span>
              <span>RW</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Header */}
      <header className="relative border-b border-line bg-white">
        <Container className="flex items-center justify-between gap-5 py-4">
          <NavLink to="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
            <BrandMark size="lg" />
            <span className="whitespace-nowrap font-display text-lg font-extrabold tracking-tight text-ink">
              Machinery Ring <span className="text-brand-600">Rwanda</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-5 whitespace-nowrap text-[14.5px] font-medium lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <NavLink
              to="/contact#request"
              className="hidden whitespace-nowrap rounded-lg bg-brand-600 px-[19px] py-[11px] text-[14.5px] font-semibold text-white hover:bg-brand-700 sm:inline-block"
              onClick={() => setMenuOpen(false)}
            >
              Request a service
            </NavLink>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center text-ink lg:hidden"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </Container>

        {menuOpen && (
          <div className="border-t border-line bg-white px-6 py-4 lg:hidden">
            <nav className="flex flex-col gap-3 text-[15px] font-medium">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <NavLink
              to="/contact#request"
              onClick={() => setMenuOpen(false)}
              className="mt-4 block rounded-lg bg-brand-600 px-4 py-3 text-center text-[15px] font-semibold text-white sm:hidden"
            >
              Request a service
            </NavLink>
          </div>
        )}
      </header>
    </div>
  );
}
