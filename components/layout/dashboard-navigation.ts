import {
  BriefcaseBusiness,
  Building2,
  CheckSquare2,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";

export const dashboardNavigation = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Organizations", href: "/organizations", icon: Building2 },
  { title: "Teams", href: "/teams", icon: UsersRound },
  { title: "Projects", href: "/projects", icon: BriefcaseBusiness },
  { title: "Tasks", href: "/tasks", icon: CheckSquare2 },
] as const;
