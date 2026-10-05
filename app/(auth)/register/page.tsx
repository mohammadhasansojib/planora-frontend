import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
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
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up to start organizing your work with Planora.
          </p>
        </div>
        <RegisterForm />
      </section>
    </div>
  );
}
