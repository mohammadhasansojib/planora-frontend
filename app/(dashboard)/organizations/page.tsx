import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Organizations",
};

export default function OrganizationsPage() {
  return (
    <PageHeader
      title="Organizations"
      description="Create and manage the organizations where your teams work."
    />
  );
}
