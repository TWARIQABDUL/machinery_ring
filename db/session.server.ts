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