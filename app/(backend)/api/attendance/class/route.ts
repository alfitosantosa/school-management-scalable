import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!classId || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required parameters: classId, startDate, endDate" }, { status: 400 });
    }

    // Get students in class
    const classStudents = await prisma.userData.findMany({
      where: {
        classId: classId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        classId: true,
        avatarUrl: true,
      },
    });

    // Get attendance records for students in this class and date range
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId: {
          in: classStudents.map((s: any) => s.id),
        },
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        id: true,
        studentId: true,
        date: true,
        status: true,
        notes: true,
        createdAt: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Get class info
    const classInfo = await prisma.class.findUnique({
      where: {
        id: classId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        class: classInfo,
        students: classStudents,
        attendance: attendanceRecords,
      },
    });
  } catch (error) {
    console.error("Error fetching attendance by class:", error);
    return NextResponse.json({ error: "Failed to fetch attendance data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
