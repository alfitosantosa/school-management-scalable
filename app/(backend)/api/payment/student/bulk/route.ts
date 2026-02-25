import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { classId, paymentTypeId, amount, dueDate, status, notes, paymentDate, receiptNumber } = await request.json();

    let students;

    if (classId === "all") {
      students = await prisma.userData.findMany({
        where: {
          role: {
            name: "Student",
          },
        },
      });
    } else {
      students = await prisma.userData.findMany({
        where: {
          classId: classId,
          role: {
            name: "Student",
          },
        },
      });
    }

    const newPayment = await prisma.payment.createMany({
      data: students.map((student: any) => ({
        studentId: student.id,
        paymentTypeId,
        amount: parseFloat(amount),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status,
        notes,
        paymentDate: new Date(paymentDate),
        receiptNumber,
      })),
    });

    return NextResponse.json(newPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
