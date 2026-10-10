import { errors, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const guestRoutes = ["/login", "/register"];
const publicRoutes = ["/payments/result"];

async function verifyAccessToken(token: string) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not configured");
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch (error) {
    if (error instanceof errors.JOSEError) {
      return false;
    }
    throw error;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicRoutes.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;
  const isGuestRoute = guestRoutes.some((r) => pathname.startsWith(r));
  const isTokenValid = token ? await verifyAccessToken(token) : false;

  if (isGuestRoute) {
    if (isTokenValid) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const response = NextResponse.next();
    if (token) {
      response.cookies.delete("accessToken");
    }
    return response;
  }

  if (!isTokenValid) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    if (token) {
      response.cookies.delete("accessToken");
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};
