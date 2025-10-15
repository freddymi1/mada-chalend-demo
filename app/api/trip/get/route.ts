import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚨 force exécution à chaque appel (pas de cache CDN sur Vercel)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const trips = await prisma.tripTravel.findMany({
      include: {
        highlights: true,
        included: true,
        notIncluded: true,
        program: true,
        travelDates: true,
        reservations: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            personnes: true,
            startDate: true,
            endDate: true,
            status: true,
            travelDateId: true, // ✅ nécessaire pour relier à TravelDates
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 1️⃣ Calculer les statistiques pour chaque trip
    const tripsWithStats = trips.map((trip) => {
      // --- Créer une map des réservations par date ---
      const statsByDate: Record<
        string,
        { totalPersonnesReservees: number; reservationCount: number }
      > = {};

      for (const res of trip.reservations) {
        if (!res.travelDateId) continue;
        if (!statsByDate[res.travelDateId]) {
          statsByDate[res.travelDateId] = {
            totalPersonnesReservees: 0,
            reservationCount: 0,
          };
        }
        statsByDate[res.travelDateId].totalPersonnesReservees += res.personnes;
        statsByDate[res.travelDateId].reservationCount += 1;
      }

      // --- Calculer les places disponibles pour chaque date ---
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

      // --- Totaux globaux du trip ---
      const totalPersonnesReservees = travelDatesWithStats.reduce(
        (sum, d) => sum + d.totalPersonnesReservees,
        0
      );

      const reservationCount = travelDatesWithStats.reduce(
        (sum, d) => sum + d.reservationCount,
        0
      );

      const placesDisponiblesGlobal = travelDatesWithStats.reduce(
        (sum, d) => sum + d.placesDisponibles,
        0
      );

      return {
        ...trip,
        travelDates: travelDatesWithStats,
        reservationCount,
        totalPersonnesReservees,
        placesDisponibles: placesDisponiblesGlobal,
        isDispo: placesDisponiblesGlobal > 0,
      };
    });

    // --- Réponse ---
    return NextResponse.json(tripsWithStats, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des trips" },
      { status: 500 }
    );
  }
}
