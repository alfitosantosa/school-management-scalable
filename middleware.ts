import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Public routes yang tidak perlu authentication
const publicRoutes = ["/auth/sign-in", "/auth/sign-up", "/"];

// Route khusus untuk halaman "bukan role anda"
const alwaysAllowedAuthenticatedRoutes = ["/dashboard/middleware"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Cek apakah route adalah public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || (route !== "/" && pathname.startsWith(route)));

  // Jika route public, lanjut ke halaman berikutnya
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Route tertentu yang selalu boleh diakses oleh user yang sudah login
  if (alwaysAllowedAuthenticatedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    const sessionCookieForBypass = getSessionCookie(request);
    if (!sessionCookieForBypass) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
    return NextResponse.next();
  }

  // Check if session cookie exists
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // Fetch session data dari API endpoint
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const sessionResponse = await fetch(`${baseUrl}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!sessionResponse.ok) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const sessionData = await sessionResponse.json();

    // Jika tidak ada user dalam session, redirect ke login
    if (!sessionData?.user || !sessionData.user.id) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const userId = sessionData.user.id as string;

    // Ambil user data lengkap (termasuk role dan permissions) dari API yang kamu sebutkan
    const userDataResponse = await fetch(`${baseUrl}/api/userdata/betterauth/id/${userId}`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    if (!userDataResponse.ok) {
      console.error("Failed to fetch user data in middleware");
      return NextResponse.redirect(new URL("/dashboard/middleware", request.url));
    }

    const userData = await userDataResponse.json();

    const permissions: string[] | undefined = userData?.role?.permissions;

    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      // Tidak ada permission yang terdefinisi untuk user ini
      console.warn("User has no permissions defined, denying access");
      return NextResponse.redirect(new URL("/dashboard/middleware", request.url));
    }

    // Cek akses berdasarkan daftar permissions dari user
    const hasAccess = checkRouteAccessFromPermissions(pathname, permissions);

    if (!hasAccess) {
      console.log(`Access denied to ${pathname} for user ${userId}, redirecting to /dashboard/middleware`);
      return NextResponse.redirect(new URL("/dashboard/middleware", request.url));
    }
  } catch (error) {
    // Jika ada error saat mengecek session / user data, redirect ke login untuk keamanan
    console.error("Error checking session/user data in middleware:", error);
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

// Cek akses berdasarkan array permissions dari user data
function checkRouteAccessFromPermissions(pathname: string, permissions: string[]): boolean {
  // Kalau role.permissions sudah berisi "/", artinya dia boleh akses homepage
  // dan subpathnya akan dicek di bawah

  for (const permissionPath of permissions) {
    if (!permissionPath) continue;

    // Normalisasi: pastikan diawali dengan "/"
    const normalized = permissionPath.startsWith("/") ? permissionPath : `/${permissionPath}`;

    // Exact match
    if (pathname === normalized) {
      return true;
    }

    // Subpath match, misal permission "/dashboard/student"
    // maka "/dashboard/student/attendance" juga boleh
    if (pathname.startsWith(normalized + "/")) {
      return true;
    }
  }

  return false;
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/dashboard", "/auth/:path*"],
};
