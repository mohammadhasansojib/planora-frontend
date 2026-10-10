import type { Metadata } from "next";
import { TaskManagement } from "@/components/tasks/task-management";

export const metadata: Metadata = {
  title: "Tasks",
};

export default function TasksPage() {
  return <TaskManagement />;
}
