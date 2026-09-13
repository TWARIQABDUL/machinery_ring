import React from 'react'
import type { Route } from './+types/registerpage'
import pool from '../../db';
import bcrypt from "bcrypt";
import { commitSession, getSession } from '../../db/session.server';
import { Form, redirect, useActionData } from 'react-router';


export async function action({request}:Route.ActionArgs) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
        throw new Error("Invalid form data");
    }

    const {rows} = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    const user = rows[0]
    if (rows.length > 0) {
        return { error: "This email is already in use" };
        // throw new Error("User not found");
    }

    const pwdEncrypt = await bcrypt.hash(password,10)

    // const isValid = await bcrypt.compare(password, user.password);
    // if (!isValid) {
    //     return { error: "Invalid email or password" };
    //     // throw new Error("Invalid password");
    // }

    const {rows: newUserRows} = await pool.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, pwdEncrypt]);
    const newUser = newUserRows[0];
    if (!newUser) {
        return { error: "Failed to create user" };
    }

    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);

    session.set("userId", newUser.id);
    return redirect("/dashboard", {
        headers: {
            "Set-Cookie": await commitSession(session)
        }
    });
}

function RegisterPage() {
  const actionData = useActionData() as { error?: string } | undefined;
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold text-ink">Create admin account</h1>
      {actionData?.error && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{actionData.error}</p>
      )}
      <Form method="post" className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-soft">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink focus:border-brand-600 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-soft">
          Password
          <input
            type="password"
            name="password"
            required
            className="rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink focus:border-brand-600 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="mt-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Register
        </button>
      </Form>
    </div>
  )
}

export default RegisterPage