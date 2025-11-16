import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

// { id: "/", label: "Home" },
// { id: "/dashboard", label: "Dashboard Management" },
// { id: "/dashboard/profile", label: "Profile" },
// { id: "/dashboard/roles", label: "Roles Management" },
// { id: "/dashboard/betterauth", label: "BetterAuth Management" },
// { id: "/dashboard/users", label: "Users Management" },
// { id: "/dashboard/academicyear", label: "Academic Year Management" },
// { id: "/dashboard/majors", label: "Major Management" },
// { id: "/dashboard/classes", label: "Class Management" },
// { id: "/dashboard/subjects", label: "Subject Management" },
// { id: "/dashboard/schedules", label: "Schedule Management" },
// { id: "/dashboard/attendance", label: "Attendance Management" },
// { id: "/dashboard/typeviolations", label: "Type Violation Management" },
// { id: "/dashboard/violations", label: "Violation Management" },
// { id: "/dashboard/violations/teacher", label: "Violation for Teacher" },
// { id: "/dashboard/violations/student", label: "Violation for Student" },
// { id: "/dashboard/payments", label: "Payment for Student" },
// { id: "/dashboard/specialschedule", label: "Special Schedule" },
// { id: "/dashboard/calender", label: "Calendar for User" },
// { id: "/dashboard/calender/teacher", label: "Calendar for Teacher" },
// { id: "/dashboard/calender/student", label: "Calendar for Student" },
// { id: "/dashboard/teacher/schedule", label: "Schedule for Teacher" },
// { id: "/dashboard/student/attendance", label: "Attendance for Student" },
// { id: "/dashboard/student/schedule", label: "Schedule for Student" },
// { id: "/dashboard/parent", label: "Dashboard Parent" },

export const config = {
  matcher: [
    "/",
    "/testauth",
    "/dashboard",
    "/dashboard/roles",
    "/dashboard/profile",
    "/dashboard/users",
    "/dashboard/academicyear",
    "/dashboard/majors",
    "/dashboard/classes",
    "/dashboard/subjects",
    "/dashboard/schedules",
    "/dashboard/attendance",
    "/dashboard/typeviolations",
    "/dashboard/violations",
    "/dashboard/violations/teacher",
    "/dashboard/violations/student",
    "/dashboard/payments",
    "/dashboard/specialschedule",
    "/dashboard/calender",
    "/dashboard/teacher/schedule",
    "/dashboard/student/attendance",
    "/dashboard/student/schedule",
    "/dashboard/parent",
    "/dashboard/calender/teacher",
    "/dashboard/calender/student",
    "/dashboard/betterauth",
  ], // Specify the routes the middleware applies to
};
