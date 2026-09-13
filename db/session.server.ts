// app/session.server.ts
import { createCookieSessionStorage, redirect } from "react-router";
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session", // The cookie name
    httpOnly: true,    // Prevents JavaScript from reading the cookie
    path: "/",         // Works across the entire site
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "super-secret-key"], // Used to sign the cookie
    secure: process.env.NODE_ENV === "production", // Requires HTTPS in production
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

/**
 * Guards every admin loader AND action. A layout route's loader alone is not
 * enough: React Router only runs the matching leaf route's action on a POST
 * (parent loaders re-run afterwards, just to render the response) — so a
 * nested route's own action must check the session itself, or it stays
 * reachable by an unauthenticated request even while its page appears
 * protected. Throws a redirect to /login when there is no session.
 */
export async function requireUserSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    throw redirect("/login");
  }
  return session;
}