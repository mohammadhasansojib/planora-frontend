"use client";

import { ErrorPage } from "@/components/layout/error-page";

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <ErrorPage error={error} retry={retry} />;
}
