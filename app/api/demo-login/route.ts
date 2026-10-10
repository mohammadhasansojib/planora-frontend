import { forwardBackendResponse } from "@/lib/api/backend-response";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

export async function POST(request: Request) {
  const email = process.env.DEMO_LOGIN_EMAIL;
  const password = process.env.DEMO_LOGIN_PASSWORD;

  if (!email || !password) {
    return Response.json(
      { message: "Demo login is not configured." },
      { status: 404 },
    );
  }

  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json(
      { message: "Cross-origin request denied." },
      { status: 403 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      redirect: "manual",
    });
  } catch (error) {
    console.error("Demo login request failed:", error);
    return Response.json(
      { message: "The API server could not be reached." },
      { status: 502 },
    );
  }

  return forwardBackendResponse(backendResponse);
}
