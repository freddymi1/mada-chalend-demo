import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚨 ça force Next/Vercel à exécuter à chaque appel (pas de cache CDN)
export const dynamic = "force-dynamic";

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

    return NextResponse.json(circuits, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching circuits:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des circuits" },
      { status: 500 }
    );
  }
}
