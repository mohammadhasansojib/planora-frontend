import {
  ArrowRight,
  Check,
  CircleCheck,
  Clock3,
  Layers3,
  ListTodo,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Plan your best work",
  description:
    "Bring your projects, teams, and tasks together in one clear workspace with Planora.",
};

const features = [
  {
    icon: Layers3,
    title: "Keep every project in view",
    description:
      "Give each initiative a clear home, so plans and priorities stay easy to find.",
  },
  {
    icon: ListTodo,
    title: "Turn plans into progress",
    description:
      "Break work into manageable tasks, assign ownership, and keep the next step clear.",
  },
  {
    icon: UsersRound,
    title: "Bring your team together",
    description:
      "Organize people around shared goals and make collaboration feel effortless.",
  },
];

export default function HomePage() {
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
            href="#overview"
          >
            Overview
          </Link>
          <Link
            className="transition-colors hover:text-primary"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="transition-colors hover:text-primary"
            href="#workflow"
          >
            How it works
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

      <section
        id="overview"
        className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:pb-32 lg:pt-20"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-emerald-800 shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-500" />A clearer
            way to work together
          </div>
          <h1 className="font-heading text-5xl leading-[1.08] font-medium tracking-tight text-slate-950 sm:text-6xl lg:text-[4.4rem]">
            Make room for your <span className="text-primary">best work.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Plan projects, bring your team together, and turn good ideas into
            meaningful progress—all in one calm, organized workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              href="/register"
            >
              Create your workspace{" "}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              href="/login"
            >
              Log in to Planora
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Check aria-hidden="true" className="size-3.5 text-primary" />
              Projects and tasks in one place
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check aria-hidden="true" className="size-3.5 text-primary" />
              Built for teams of every size
            </span>
          </div>
        </div>

        <section
          aria-label="Preview of the Planora project dashboard"
          className="relative mx-auto w-full max-w-2xl lg:mr-0"
        >
          <div className="absolute -inset-8 rounded-[3rem] bg-emerald-100/70 blur-3xl" />
          <div className="absolute -right-5 -top-6 size-28 rounded-full border border-emerald-200/70" />
          <div className="absolute -bottom-8 -left-6 size-36 rounded-full border border-emerald-200/70" />
          <div className="relative rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_30px_90px_-38px_rgba(15,74,54,0.35)] sm:rounded-3xl sm:p-5">
            <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Layers3 aria-hidden="true" className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Product launch
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Team workspace
                  </p>
                </div>
              </div>
              <div
                className="flex -space-x-2"
                role="img"
                aria-label="Three team members"
              >
                {["bg-amber-200", "bg-sky-200", "bg-rose-200"].map(
                  (color, i) => (
                    <span
                      key={color}
                      className={`flex size-7 items-center justify-center rounded-full border-2 border-white text-[9px] font-semibold text-slate-700 ${color}`}
                    >
                      {["AM", "JD", "SK"][i]}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3">
              {[
                { label: "Active tasks", value: "18", icon: ListTodo },
                { label: "Completed", value: "12", icon: CircleCheck },
                { label: "Days to launch", value: "08", icon: Clock3 },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">{label}</span>
                    <Icon
                      aria-hidden="true"
                      className="size-3.5 text-primary"
                    />
                  </div>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-slate-800">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Project progress
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Moving forward, together
                  </p>
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                  On track
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[68%] rounded-full bg-primary" />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                <span>12 of 18 tasks complete</span>
                <span>68%</span>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {[
                { label: "Finalize project brief", tag: "Today", done: true },
                {
                  label: "Review launch checklist",
                  tag: "Tomorrow",
                  done: false,
                },
              ].map((task) => (
                <div
                  key={task.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5"
                >
                  <span
                    className={`flex size-4 items-center justify-center rounded-full border ${task.done ? "border-primary bg-primary text-white" : "border-slate-300"}`}
                  >
                    {task.done ? (
                      <Check aria-hidden="true" className="size-2.5" />
                    ) : null}
                  </span>
                  <span className="flex-1 text-[10px] font-medium text-slate-700">
                    {task.label}
                  </span>
                  <span className="text-[9px] text-slate-400">{task.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>

      <section id="features" className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Everything in sync
            </p>
            <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl">
              Less busywork. More momentum.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
              A shared space for the plans, people, and everyday work that move
              your team forward.
            </p>
          </div>
          <div className="mt-11 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200/80 bg-[#fcfdfc] p-6 transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5"
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

      <section
        id="workflow"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-[#123c32] px-6 py-9 text-white sm:px-10 sm:py-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-emerald-200 uppercase">
              Your next chapter starts here
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
              Give good ideas a place to grow.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/75">
              Bring your team into one workspace and make the work ahead feel
              clear, connected, and achievable.
            </p>
          </div>
          <Link
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-[#123c32] transition-colors hover:bg-emerald-50"
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
