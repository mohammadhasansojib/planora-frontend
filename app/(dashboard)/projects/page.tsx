import type { Metadata } from "next";
import { ProjectManagement } from "@/components/projects/project-management";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return <ProjectManagement />;
}
