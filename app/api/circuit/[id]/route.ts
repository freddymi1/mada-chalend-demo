import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const circuit = await prisma.circuit.findUnique({
      where: { id },
      include: {
        highlights: true,
        included: true,
        notIncluded: true,
        itineraries: true,
      },
    });

    if (!circuit) {
      return NextResponse.json({ error: "Circuit non trouvé" }, { status: 404 });
    }

    return NextResponse.json(circuit, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération du circuit" },
      { status: 500 }
    );
  }
}