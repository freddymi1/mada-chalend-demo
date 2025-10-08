import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Récupérer le trip avec ses relations
    const trip = await prisma.tripTravel.findUnique({
      where: { id },
      include: {
        highlights: true,
        included: true,
        notIncluded: true,
        program: true,
        reservations: true
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "trip non trouvé" }, { status: 404 });
    }

    // Récupérer les statistiques de réservation pour ce circuit
    const reservationStats = await prisma.reservation.groupBy({
      by: ['tripTravelId'],
      where: {
        tripTravelId: id,
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
    const placesDisponibles = Math.max(0, trip.maxPeople! - totalPersonnesReservees);

    // Fusionner les données du trip avec les statistiques
    const tripWithStats = {
      ...trip,
      reservationCount,
      totalPersonnesReservees,
      placesDisponibles,
    };

    return NextResponse.json(tripWithStats, { status: 200 });
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du trip" },
      { status: 500 }
    );
  }
}