import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Récupérer le circuit avec ses relations
    const circuit = await prisma.circuit.findUnique({
      where: { id },
      include: {
        highlights: true,
        included: true,
        notIncluded: true,
        itineraries: true,
        reservations: true
      },
    });

    if (!circuit) {
      return NextResponse.json({ error: "Circuit non trouvé" }, { status: 404 });
    }

    // Récupérer les statistiques de réservation pour ce circuit
    const reservationStats = await prisma.reservation.groupBy({
      by: ['circuitId'],
      where: {
        circuitId: id,
        // status: "confirmé"
      },
      _sum: {
        personnes: true
      },
      _count: {
        id: true
      }
    });

    const stats = reservationStats[0] || {
      _sum: { personnes: 0 },
      _count: { id: 0 }
    };

    const totalPersonnesReservees = stats._sum.personnes || 0;
    const reservationCount = stats._count.id || 0;
    const placesDisponibles = Math.max(0, circuit.maxPeople! - totalPersonnesReservees);

    // Fusionner les données du circuit avec les statistiques
    const circuitWithStats = {
      ...circuit,
      reservationCount,
      totalPersonnesReservees,
      placesDisponibles,
    };

    return NextResponse.json(circuitWithStats, { status: 200 });
  } catch (error) {
    console.error("Error fetching circuit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du circuit" },
      { status: 500 }
    );
  }
}