const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
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
  data: {
    user: RegisteredUser;
  };
};

type LoginResponse = {
  success: true;
  data: {
    accessToken: string;
  };
};

export class AuthApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthApiError";
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

function isLoginResponse(payload: unknown): payload is LoginResponse {
  if (!isRecord(payload) || payload.success !== true) {
    return false;
  }

  const data = payload.data;
  return (
    isRecord(data) &&
    typeof data.accessToken === "string" &&
    data.accessToken.length > 0
  );
}

async function postAuthJson<T>(
  endpoint: string,
  request: RegisterRequest | LoginRequest,
  isExpectedResponse: (payload: unknown) => payload is T,
  operation: string,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
  } catch {
    throw new AuthApiError(
      "Could not connect to the server. Check your connection and try again.",
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new AuthApiError(
      "The server returned an unreadable response. Please try again later.",
    );
  }

  if (!response.ok) {
    throw new AuthApiError(
      getMessage(payload) ??
        `${operation} failed (HTTP ${response.status}). Please try again.`,
    );
  }

  if (!isExpectedResponse(payload)) {
    throw new AuthApiError(
      getMessage(payload) ??
        `The server returned an unexpected ${operation.toLowerCase()} response.`,
    );
  }

  return payload;
}

export async function registerUser(
  request: RegisterRequest,
): Promise<RegisteredUser> {
  const payload = await postAuthJson(
    "register",
    request,
    isRegisterResponse,
    "Registration",
  );
  return payload.data.user;
}

export async function loginUser(request: LoginRequest): Promise<string> {
  const payload = await postAuthJson(
    "login",
    request,
    isLoginResponse,
    "Login",
  );
  return payload.data.accessToken;
}
