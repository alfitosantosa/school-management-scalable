import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();
    if (!ids) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedUser = await prisma.userData.deleteMany({
      where: {
        id: {
          in: ids, // array
        },
      },
    });
    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
