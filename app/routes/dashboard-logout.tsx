import { redirect } from "react-router";
import { destroySession, getSession } from "../../db/session.server";
import type { Route } from "./+types/dashboard-logout";

// Resource route: no UI of its own, just destroys the session and redirects.
export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export async function loader() {
  return redirect("/dashboard");
}

export default function DashboardLogout() {
  return null;
}
