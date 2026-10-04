import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Teams",
};

export default function TeamsPage() {
  return (
    <PageHeader
      title="Teams"
      description="View and organize teams across your workspace."
    />
  );
}
