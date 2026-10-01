import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "./utils/jwt";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const PUBLIC_ROUTES = ["/", "/properties", "/about", "/contact"];

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const cookieStore = await cookies();

  let accessToken = request.cookies.get("accessToken")?.value;
  // const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  // const decodedRefreshToken = refreshToken
  //   ? verifyToken(
  //       refreshToken,
  //       process.env.JWT_REFRESH_SECRET as string,
  //     )
  //   : null;

  // if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
  //   const result = await getNewAccessToken();
  //   if (result.success) {
  //     const newAccessToken = result.data.accessToken;
  //     cookieStore.set("accessToken", newAccessToken, {
  //       httpOnly: true,
  //       maxAge: 60 * 60 * 24,
  //       sameSite: "lax",
  //     });
  //     accessToken = newAccessToken;
  //     decodedAccessToken = verifyToken(
  //       accessToken!,
  //       process.env.JWT_ACCESS_SECRET as string,
  //     );
  //   }
  // }

  let userRole: string | null = null;

  if (!decodedAccessToken?.success) {
    cookieStore.delete("accessToken");
    accessToken = undefined;
  } else if (decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    route === "/"
      ? pathName === "/"
      : pathName === route || pathName.startsWith(route + "/")
  );

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathName === route || pathName.startsWith(route + "/")
  );

  if (accessToken && isAuthRoute) {
    if (userRole === "TENANT") {
      return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
    } else if (userRole === "LANDLORD") {
      return NextResponse.redirect(new URL("/dashboard/landlord", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathName === "/dashboard") {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (userRole === "TENANT") {
      return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
    } else if (userRole === "LANDLORD") {
      return NextResponse.redirect(new URL("/dashboard/landlord", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathName.startsWith("/dashboard/tenant") && userRole !== "TENANT") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (pathName.startsWith("/dashboard/landlord") && userRole !== "LANDLORD") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (pathName.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)",
  ],
};
