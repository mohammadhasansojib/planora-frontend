import type { Metadata } from "next";
import { OrganizationManagement } from "@/components/organizations/organization-management";

export const metadata: Metadata = {
  title: "Organizations",
};

export default function OrganizationsPage() {
  return <OrganizationManagement />;
}
