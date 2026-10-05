const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type RegisteredUser = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type RegisterResponse = {
  success: true;
  message: string;
  statusCode: number;
  data: {
    user: RegisteredUser;
  };
};

export class RegistrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistrationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getMessage(payload: unknown): string | undefined {
  if (!isRecord(payload)) {
    return undefined;
  }

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return undefined;
}

function isRegisterResponse(payload: unknown): payload is RegisterResponse {
  if (!isRecord(payload) || payload.success !== true) {
    return false;
  }

  const data = payload.data;
  if (!isRecord(data) || !isRecord(data.user)) {
    return false;
  }

  const user = data.user;
  return (
    typeof user.id === "string" &&
    typeof user.username === "string" &&
    typeof user.email === "string" &&
    typeof user.createdAt === "string" &&
    typeof user.updatedAt === "string"
  );
}

export async function registerUser(
  request: RegisterRequest,
): Promise<RegisteredUser> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
  } catch {
    throw new RegistrationError(
      "Could not connect to the server. Check your connection and try again.",
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new RegistrationError(
      "The server returned an unreadable response. Please try again later.",
    );
  }

  if (!response.ok) {
    throw new RegistrationError(
      getMessage(payload) ??
        `Registration failed (HTTP ${response.status}). Please try again.`,
    );
  }

  if (!isRegisterResponse(payload)) {
    throw new RegistrationError(
      getMessage(payload) ??
        "The server returned an unexpected registration response.",
    );
  }

  return payload.data.user;
}
