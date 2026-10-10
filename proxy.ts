import { errors, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_NAME = "accessToken";
const GUEST_ROUTES = ["/login", "/register"] as const;
const PUBLIC_ROUTES = ["/payments/result"] as const;

// Validate and encode the secret once, at module load.
const rawSecret = process.env.ACCESS_TOKEN_SECRET;
if (!rawSecret) {
  throw new Error("ACCESS_TOKEN_SECRET is not configured");
}
const SECRET = new TextEncoder().encode(rawSecret);

async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch (error) {
    // Unexpected (non-JOSE) errors: log and fail closed instead of 500ing.
    if (!(error instanceof errors.JOSEError)) {
      console.error("Unexpected error verifying access token:", error);
    }
    return false;
  }
}

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (PUBLIC_ROUTES.some((route) => matchesRoute(pathname, route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isGuestRoute = GUEST_ROUTES.some((route) =>
    matchesRoute(pathname, route),
  );
  const authenticated = await isValidToken(token);

  if (isGuestRoute) {
    if (authenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const response = NextResponse.next();
    if (token) response.cookies.delete(COOKIE_NAME); // clear stale/invalid token
    return response;
  }

  if (pathname === "/home") {
    return authenticated
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  if (!authenticated) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    const loginUrl = new URL("/login", request.url);

    // Preserve the intended destination. The login page must validate that
    // `next` is a relative path (starts with "/" and not "//") to avoid
    // open redirects.
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", `${pathname}${search}`);
    }

    const response = NextResponse.redirect(loginUrl);
    if (token) response.cookies.delete(COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/login",
    "/register",
    "/organizations/:path*",
    "/teams/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/payments/:path*",
  ],
};
