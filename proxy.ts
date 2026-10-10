import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "./utils/jwt";
import { getNewAccessToken } from "./services/getNewAccessToken";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const PUBLIC_ROUTES = ["/", "/properties", "/about", "/contact"];

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  let newAccessToken: string | undefined;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success && refreshToken) {
    try {
      const result = await getNewAccessToken(refreshToken);
      if (result?.success && result?.data?.accessToken) {
        newAccessToken = result.data.accessToken as string;
        accessToken = newAccessToken;
        decodedAccessToken = verifyToken(
          newAccessToken,
          process.env.JWT_ACCESS_SECRET as string,
        );
      }
    } catch {}
  }

  const userRole = decodedAccessToken?.data
    ? (decodedAccessToken.data as JwtPayload).role
    : null;

  const roleDashboard = userRole
    ? `/dashboard/${userRole.toLowerCase()}`
    : "/auth/login";

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    route === "/"
      ? pathName === "/"
      : pathName === route || pathName.startsWith(route + "/")
  );

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathName === route || pathName.startsWith(route + "/")
  );

  let response: NextResponse;

  if (accessToken && isAuthRoute) {
    response = NextResponse.redirect(new URL(roleDashboard, request.url));
  } else if (pathName === "/dashboard" || pathName === "/dashboard/") {
    response = NextResponse.redirect(
      new URL(accessToken && userRole ? roleDashboard : "/auth/login", request.url)
    );
  } else if (!accessToken && !isPublicRoute && !isAuthRoute) {
    response = NextResponse.redirect(new URL("/auth/login", request.url));
  } else if (
    accessToken &&
    userRole &&
    pathName.startsWith("/dashboard/") &&
    !pathName.startsWith(roleDashboard)
  ) {
    response = NextResponse.redirect(new URL(roleDashboard, request.url));
  } else {
    if (newAccessToken) {
      request.cookies.set("accessToken", newAccessToken);
      response = NextResponse.next({
        request: {
          headers: new Headers(request.headers),
        },
      });
    } else {
      response = NextResponse.next();
    }
  }

  if (newAccessToken) {
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      // secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  if (!decodedAccessToken?.success && !decodedRefreshToken?.success) {
    if (request.cookies.has("accessToken")) {
      response.cookies.delete("accessToken");
    }
    if (request.cookies.has("refreshToken")) {
      response.cookies.delete("refreshToken");
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)",
  ],
};
