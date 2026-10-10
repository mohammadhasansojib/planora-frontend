import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

export function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8faf8] px-5 py-16 text-slate-900">
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-28 size-80 rounded-full bg-emerald-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-20 size-96 rounded-full bg-teal-100/60 blur-3xl"
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

        <div className="mx-auto mt-14 flex size-20 items-center justify-center rounded-3xl border border-emerald-100 bg-white text-primary shadow-lg shadow-emerald-950/5">
          <Compass aria-hidden="true" className="size-9" />
        </div>
        <p className="mt-8 text-sm font-semibold tracking-[0.2em] text-primary uppercase">
          Error 404
        </p>
        <h1 className="mt-3 font-heading text-4xl leading-tight font-medium tracking-tight text-slate-950 sm:text-5xl">
          This page wandered off.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          The link may be outdated, or the page may have moved. Let’s get you
          back to a place where your work is in order.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Planora
          </Link>
          <Link
            href="/home"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Visit the home page
          </Link>
        </div>
        <p className="mt-12 text-xs text-slate-400">
          Planora · Plan your work. Make progress together.
        </p>
      </section>
    </main>
  );
}
