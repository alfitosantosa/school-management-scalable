"use server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//filter by date
export async function GET(request: NextRequest) {
  const fromdate = request.nextUrl.searchParams.get("fromdate");
  const todate = request.nextUrl.searchParams.get("todate");

  if (!fromdate || !todate) {
    return NextResponse.json(
      { error: "Missing fromdate or todate query parameters" },
      { status: 400 }
    );
  }

  try {
    const startDate = new Date(fromdate);
    const endDate = new Date(todate);
    
    // Add 1 day to endDate to make sure we fetch data up to the end of the strict toDate
    endDate.setDate(endDate.getDate() + 1);

    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
      student: true,
        schedule: true,
      },
    });
    return NextResponse.json(attendances);
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendances" },
      { status: 500 }
    );
  }  

}