import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const circuits = await prisma.circuit.findMany({
      include: {
        highlights: true,
        included: true,
        notIncluded: true,
        itineraries: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(circuits, { status: 200 });
  } catch (error) {
    console.error("Error fetching circuits:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des circuits" },
      { status: 500 }
    );
  }
}