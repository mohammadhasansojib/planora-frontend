import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Layers3,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Planora",
  description:
    "Learn about Planora and our focus on making project work clearer and more connected.",
};

const principles = [
  {
    icon: Compass,
    title: "Clarity over clutter",
    description:
      "Plans should be easy to understand. Planora brings the work into one organized space, so teams can focus on what matters next.",
  },
  {
    icon: UsersRound,
    title: "Progress is a team effort",
    description:
      "Good work gets better when people share context, ownership, and a clear view of the same goals.",
  },
  {
    icon: CheckCircle2,
    title: "Small steps add up",
    description:
      "Big outcomes begin with manageable tasks. Make the next step visible and progress becomes easier to sustain.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8faf8] text-slate-900">
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/home" className="flex items-center gap-2.5 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            P
          </span>
          <span className="text-lg tracking-tight">Planora</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 text-sm text-slate-600 md:flex"
        >
          <Link
            className="transition-colors hover:text-primary"
            href="/home#features"
          >
            Product
          </Link>
          <Link
            aria-current="page"
            className="font-medium text-primary"
            href="/about"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-primary sm:inline-flex"
            href="/login"
          >
            Log in
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            href="/register"
          >
            Get started <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </header>

      <section className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pt-24">
        <div
          aria-hidden="true"
          className="absolute -right-24 top-8 size-80 rounded-full bg-emerald-100/70 blur-3xl"
        />
        <div className="relative grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-emerald-800 shadow-sm">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              About Planora
            </div>
            <h1 className="max-w-3xl font-heading text-5xl leading-[1.08] font-medium tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Better work starts with{" "}
              <span className="text-primary">a little more clarity.</span>
            </h1>
          </div>
          <p className="relative max-w-xl pb-1 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:justify-self-end">
            Planora is a workspace for bringing projects, teams, and tasks
            together. It is designed to help make everyday work easier to
            understand, organize, and move forward.
          </p>
        </div>

        <div className="relative mt-14 overflow-hidden rounded-3xl bg-[#123c32] px-6 py-9 text-white sm:px-10 sm:py-12 lg:mt-20 lg:px-14 lg:py-14">
          <div
            aria-hidden="true"
            className="absolute -right-14 -top-32 size-80 rounded-full border border-emerald-100/10"
          />
          <div
            aria-hidden="true"
            className="absolute -right-2 -top-20 size-56 rounded-full border border-emerald-100/10"
          />
          <div className="relative grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-10">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-emerald-100">
              <Layers3 aria-hidden="true" className="size-7" />
            </span>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.16em] text-emerald-200 uppercase">
                Why we built it
              </p>
              <h2 className="mt-3 font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
                Keep the plan, the people, and the progress connected.
              </h2>
              <p className="mt-4 text-sm leading-7 text-emerald-50/80 sm:text-base">
                Work can get scattered across projects, conversations, and to-do
                lists. Planora brings those pieces into a shared
                workspace—helping teams see what they are working on and what
                comes next.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              What guides us
            </p>
            <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl">
              Thoughtful work, made easier to move forward.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
              The way we think about project work comes back to a few simple
              principles.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200/80 bg-[#fcfdfc] p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <p className="mt-6 text-xs font-medium text-slate-400">
                  0{index + 1}
                </p>
                <h3 className="mt-1 font-heading text-lg font-medium text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-emerald-100 bg-emerald-50/70 px-6 py-9 sm:px-10 sm:py-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Make space for progress
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-tight font-medium tracking-tight text-slate-950 sm:text-4xl">
              Bring your next project into focus.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Start a workspace for your projects, people, and plans.
            </p>
          </div>
          <Link
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href="/register"
          >
            Get started <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <Link
            href="/home"
            className="flex items-center gap-2 font-semibold text-slate-800"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-primary-foreground">
              P
            </span>
            Planora
          </Link>
          <p>Plan your work. Make progress together.</p>
          <div className="flex items-center gap-4">
            <Link
              className="transition-colors hover:text-primary"
              href="/login"
            >
              Log in
            </Link>
            <Link
              className="transition-colors hover:text-primary"
              href="/register"
            >
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
