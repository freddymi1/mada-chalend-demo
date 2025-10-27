import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Récupère les itinéraires AVANT suppression du circuit
    const category = await prisma.category.findUnique({
      where: { id },
      include: { vehicles: true },
    });

    if (!category) {
      return NextResponse.json({ error: "Category non trouvé" }, { status: 404 });
    }

    // Supprime le circuit (cascade sur les relations)
    await prisma.category.delete({ where: { id } });

   

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du Category" },
      { status: 500 }
    );
  }
}