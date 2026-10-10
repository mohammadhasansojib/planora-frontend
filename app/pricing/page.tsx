import {
  ArrowRight,
  Check,
  CircleHelp,
  Layers3,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Explore Planora's current options for organizing projects, teams, and tasks.",
};

const plans = [
  {
    name: "Free",
    summary: "A simple place to get started with your work.",
    price: "Free",
    cadence: "No payment details needed to get started",
    features: [
      "Organize projects and tasks",
      "Create a workspace for your work",
      "Bring your team into the plan",
    ],
    action: "Get started",
    href: "/register",
    featured: false,
  },
  {
    name: "Team",
    summary: "A workspace for teams ready to plan together.",
    price: "Let’s talk",
    cadence: "Contact us for plan details",
    features: [
      "Coordinate work across projects",
      "Keep team plans and tasks together",
      "Discuss the right setup for your team",
    ],
    action: "Contact us",
    href: "/contact",
    featured: true,
  },
];

const faqs = [
  {
    question: "Is the Team plan available to purchase online?",
    answer:
      "Not yet. Contact us to discuss team options and availability. This page does not process payments or start a subscription.",
  },
  {
    question: "Do I need payment details to get started?",
    answer:
      "No. You can create an account and explore Planora without entering payment details.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Plan options and changes are handled with our team. Get in touch if you have questions about the right setup.",
  },
];

export default function PricingPage() {
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
          <Link className="transition-colors hover:text-primary" href="/about">
            About
          </Link>
          <Link
            aria-current="page"
            className="font-medium text-primary"
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
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-emerald-800 shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Planora pricing
          </div>
          <h1 className="font-heading text-5xl leading-[1.08] font-medium tracking-tight text-slate-950 sm:text-6xl">
            A clear place to{" "}
            <span className="text-primary">start planning.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Get started for free, or talk with us about bringing your team into
            one shared workspace.
          </p>
        </div>

        <div className="relative mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-6 shadow-sm sm:p-8 ${
                plan.featured
                  ? "border-[#123c32] bg-[#123c32] text-white shadow-emerald-950/10"
                  : "border-slate-200/80 bg-white text-slate-900"
              }`}
            >
              {plan.featured ? (
                <span className="absolute right-6 top-6 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-emerald-100">
                  For teams
                </span>
              ) : null}
              <span
                className={`flex size-11 items-center justify-center rounded-xl ${
                  plan.featured
                    ? "bg-white/10 text-emerald-100"
                    : "bg-emerald-50 text-primary"
                }`}
              >
                {plan.featured ? (
                  <UsersRound aria-hidden="true" className="size-5" />
                ) : (
                  <Layers3 aria-hidden="true" className="size-5" />
                )}
              </span>
              <h2 className="mt-6 text-sm font-semibold">{plan.name}</h2>
              <p
                className={`mt-2 min-h-12 text-sm leading-6 ${
                  plan.featured ? "text-emerald-50/75" : "text-slate-600"
                }`}
              >
                {plan.summary}
              </p>
              <p className="mt-7 font-heading text-4xl font-medium tracking-tight">
                {plan.price}
              </p>
              <p
                className={`mt-2 text-xs ${
                  plan.featured ? "text-emerald-100/70" : "text-slate-500"
                }`}
              >
                {plan.cadence}
              </p>
              <div
                className={`my-7 border-t ${
                  plan.featured ? "border-white/15" : "border-slate-100"
                }`}
              />
              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      aria-hidden="true"
                      className={`mt-0.5 size-4 shrink-0 ${
                        plan.featured ? "text-emerald-200" : "text-primary"
                      }`}
                    />
                    <span
                      className={
                        plan.featured ? "text-emerald-50/90" : "text-slate-700"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                className={`mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors ${
                  plan.featured
                    ? "bg-white text-[#123c32] hover:bg-emerald-50"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                href={plan.href}
              >
                {plan.action}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </article>
          ))}
        </div>
        <p className="relative mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-slate-500">
          Plan details may change as Planora grows. Team pricing and
          availability are shared directly; no payment is taken from this page.
        </p>
      </section>

      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="text-center">
            <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-primary">
              <CircleHelp aria-hidden="true" className="size-5" />
            </span>
            <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Good to know
            </p>
            <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl">
              Pricing questions
            </h2>
          </div>
          <div className="mt-9 divide-y divide-slate-200">
            {faqs.map(({ question, answer }) => (
              <article key={question} className="py-5">
                <h3 className="text-sm font-semibold text-slate-900">
                  {question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {answer}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-center text-sm text-slate-600">
            Need more information?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href="/contact"
            >
              Contact us
            </Link>
            .
          </p>
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
