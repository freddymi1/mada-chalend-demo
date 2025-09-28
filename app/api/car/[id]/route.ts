import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Récupérer le véhicule avec ses relations
    const car = await prisma.vehicle.findUnique({
      where: { id },
      include: {
          categoryRel: true,   // Inclure aussi la catégorie si nécessaire
          reservations: true,
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Car non trouvé" }, { status: 404 });
    }

    return NextResponse.json(car, { status: 200 });
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la voiture" },
      { status: 500 }
    );
  }
}