import type { NextRequest } from "next/server";
import { forwardBackendResponse } from "@/lib/api/backend-response";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const REQUEST_HEADERS_TO_SKIP = new Set([
  "accept-encoding",
  "connection",
  "content-length",
  "host",
  "next-router-state-tree",
  "next-url",
  "transfer-encoding",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-port",
  "x-forwarded-proto",
]);

async function proxyToBackend(
  request: NextRequest,
  context: RouteContext<"/api/backend/[...path]">,
) {
  const { path } = await context.params;
  const method = request.method.toUpperCase();
  const origin = request.headers.get("origin");

  if (
    path.some(
      (segment) =>
        segment === "." ||
        segment === ".." ||
        segment.includes("/") ||
        segment.includes("\\"),
    )
  ) {
    return Response.json({ message: "Invalid API path." }, { status: 400 });
  }

  if (
    origin &&
    !["GET", "HEAD", "OPTIONS"].includes(method) &&
    origin !== request.nextUrl.origin
  ) {
    return Response.json(
      { message: "Cross-origin request denied." },
      { status: 403 },
    );
  }

  const backendUrl = new URL(
    `${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`,
    `${API_BASE_URL}/`,
  );
  const headers = new Headers(request.headers);
  for (const header of REQUEST_HEADERS_TO_SKIP) {
    headers.delete(header);
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body: ["GET", "HEAD"].includes(method)
        ? undefined
        : await request.arrayBuffer(),
      cache: "no-store",
      redirect: "manual",
    });
  } catch (error) {
    console.error("Backend API proxy request failed:", error);
    return Response.json(
      { message: "The API server could not be reached." },
      { status: 502 },
    );
  }

  return forwardBackendResponse(backendResponse);
}

export const GET = proxyToBackend;
export const HEAD = proxyToBackend;
export const POST = proxyToBackend;
export const PUT = proxyToBackend;
export const PATCH = proxyToBackend;
export const DELETE = proxyToBackend;
