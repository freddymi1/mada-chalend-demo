import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚨 ça force Next/Vercel à exécuter à chaque appel (pas de cache CDN)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const circuits = await prisma.blog.findMany({
      include: {
        articles: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculer les statistiques pour chaque circuit

    return NextResponse.json(circuits, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des blogs" },
      { status: 500 }
    );
  }
}
