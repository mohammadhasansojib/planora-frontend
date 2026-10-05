"use client";

import { CheckCircle2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthApiError, loginUser } from "@/lib/api/auth";

const inputClassName =
  "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAccepted, setLoginAccepted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await loginUser({
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
      });
      setLoginAccepted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof AuthApiError
          ? submissionError.message
          : "Login could not be completed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loginAccepted) {
    return (
      <div
        aria-live="polite"
        className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4"
      >
        <CheckCircle2
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary"
        />
        <div>
          <p className="font-medium">Login successful</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your credentials were accepted. Session persistence and protected
            navigation will be added in the next authentication step.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClassName}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={inputClassName}
          required
          disabled={isSubmitting}
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}
