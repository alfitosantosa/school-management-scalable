import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing attendance ID" }, { status: 400 });
    }

    // Check if attendance exists
    const existingAttendance = await prisma.teacherAttendance.findUnique({
      where: { id },
    });

    if (!existingAttendance) {
      return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });
    }

    // Delete the attendance record
    const deletedAttendance = await prisma.teacherAttendance.delete({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            employeeId: true,
            avatarUrl: true,
            position: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Attendance record deleted successfully",
      data: deletedAttendance,
    });
  } catch (error) {
    console.error("Error deleting teacher attendance:", error);
    return NextResponse.json({ error: "Failed to delete attendance record" }, { status: 500 });
  }
}
