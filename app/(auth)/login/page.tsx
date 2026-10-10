import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
          P
        </span>
        Planora
      </Link>
      <section className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Log in to continue to your Planora workspace.
          </p>
        </div>
        <LoginForm
          demoLoginEnabled={Boolean(
            process.env.DEMO_LOGIN_EMAIL && process.env.DEMO_LOGIN_PASSWORD,
          )}
        />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create account
          </Link>
        </p>
      </section>
    </div>
  );
}
