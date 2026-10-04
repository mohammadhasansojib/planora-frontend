"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardNavigation } from "./dashboard-navigation";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-background md:flex">
      <Link
        href="/"
        className="flex h-16 items-center gap-3 border-b px-6 text-lg font-semibold tracking-tight"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
          P
        </span>
        Planora
      </Link>
      <nav aria-label="Main navigation" className="flex-1 space-y-1 p-4">
        {dashboardNavigation.map(({ title, href, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-primary/10 text-primary hover:bg-primary/15",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4 text-xs text-muted-foreground">
        Project management, made clear.
      </div>
    </aside>
  );
}
