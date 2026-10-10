"use client";

import "./globals.css";
import { ErrorPage } from "@/components/layout/error-page";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ErrorPage error={error} retry={retry} />
      </body>
    </html>
  );
}
