import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardOrganizationProvider } from "@/components/organizations/dashboard-organization-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardOrganizationProvider>
      <div className="min-h-screen bg-muted/30">
        <DashboardSidebar />
        <div className="min-h-screen md:pl-64">
          <DashboardHeader />
          <main className="mx-auto w-full max-w-7xl p-5 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardOrganizationProvider>
  );
}
