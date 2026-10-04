import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <PageHeader
      title="Projects"
      description="Plan and manage work across your projects."
    />
  );
}
