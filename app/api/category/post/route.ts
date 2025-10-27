import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      icon
    } = body;

    // Validate required fields
    if (
      !name
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newVehicle = await prisma.category.create({
      data: {
        name,
        icon:"Car"
      },
      
    });

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}