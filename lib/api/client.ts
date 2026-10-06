const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

let refreshRequest: Promise<boolean> | null = null;

export class ApiRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiRequestError";
  }
}

function getApiUrl(path: string) {
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

async function refreshSession(): Promise<boolean> {
  if (refreshRequest) {
    return refreshRequest;
  }

  refreshRequest = (async () => {
    try {
      const response = await fetch(getApiUrl("/auth/refresh-token"), {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        return false;
      }

      const payload: unknown = await response.json();
      return (
        typeof payload === "object" &&
        payload !== null &&
        "success" in payload &&
        payload.success === true
      );
    } catch {
      return false;
    }
  })().finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
}

function redirectToLogin() {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

export async function apiRequest(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const request = () =>
    fetch(getApiUrl(path), {
      ...init,
      credentials: "include",
    });

  let response: Response;
  try {
    response = await request();
  } catch {
    throw new ApiRequestError(
      "Could not connect to the server. Check your connection and try again.",
    );
  }

  if (response.status !== 401) {
    return response;
  }

  if (!(await refreshSession())) {
    redirectToLogin();
    throw new ApiRequestError("Your session has expired. Please log in again.");
  }

  try {
    response = await request();
  } catch {
    throw new ApiRequestError(
      "Could not connect to the server. Check your connection and try again.",
    );
  }

  if (response.status === 401) {
    redirectToLogin();
    throw new ApiRequestError("Your session has expired. Please log in again.");
  }

  return response;
}
