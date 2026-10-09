"use client";

import type { ReactNode } from "react";
import { OrganizationProvider } from "./organization-provider";

export function DashboardOrganizationProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <OrganizationProvider>{children}</OrganizationProvider>;
}
