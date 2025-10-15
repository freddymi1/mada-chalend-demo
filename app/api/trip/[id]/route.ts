import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1️⃣ Récupérer le trip avec ses relations
    const trip = await prisma.tripTravel.findUnique({
      where: { id },
      include: {
        highlights: true,
        included: true,
        notIncluded: true,
        program: true,
        reservations: true,
        travelDates: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip non trouvé" }, { status: 404 });
    }

    // 2️⃣ Récupérer les statistiques de réservation par date de voyage
    const reservationStats = await prisma.reservation.groupBy({
      by: ["travelDateId"],
      where: { tripTravelId: id },
      _sum: { personnes: true },
      _count: { id: true },
    });

    // 3️⃣ Construire une map des réservations par date
    const statsByDate: Record<
      string,
      { totalPersonnesReservees: number; reservationCount: number }
    > = {};

    for (const stat of reservationStats) {
      if (stat.travelDateId !== null) {
        statsByDate[stat.travelDateId] = {
          totalPersonnesReservees: stat._sum.personnes || 0,
          reservationCount: stat._count.id || 0,
        };
      }
    }

    // 4️⃣ Fusionner les stats dans chaque travelDate
    const travelDatesWithStats = trip.travelDates.map((date) => {
      const stats = statsByDate[date.id] || {
        totalPersonnesReservees: 0,
        reservationCount: 0,
      };

      const placesDisponibles = Math.max(
        0,
        (date.maxPeople ?? 0) - stats.totalPersonnesReservees
      );

      return {
        ...date,
        ...stats,
        placesDisponibles,
      };
    });

    // 5️⃣ Calculer les totaux globaux
    const totalPersonnesReservees = travelDatesWithStats.reduce(
      (sum, d) => sum + d.totalPersonnesReservees,
      0
    );
    const reservationCount = travelDatesWithStats.reduce(
      (sum, d) => sum + d.reservationCount,
      0
    );

    // 6️⃣ Fusionner le tout dans la réponse finale
    const tripWithStats = {
      ...trip,
      travelDates: travelDatesWithStats,
      totalPersonnesReservees,
      reservationCount,
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
