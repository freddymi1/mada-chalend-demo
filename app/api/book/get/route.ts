import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Initialisation du client Prisma
let prisma: PrismaClient;

export const dynamic = "force-dynamic";

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Construction du filtre WHERE
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { prenom: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { circuit: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Récupération des réservations avec pagination
    const [reservations, totalCount] = await Promise.all([
      prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          circuitRel: true
        }
      }),
      prisma.reservation.count({ where })
    ]);

    // Calcul du nombre total de pages
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      reservations,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur récupération réservations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}