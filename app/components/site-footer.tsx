import { Link } from "react-router";
import Container from "./container";
import BrandMark from "./brand-mark";

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
    <footer className="bg-brand-900 text-[14px] text-[#A9CFB6]">
      <Container className="pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <BrandMark size="sm" />
              <span className="font-display text-base font-extrabold text-white">Machinery Ring Rwanda</span>
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
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-white">
              Privacy
            </Link>
            <span className="font-semibold text-white">EN</span>
            <span>RW</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
