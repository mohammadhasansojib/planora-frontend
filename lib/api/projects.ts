import { apiRequest } from "@/lib/api/client";

export type ProjectRole = "MEMBER" | "MANAGER";

export type ProjectTeamContext = {
  id: string;
  name: string;
  organizationId: string;
};

export type Sprint = {
  id: string;
  name: string;
  projectId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  name: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  team: ProjectTeamContext;
  sprints: Sprint[];
};

export type CreatedProject = Omit<Project, "team" | "sprints">;

export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  createdAt: string;
  updatedAt: string;
};

export type ProjectMemberWithUser = ProjectMember & {
  user: {
    username: string;
    email: string;
  };
};

export type ProjectPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProjectPage = {
  projects: Project[];
  pagination: ProjectPagination;
};

export class ProjectApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProjectTeamContext(value: unknown): value is ProjectTeamContext {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.organizationId === "string"
  );
}

function isProject(value: unknown): value is Project {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.teamId === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    isProjectTeamContext(value.team) &&
    Array.isArray(value.sprints) &&
    value.sprints.every(isSprint)
  );
}

function isSprint(value: unknown): value is Sprint {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.projectId === "string" &&
    typeof value.startTime === "string" &&
    typeof value.endTime === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isProjectPagination(value: unknown): value is ProjectPagination {
  return (
    isRecord(value) &&
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    typeof value.total === "number" &&
    typeof value.totalPages === "number"
  );
}

function isProjectMember(value: unknown): value is ProjectMember {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.projectId === "string" &&
    typeof value.userId === "string" &&
    (value.role === "MEMBER" || value.role === "MANAGER") &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isProjectMemberWithUser(
  value: unknown,
): value is ProjectMemberWithUser {
  if (!isRecord(value)) {
    return false;
  }

  const user = value.user;
  return (
    isProjectMember(value) &&
    isRecord(user) &&
    typeof user.username === "string" &&
    typeof user.email === "string"
  );
}

function getMessage(payload: unknown): string | undefined {
  if (
    isRecord(payload) &&
    typeof payload.message === "string" &&
    payload.message.trim()
  ) {
    return payload.message;
  }

  return undefined;
}

async function requestPayload(
  path: string,
  init: RequestInit,
  operation: string,
): Promise<Record<string, unknown>> {
  let response: Response;
  try {
    response = await apiRequest(path, init);
  } catch (error) {
    throw new ProjectApiError(
      error instanceof Error
        ? error.message
        : `${operation} could not be completed. Please try again.`,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ProjectApiError(
      `The server returned an unreadable ${operation.toLowerCase()} response.`,
    );
  }

  if (!response.ok) {
    throw new ProjectApiError(
      getMessage(payload) ??
        `${operation} failed (HTTP ${response.status}). Please try again.`,
    );
  }

  if (!isRecord(payload) || payload.success !== true) {
    throw new ProjectApiError(
      getMessage(payload) ??
        `The server returned an unexpected ${operation.toLowerCase()} response.`,
    );
  }

  return payload;
}

export async function getProjects(
  organizationId: string,
  page: number,
  limit: number,
): Promise<ProjectPage> {
  const query = new URLSearchParams({
    organizationId,
    page: String(page),
    limit: String(limit),
  });
  const payload = await requestPayload(
    `/projects?${query.toString()}`,
    { method: "GET" },
    "Project loading",
  );
  const data = payload.data;

  if (
    !isRecord(data) ||
    !Array.isArray(data.projects) ||
    !data.projects.every(isProject) ||
    !isProjectPagination(data.pagination)
  ) {
    throw new ProjectApiError(
      "The server returned an unexpected project list.",
    );
  }

  return {
    projects: data.projects,
    pagination: data.pagination,
  };
}

export async function createProject(
  name: string,
  teamId: string,
): Promise<CreatedProject> {
  const payload = await requestPayload(
    "/projects",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, teamId }),
    },
    "Project creation",
  );
  const data = payload.data;

  if (!isRecord(data) || !isRecord(data.project)) {
    throw new ProjectApiError(
      "The server returned an unexpected project creation response.",
    );
  }

  const project = data.project;
  if (
    typeof project.id !== "string" ||
    typeof project.name !== "string" ||
    typeof project.teamId !== "string" ||
    typeof project.createdAt !== "string" ||
    typeof project.updatedAt !== "string"
  ) {
    throw new ProjectApiError(
      "The server returned an unexpected project creation response.",
    );
  }

  return {
    id: project.id,
    name: project.name,
    teamId: project.teamId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export async function createSprint(
  name: string,
  projectId: string,
  startTime: string,
  endTime: string,
): Promise<Sprint> {
  const payload = await requestPayload(
    "/sprints",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, projectId, startTime, endTime }),
    },
    "Sprint creation",
  );
  const data = payload.data;

  if (!isRecord(data) || !isSprint(data.sprint)) {
    throw new ProjectApiError(
      "The server returned an unexpected sprint creation response.",
    );
  }

  return data.sprint;
}

export async function addProjectMember(
  projectId: string,
  userId: string,
  role: ProjectRole,
): Promise<ProjectMember> {
  const payload = await requestPayload(
    `/projects/${encodeURIComponent(projectId)}/members`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, role }),
    },
    "Adding project member",
  );
  const data = payload.data;

  if (!isRecord(data) || !isProjectMember(data.member)) {
    throw new ProjectApiError(
      "The server returned an unexpected project member response.",
    );
  }

  return data.member;
}

export async function getProjectMembers(
  projectId: string,
): Promise<ProjectMemberWithUser[]> {
  const payload = await requestPayload(
    `/projects/${encodeURIComponent(projectId)}/members`,
    { method: "GET" },
    "Project member loading",
  );
  const data = payload.data;

  if (
    !isRecord(data) ||
    !Array.isArray(data.members) ||
    !data.members.every(isProjectMemberWithUser)
  ) {
    throw new ProjectApiError(
      "The server returned an unexpected project member list.",
    );
  }

  return data.members;
}
