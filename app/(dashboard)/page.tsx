import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckSquare2,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

const workspaceLinks = [
  {
    title: "Organizations",
    description: "Set up the spaces where your teams work.",
    href: "/organizations",
    icon: Building2,
  },
  {
    title: "Teams",
    description: "Bring people together around shared work.",
    href: "/teams",
    icon: UsersRound,
  },
  {
    title: "Projects",
    description: "Plan and track work across your projects.",
    href: "/projects",
    icon: BriefcaseBusiness,
  },
  {
    title: "Tasks",
    description: "Keep track of the work that needs to get done.",
    href: "/tasks",
    icon: CheckSquare2,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your workspace for organizing projects and getting work done."
      />

      <section
        aria-labelledby="getting-started-heading"
        className="rounded-xl border bg-card p-6 sm:p-8"
      >
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-medium text-primary">Welcome to Planora</p>
          <h2 id="getting-started-heading" className="text-2xl font-semibold">
            Bring your work together.
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Start by setting up an organization, then add teams and projects to
            give your work a home.
          </p>
          <Button asChild className="mt-2">
            <Link href="/organizations">
              Explore organizations <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="workspace-heading" className="space-y-4">
        <div>
          <h2 id="workspace-heading" className="text-lg font-semibold">
            Your workspace
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Navigate to an area to get started.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {workspaceLinks.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="group flex min-h-32 items-start gap-4 rounded-xl border bg-card p-5 transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 font-medium">
                  {title}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                  />
                </span>
                <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                  {description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
