"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { dashboardNavigation } from "./dashboard-navigation";

const titlesByPath: Record<string, string> = {
  "/": "Dashboard",
  "/organizations": "Organizations",
  "/teams": "Teams",
  "/projects": "Projects",
  "/tasks": "Tasks",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const title = titlesByPath[pathname] ?? "Planora";

  function toggleTheme() {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle("dark", nextIsDark);
    setIsDark(nextIsDark);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <X aria-hidden="true" />
          ) : (
            <Menu aria-hidden="true" />
          )}
        </Button>
        <p className="truncate text-base font-semibold">{title}</p>
      </div>

      <div className="flex items-center gap-2">
        <LogoutButton />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
          onClick={toggleTheme}
        >
          {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </Button>
      </div>

      {mobileMenuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-16 border-b bg-card p-3 shadow-lg md:hidden"
        >
          {dashboardNavigation.map(({ title: itemTitle, href, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon aria-hidden="true" className="size-4" />
                {itemTitle}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
