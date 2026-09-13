import { Link, Outlet } from "react-router";
import BrandMark from "../components/brand-mark";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#F7F9F7] px-6 py-12">
      <Link to="/" className="flex items-center gap-2.5">
        <BrandMark />
        <span className="font-display text-lg font-extrabold text-ink">
          Machinery Ring <span className="text-brand-600">Rwanda</span>
        </span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
