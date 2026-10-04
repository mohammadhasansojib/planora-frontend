import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Tasks",
};

export default function TasksPage() {
  return (
    <PageHeader
      title="Tasks"
      description="Find and track the work that needs to get done."
    />
  );
}
