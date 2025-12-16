import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Define role-based route protection
const roleBasedRoutes = {
  // Admin: Akses ke SEMUA route
  admin: [
    "/dashboard",
    "/dashboard/betterauth",
    "/dashboard/profile",
    "/dashboard/roles",
    "/dashboard/users",
    "/dashboard/academicyear",
    "/dashboard/majors",
    "/dashboard/classes",
    "/dashboard/subjects",
    "/dashboard/schedules",
    "/dashboard/attendance",
    "/dashboard/typeviolations",
    "/dashboard/violations",
    "/dashboard/payments",
    "/dashboard/specialschedule",
    "/dashboard/calendar",
    "/dashboard/calendar/teacher",
    "/dashboard/calendar/student",
    "/dashboard/violations/student",
    "/dashboard/violations/teacher",
    "/dashboard/teacher/schedule",
    "/dashboard/student/attendance",
    "/dashboard/student/schedule",
    "/dashboard/parent",
    "/dashboard/upload/users",
    "/dashboard/botwa",
    "/dashboard/attendance/teacher",
    "/dashboard/admin/attendance",
    "/dashboard/admin",
    "/dashboard/teacher",
    "/dashboard/student",
  ],

  // Teacher: Akses ke route khusus guru
  teacher: ["/dashboard", "/dashboard/profile", "/dashboard/calendar/teacher", "/dashboard/violations/teacher", "/dashboard/teacher/schedule", "/dashboard/attendance/teacher", "/dashboard/specialschedule", "/dashboard/teacher"],

  // Student: Akses ke route khusus siswa
  student: [
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/calendar/student",
    "/dashboard/violations/student",
    "/dashboard/student/attendance",
    "/dashboard/student/schedule",
    "/dashboard/payments",
    "/dashboard/botwa",
    "/dashboard/student",
  ],

  // Parent: Akses ke route khusus orang tua
  parent: [
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/calendar/student",
    "/dashboard/violations/student",
    "/dashboard/student/attendance",
    "/dashboard/student/schedule",
    "/dashboard/payments",
    "/dashboard/parent",
    "/dashboard/student",
  ],

  // User (default): Akses minimal
  user: ["/dashboard", "/dashboard/profile"],
};

// Public routes yang tidak perlu authentication
const publicRoutes = ["/auth/sign-in", "/auth/sign-up", "/"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Cek apakah route adalah public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || (route !== "/" && pathname.startsWith(route)));

  // Jika route public, lanjut ke halaman berikutnya
  if (isPublicRoute) {
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
    if (!sessionData?.user) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const userRole = sessionData.user.role;

    // Check if user has access to the requested route
    const hasAccess = checkRouteAccess(pathname, userRole);

    if (!hasAccess) {
      // Redirect ke halaman yang sesuai dengan role
      console.log(`Access denied for ${userRole} to ${pathname}. Redirecting to ${getDefaultRouteForRole(userRole)}`);
      return NextResponse.redirect(new URL(getDefaultRouteForRole(userRole), request.url));
    }
  } catch (error) {
    // Jika ada error saat mengecek session, redirect ke login untuk keamanan
    console.error("Error checking session in middleware:", error);
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

// Function untuk cek apakah user memiliki akses ke route
function checkRouteAccess(pathname: string, role: string): boolean {
  // Admin memiliki akses ke semua route
  if (role === "admin") {
    return true;
  }

  // Cek route berdasarkan role
  const allowedRoutes = roleBasedRoutes[role as keyof typeof roleBasedRoutes];

  if (!allowedRoutes) {
    return false;
  }

  // Check if pathname matches any of the allowed routes
  // Hanya match exact path atau subpath dengan "/" separator
  for (const route of allowedRoutes) {
    if (pathname === route) {
      // Exact match
      return true;
    }
    if (pathname.startsWith(route + "/")) {
      // Subpath match (dengan / separator)
      return true;
    }
  }

  return false;
}

// Function untuk mendapatkan default route berdasarkan role
function getDefaultRouteForRole(role: string): string {
  const defaultRoutes: { [key: string]: string } = {
    admin: "/dashboard/admin",
    teacher: "/dashboard/teacher",
    student: "/dashboard/student",
    parent: "/dashboard/parent",
    user: "/dashboard",
  };

  return defaultRoutes[role] || "/dashboard";
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/dashboard", "/auth/:path*"],
};
