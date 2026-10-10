import {
  ArrowRight,
  Check,
  CreditCard,
  Layers3,
  MessageSquareText,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore how Planora helps teams organize workspaces, projects, and tasks in one place.",
};

const services = [
  {
    icon: Layers3,
    number: "01",
    title: "Organizations for your work",
    description:
      "Create a home for your work and keep related projects and teams organized under a shared workspace.",
    points: ["Set up an organization", "Keep work grouped in one place"],
  },
  {
    icon: UsersRound,
    number: "02",
    title: "Teams that work together",
    description:
      "Bring people around shared goals and give teammates a clear place to coordinate their work.",
    points: [
      "Create teams in your workspace",
      "Keep people connected to projects",
    ],
  },
  {
    icon: Layers3,
    number: "03",
    title: "Projects with a clear direction",
    description:
      "Give each initiative a dedicated place. Keep project context close to the work and make it easier to see what the team is moving toward.",
    points: ["Keep initiatives easy to find", "Connect project plans to tasks"],
  },
  {
    icon: Check,
    number: "04",
    title: "Tasks that move work forward",
    description:
      "Break projects into manageable tasks, make ownership visible, and keep the next step clear for everyone involved.",
    points: ["Track task progress", "Keep task details in context"],
  },
  {
    icon: MessageSquareText,
    number: "05",
    title: "Collaboration around the work",
    description:
      "Keep conversations and supporting details close to tasks, helping teammates share context as work takes shape.",
    points: [
      "Discuss task details with comments",
      "Add image attachments when useful",
    ],
  },
  {
    icon: CreditCard,
    number: "06",
    title: "Payments in your workspace",
    description:
      "Use the configured bKash checkout flow and review payment history from the Planora workspace.",
    points: ["Start a bKash checkout", "View payment history"],
  },
];

export default function ServicesPage() {
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
            className="font-medium text-primary"
            href="/services"
            aria-current="page"
          >
            Services
          </Link>
          <Link className="transition-colors hover:text-primary" href="/about">
            About
          </Link>
          <Link
            className="transition-colors hover:text-primary"
            href="/pricing"
          >
            Pricing
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
              What you can do with Planora
            </div>
            <h1 className="max-w-3xl font-heading text-5xl leading-[1.08] font-medium tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              From shared plans to{" "}
              <span className="text-primary">real progress.</span>
            </h1>
          </div>
          <p className="relative max-w-xl pb-1 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:justify-self-end">
            Planora gives your team one connected place to organize its
            workspace, coordinate projects, and keep everyday tasks moving.
          </p>
        </div>

        <div className="relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(
            ({ icon: Icon, number, title, description, points }) => (
              <article
                key={number}
                className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-950/[0.02] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="text-xs font-medium tracking-[0.16em] text-slate-400">
                    {number}
                  </span>
                </div>
                <h2 className="mt-7 font-heading text-2xl font-medium tracking-tight text-slate-950">
                  {title}
                </h2>
                <p className="mt-3 min-h-14 text-sm leading-6 text-slate-600">
                  {description}
                </p>
                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm text-slate-700"
                    >
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-primary"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                A simple rhythm
              </p>
              <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl">
                Make the next step easier to see.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                Give work a structure, bring the right people in, then keep
                moving one task at a time.
              </p>
            </div>
            <ol className="space-y-4">
              {[
                {
                  title: "Set up your workspace",
                  description:
                    "Create an organization and bring your team into the same space.",
                },
                {
                  title: "Shape the project",
                  description:
                    "Give your initiative a home and break the plan into tasks.",
                },
                {
                  title: "Keep progress visible",
                  description:
                    "Update tasks and share the details teammates need to move ahead.",
                },
              ].map(({ title, description }, index) => (
                <li
                  key={title}
                  className="flex gap-4 rounded-2xl border border-slate-200/80 bg-[#fcfdfc] p-5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-medium text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-[#123c32] px-6 py-9 text-white sm:px-10 sm:py-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-emerald-200 uppercase">
              Bring your work together
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
              Ready to make a plan?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/75">
              Create your Planora account and start organizing your projects,
              people, and tasks.
            </p>
          </div>
          <Link
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-[#123c32] transition-colors hover:bg-emerald-50"
            href="/register"
          >
            Create your workspace{" "}
            <ArrowRight aria-hidden="true" className="size-4" />
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
              href="/about"
            >
              About
            </Link>
            <Link
              className="transition-colors hover:text-primary"
              href="/contact"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
