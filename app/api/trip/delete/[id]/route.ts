import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Récupère les itinéraires AVANT suppression du trip
    const trip = await prisma.tripTravel.findUnique({
      where: { id },
      include: { program: true },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip non trouvé" }, { status: 404 });
    }

    // Supprime le trip (cascade sur les relations)
    await prisma.tripTravel.delete({ where: { id } });

    // Supprime les images des programmes
    for (const prog of trip.program) {
      if (prog.image && prog.image.startsWith("/uploads/")) {
        const imagePath = path.join(process.cwd(), "public", prog.image);
        try {
          await fs.unlink(imagePath);
        } catch (err) {
          // Ignore si le fichier n'existe pas
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du trip" },
      { status: 500 }
    );
  }
}