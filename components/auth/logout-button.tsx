"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/api/auth";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setError(null);
    setIsSubmitting(true);

    try {
      await logoutUser();
      router.replace("/login");
      router.refresh();
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Logout could not be completed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        disabled={isSubmitting}
        aria-label="Log out"
      >
        <LogOut aria-hidden="true" />
        <span className="hidden sm:inline">
          {isSubmitting ? "Logging out..." : "Log out"}
        </span>
      </Button>
      {error ? (
        <p
          role="alert"
          className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-destructive/30 bg-card p-3 text-sm text-destructive shadow-lg"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
