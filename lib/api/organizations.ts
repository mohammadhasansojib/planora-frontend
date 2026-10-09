import { apiRequest } from "@/lib/api/client";

export type Organization = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationMember = {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationMemberWithUser = OrganizationMember & {
  user: {
    username: string;
    email: string;
  };
};

export class OrganizationApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrganizationApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOrganization(value: unknown): value is Organization {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isOrganizationMember(value: unknown): value is OrganizationMember {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.organizationId === "string" &&
    typeof value.userId === "string" &&
    typeof value.role === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isOrganizationMemberWithUser(
  value: unknown,
): value is OrganizationMemberWithUser {
  if (!isRecord(value) || !isRecord(value.user)) {
    return false;
  }

  const user = value.user;
  return (
    isOrganizationMember(value) &&
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
  const response = await apiRequest(path, init);

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new OrganizationApiError(
      `The server returned an unreadable ${operation.toLowerCase()} response.`,
    );
  }

  if (!response.ok) {
    throw new OrganizationApiError(
      getMessage(payload) ??
        `${operation} failed (HTTP ${response.status}). Please try again.`,
    );
  }

  if (!isRecord(payload) || payload.success !== true) {
    throw new OrganizationApiError(
      getMessage(payload) ??
        `The server returned an unexpected ${operation.toLowerCase()} response.`,
    );
  }

  return payload;
}

export async function getOrganizations(): Promise<Organization[]> {
  const payload = await requestPayload(
    "/organizations",
    { method: "GET" },
    "Organization loading",
  );
  const data = payload.data;

  if (
    !isRecord(data) ||
    !Array.isArray(data.organizations) ||
    !data.organizations.every(isOrganization)
  ) {
    throw new OrganizationApiError(
      "The server returned an unexpected organization list.",
    );
  }

  return data.organizations;
}

export async function createOrganization(name: string): Promise<Organization> {
  const payload = await requestPayload(
    "/organizations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    },
    "Organization creation",
  );
  const data = payload.data;

  if (!isRecord(data) || !isOrganization(data.organization)) {
    throw new OrganizationApiError(
      "The server returned an unexpected organization creation response.",
    );
  }

  return data.organization;
}

export async function addOrganizationMember(
  organizationId: string,
  email: string,
): Promise<OrganizationMember> {
  const payload = await requestPayload(
    `/organizations/${encodeURIComponent(organizationId)}/members`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
    "Adding organization member",
  );
  const data = payload.data;

  if (!isRecord(data) || !isOrganizationMember(data.member)) {
    throw new OrganizationApiError(
      "The server returned an unexpected member creation response.",
    );
  }

  return data.member;
}

export async function getOrganizationMembers(
  organizationId: string,
): Promise<OrganizationMemberWithUser[]> {
  const payload = await requestPayload(
    `/organizations/${encodeURIComponent(organizationId)}/members`,
    { method: "GET" },
    "Organization member loading",
  );
  const data = payload.data;

  if (
    !isRecord(data) ||
    !Array.isArray(data.members) ||
    !data.members.every(isOrganizationMemberWithUser)
  ) {
    throw new OrganizationApiError(
      "The server returned an unexpected organization member list.",
    );
  }

  return data.members;
}
