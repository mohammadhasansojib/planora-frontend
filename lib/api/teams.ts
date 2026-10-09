import { apiRequest } from "@/lib/api/client";

export type Team = {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
};

export type TeamRole = "MEMBER" | "MANAGER";

export type TeamMember = {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  createdAt: string;
  updatedAt: string;
};

export type TeamMemberWithUser = TeamMember & {
  user: {
    username: string;
    email: string;
  };
};

export type TeamPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TeamPage = {
  teams: Team[];
  pagination: TeamPagination;
};

export class TeamApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeamApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTeam(value: unknown): value is Team {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.organizationId === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isTeamPagination(value: unknown): value is TeamPagination {
  return (
    isRecord(value) &&
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    typeof value.total === "number" &&
    typeof value.totalPages === "number"
  );
}

function isTeamMember(value: unknown): value is TeamMember {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.teamId === "string" &&
    typeof value.userId === "string" &&
    (value.role === "MEMBER" || value.role === "MANAGER") &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isTeamMemberWithUser(value: unknown): value is TeamMemberWithUser {
  if (!isRecord(value)) {
    return false;
  }

  const user = value.user;
  return (
    isTeamMember(value) &&
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
    throw new TeamApiError(
      error instanceof Error
        ? error.message
        : `${operation} could not be completed. Please try again.`,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new TeamApiError(
      `The server returned an unreadable ${operation.toLowerCase()} response.`,
    );
  }

  if (!response.ok) {
    throw new TeamApiError(
      getMessage(payload) ??
        `${operation} failed (HTTP ${response.status}). Please try again.`,
    );
  }

  if (!isRecord(payload) || payload.success !== true) {
    throw new TeamApiError(
      getMessage(payload) ??
        `The server returned an unexpected ${operation.toLowerCase()} response.`,
    );
  }

  return payload;
}

export async function getTeams(
  organizationId: string,
  page: number,
  limit: number,
): Promise<TeamPage> {
  const query = new URLSearchParams({
    organizationId,
    page: String(page),
    limit: String(limit),
  });
  const payload = await requestPayload(
    `/teams?${query.toString()}`,
    { method: "GET" },
    "Team loading",
  );
  const data = payload.data;

  if (
    !isRecord(data) ||
    !Array.isArray(data.teams) ||
    !data.teams.every(isTeam) ||
    !isTeamPagination(data.pagination)
  ) {
    throw new TeamApiError("The server returned an unexpected team list.");
  }

  return {
    teams: data.teams,
    pagination: data.pagination,
  };
}

export async function createTeam(
  name: string,
  organizationId: string,
): Promise<Team> {
  const payload = await requestPayload(
    "/teams",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, organizationId }),
    },
    "Team creation",
  );
  const data = payload.data;

  if (!isRecord(data) || !isTeam(data.team)) {
    throw new TeamApiError(
      "The server returned an unexpected team creation response.",
    );
  }

  return data.team;
}

export async function addTeamMember(
  teamId: string,
  userId: string,
  role: TeamRole,
): Promise<TeamMember> {
  const payload = await requestPayload(
    `/teams/${encodeURIComponent(teamId)}/members`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, role }),
    },
    "Adding team member",
  );
  const data = payload.data;

  if (!isRecord(data) || !isTeamMember(data.member)) {
    throw new TeamApiError(
      "The server returned an unexpected team member response.",
    );
  }

  return data.member;
}

export async function getTeamMembers(
  teamId: string,
): Promise<TeamMemberWithUser[]> {
  const payload = await requestPayload(
    `/teams/${encodeURIComponent(teamId)}/members`,
    { method: "GET" },
    "Team member loading",
  );
  const data = payload.data;

  if (
    !isRecord(data) ||
    !Array.isArray(data.members) ||
    !data.members.every(isTeamMemberWithUser)
  ) {
    throw new TeamApiError(
      "The server returned an unexpected team member list.",
    );
  }

  return data.members;
}
