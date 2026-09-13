import { Form, Outlet, redirect } from "react-router";
import { getSession } from "../../db/session.server";
import Container from "../components/container";
import BrandMark from "../components/brand-mark";
import AdminNav from "../components/admin/admin-nav";
import type { Route } from "./+types/dashboard";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    return redirect("/login");
  }
  return null;
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <header className="border-b border-line bg-white">
        <Container className="flex items-center justify-between py-4">
          <span className="flex items-center gap-2.5 font-display text-lg font-extrabold text-ink">
            <BrandMark size="md" />
            Machinery Ring <span className="text-brand-600">Rwanda</span>
            <span className="font-semibold text-muted-2">&middot; Admin</span>
          </span>
          <Form method="post" action="/dashboard/logout">
            <button
              type="submit"
              className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-brand-50"
            >
              Log out
            </button>
          </Form>
        </Container>
      </header>
      <Container className="flex flex-col gap-6 py-8">
        <AdminNav />
        <Outlet />
      </Container>
    </div>
  );
}
