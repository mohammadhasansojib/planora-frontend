"use client";

import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error boundary caught an error:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8faf8] px-5 py-16 text-slate-900">
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-28 size-80 rounded-full bg-amber-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-20 size-96 rounded-full bg-emerald-100/60 blur-3xl"
      />
      <section className="relative w-full max-w-xl text-center">
        <Link
          href="/home"
          className="mx-auto inline-flex items-center gap-2.5 font-semibold"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            P
          </span>
          <span className="text-lg tracking-tight">Planora</span>
        </Link>

        <div className="mx-auto mt-14 flex size-20 items-center justify-center rounded-3xl border border-amber-100 bg-white text-amber-600 shadow-lg shadow-amber-950/5">
          <AlertTriangle aria-hidden="true" className="size-9" />
        </div>
        <p className="mt-8 text-sm font-semibold tracking-[0.2em] text-amber-700 uppercase">
          Something went wrong
        </p>
        <h1 className="mt-3 font-heading text-4xl leading-tight font-medium tracking-tight text-slate-950 sm:text-5xl">
          Let’s get things back on track.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          Planora hit an unexpected issue while loading this page. You can try
          again or return to a safe place.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={retry}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Try again
          </button>
          <Link
            href="/home"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Planora
          </Link>
        </div>
        {error.digest ? (
          <p className="mt-6 text-xs text-slate-400">
            Error reference: {error.digest}
          </p>
        ) : null}
      </section>
    </main>
  );
}
