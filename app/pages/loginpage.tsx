import pool from "../../db"
import { Form, redirect, useActionData } from "react-router";
import { getSession, commitSession } from "../../db/session.server";
import bcrypt from "bcrypt";
import SubmitButton from "../components/submit-button";
import type { Route } from "./+types/loginpage";

export async function action({request}:Route.ActionArgs) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
        throw new Error("Invalid form data");
    }

    const {rows} = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    const user = rows[0]
    if (!user) {
        return { error: "Invalid email or password" };
        // throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return { error: "Invalid email or password" };
        // throw new Error("Invalid password");
    }

    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    
    session.set("userId", user.id);
    return redirect("/dashboard", {
        headers: {
            "Set-Cookie": await commitSession(session)
        }
    });
}



export default function LoginPage() {

    const actionData = useActionData();
    return (
        <div className="flex flex-col gap-5">
            <h1 className="font-display text-2xl font-bold text-ink">Admin log in</h1>
            {actionData?.error && (
                <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
                    {actionData.error}
                </p>
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
                <SubmitButton
                    pendingText="Logging in…"
                    className="mt-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                    Log in
                </SubmitButton>
            </Form>
        </div>
    );
}