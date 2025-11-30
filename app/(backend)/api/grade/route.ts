// model Grade {
//   id          String   @id @default(cuid())
//   studentId   String
//   scheduleId  String
//   subjectId   String
//   gradeType   String
//   score       Decimal
//   maxScore    Decimal  @default(100)
//   weight      Int      @default(1)
//   description String?
//   date        DateTime
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt
//   createdBy   String
//   schedule    Schedule @relation(fields: [scheduleId], references: [id])
//   student     UserData @relation("StudentGrade", fields: [studentId], references: [id], onDelete: Cascade)
//   subject     Subject  @relation(fields: [subjectId], references: [id])

//   @@index([studentId])
//   @@index([scheduleId])
//   @@index([subjectId])
//   @@map("grades")
// }

"use server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        student: true,
        schedule: true,
        subject: true,
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, scheduleId, subjectId, gradeType, score, maxScore, weight, description, date, createdBy } = await request.json();
    if (!studentId || !scheduleId || !subjectId || !gradeType || score === undefined || !date || !createdBy) {
      return NextResponse.json({ error: "studentId, scheduleId, subjectId, gradeType, score, date, and createdBy are required" }, { status: 400 });
    }

    const newGrade = await prisma.grade.create({
      data: {
        studentId,
        scheduleId,
        subjectId,
        gradeType,
        score,
        maxScore: maxScore || 100, // Default maxScore if not provided
        weight: weight || 1, // Default weight if not provided
        description,
        date: new Date(date),
        createdBy,
      },
    });
    return NextResponse.json(newGrade, { status: 201 });
  } catch (error) {
    console.error("Error creating grade:", error);
    return NextResponse.json({ error: "Failed to create grade" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, score, maxScore, weight, description, date } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Grade ID is required" }, { status: 400 });
    }

    const updatedGrade = await prisma.grade.update({
      where: { id },
      data: {
        score,
        maxScore,
        weight,
        description,
        date: date ? new Date(date) : undefined,
      },
    });
    return NextResponse.json(updatedGrade);
  } catch (error) {
    console.error("Error updating grade:", error);
    return NextResponse.json({ error: "Failed to update grade" }, { status: 500 });
  }
}

   
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Grade ID is required" }, { status: 400 });
    }

    await prisma.grade.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Grade deleted successfully" });
  } catch (error) {
    console.error("Error deleting grade:", error);
    return NextResponse.json({ error: "Failed to delete grade" }, { status: 500 });
  }
}

  