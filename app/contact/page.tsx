import {
  ArrowRight,
  BookOpenText,
  CircleHelp,
  Mail,
  MessageCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Find the right place to get help and learn more about Planora.",
};

const contactOptions = [
  {
    icon: CircleHelp,
    title: "Product questions",
    description:
      "Learn how Planora brings projects, teams, and tasks together in one workspace.",
    href: "/home#features",
    linkLabel: "Explore the product",
  },
  {
    icon: BookOpenText,
    title: "Account and workspace",
    description:
      "Sign in to access your workspace and manage your Planora account.",
    href: "/login",
    linkLabel: "Go to log in",
  },
  {
    icon: MessageCircle,
    title: "General inquiries",
    description:
      "For questions about Planora, contact our team by email. We look forward to hearing from you.",
    href: "mailto:hello@planora.app",
    linkLabel: "hello@planora.app",
  },
];

export default function ContactPage() {
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
            href="/contact"
          >
            Contact
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
            Contact Planora
          </div>
          <h1 className="font-heading text-5xl leading-[1.08] font-medium tracking-tight text-slate-950 sm:text-6xl">
            We’re here to help you{" "}
            <span className="text-primary">find your way.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Whether you’re learning about Planora or looking for your workspace,
            start with one of the options below.
          </p>
        </div>

        <div className="relative mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
          {contactOptions.map(
            ({ icon: Icon, title, description, href, linkLabel }) => (
              <article
                key={title}
                className="flex min-h-64 flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-950/[0.02]"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-6 font-heading text-xl font-medium text-slate-900">
                  {title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                  {description}
                </p>
                <Link
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-emerald-800"
                  href={href}
                >
                  {linkLabel}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center lg:px-12">
          <div className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Mail aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Prefer email?
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Write to{" "}
                <a
                  className="font-medium text-primary hover:underline"
                  href="mailto:hello@planora.app"
                >
                  hello@planora.app
                </a>
                .
              </p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            This page is informational. Email opens your mail application; no
            message is sent or stored by this website.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-[#123c32] px-6 py-9 text-white sm:px-10 sm:py-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-emerald-200 uppercase">
              New to Planora?
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
              Get to know your next workspace.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/75">
              See how projects, teams, and tasks come together.
            </p>
          </div>
          <Link
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-[#123c32] transition-colors hover:bg-emerald-50"
            href="/home"
          >
            Explore Planora <ArrowRight aria-hidden="true" className="size-4" />
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
