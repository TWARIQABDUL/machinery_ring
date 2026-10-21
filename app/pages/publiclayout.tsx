import { Outlet, useLocation } from "react-router";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      {!isHome && (
        <div className="sticky top-0 z-40">
          <SiteHeader />
        </div>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
