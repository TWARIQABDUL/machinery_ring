import { Link } from "react-router";
import Container from "./container";

const FOOTER_COLUMNS = [
  {
    heading: "Services",
    links: [
      { to: "/services", label: "Maize & bean planting" },
      { to: "/services", label: "Shelling & threshing" },
      { to: "/services", label: "Training & advisory" },
      { to: "/services", label: "Machinery care" },
      { to: "/services", label: "Land preparation" },
    ],
  },
  {
    heading: "About",
    links: [
      { to: "/about", label: "Who we are" },
      { to: "/about", label: "Our local Rings" },
      { to: "/about", label: "Our team" },
      { to: "/about", label: "Our partners" },
    ],
  },
  {
    heading: "Our Work",
    links: [
      { to: "/our-work", label: "The project" },
      { to: "/our-work", label: "Field updates" },
      { to: "/gallery", label: "Gallery" },
      { to: "/blog", label: "Blog" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-navy text-[14px] text-[#A9CFB6]">
      <Container className="pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="inline-block rounded-lg bg-white px-3 py-2">
              <img src="/logo.png" alt="Maschinenring Foundation Rwanda" className="h-8 w-auto" />
            </div>
            <p className="max-w-[24em] text-[13.5px] text-[#8FB8A0]">
              Farmers accessing agricultural machinery, practical training and coordinated services through cooperation in
              Gashora Sector, Bugesera District.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading} className="flex flex-col gap-2.5">
              <span className="text-[13px] font-bold uppercase tracking-wide text-white">{column.heading}</span>
              {column.links.map((link) => (
                <Link key={link.label} to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="flex flex-col gap-3.5">
            <span className="text-[13px] font-bold uppercase tracking-wide text-white">Get in touch</span>
            <p className="text-[13.5px] leading-[1.7] text-[#8FBF9F]">
              Gashora Sector, Bugesera District, Rwanda
              <br />
              +250 781 707 587
              <br />
              simeon.musabende@machineryrings.org
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-6 text-[13px] text-[#8FBF9F]">
          <span>&copy; {new Date().getFullYear()} Machinery Ring Rwanda.</span>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-white">
              Privacy
            </Link>
            <a
              href="https://www.linkedin.com/company/109160918/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#8FBF9F] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <span className="font-semibold text-white">EN</span>
            <span>RW</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
