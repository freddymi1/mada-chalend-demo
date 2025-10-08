import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚨 ça force Next/Vercel à exécuter à chaque appel (pas de cache CDN)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const trips = await prisma.tripTravel.findMany({
      include: {
        highlights: true,
        included: true,
        notIncluded: true,
        program: true,
        reservations: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            personnes: true,
            startDate: true,
            endDate: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculer les statistiques pour chaque trip
    const tripsWithStats = trips.map(trip => {
      // Filtrer les réservations confirmées (vous pouvez ajuster selon vos besoins)
      const confirmedReservations = trip.reservations.filter(
        reservation => reservation.status === "confirmé" // ou "confirmed" selon votre modèle
      );

      // Total des personnes dans les réservations confirmées
      const totalPersonnes = trip?.reservations.reduce(
        (sum, reservation) => sum + reservation.personnes,
        0
      );

      // Nombre total de réservations confirmées
      const reservationCount = trip?.reservations?.length;

      // Places disponibles
      const placesDisponibles = Math.max(0, trip?.maxPeople! - totalPersonnes);

      return {
        ...trip,
        reservationCount,
        totalPersonnesReservees: totalPersonnes,
        placesDisponibles,
        // Optionnel: inclure toutes les réservations ou seulement les confirmées
        reservations: trip.reservations
      };
    });

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