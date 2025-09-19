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

    // Récupère les itinéraires AVANT suppression du circuit
    const circuit = await prisma.circuit.findUnique({
      where: { id },
      include: { itineraries: true },
    });

    if (!circuit) {
      return NextResponse.json({ error: "Circuit non trouvé" }, { status: 404 });
    }

    // Supprime le circuit (cascade sur les relations)
    await prisma.circuit.delete({ where: { id } });

    // Supprime les images des itinéraires
    for (const it of circuit.itineraries) {
      if (it.image && it.image.startsWith("/uploads/")) {
        const imagePath = path.join(process.cwd(), "public", it.image);
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
      { error: "Erreur lors de la suppression du circuit" },
      { status: 500 }
    );
  }
}