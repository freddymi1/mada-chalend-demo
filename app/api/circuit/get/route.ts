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

    // Calculer les statistiques pour chaque circuit
    const circuitsWithStats = circuits.map(circuit => {
      // Filtrer les réservations confirmées (vous pouvez ajuster selon vos besoins)
      const confirmedReservations = circuit.reservations.filter(
        reservation => reservation.status === "confirmé" // ou "confirmed" selon votre modèle
      );

      // Total des personnes dans les réservations confirmées
      const totalPersonnes = circuit?.reservations.reduce(
        (sum, reservation) => sum + reservation.personnes,
        0
      );

      // Nombre total de réservations confirmées
      const reservationCount = circuit?.reservations?.length;

      // Places disponibles
      const placesDisponibles = Math.max(0, circuit.maxPeople - totalPersonnes);

      return {
        ...circuit,
        reservationCount,
        totalPersonnesReservees: totalPersonnes,
        placesDisponibles,
        // Optionnel: inclure toutes les réservations ou seulement les confirmées
        reservations: circuit.reservations
      };
    });

    return NextResponse.json(circuitsWithStats, {
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