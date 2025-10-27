import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚨 Force le rendu dynamique (pas de cache CDN)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const circuits = await prisma.circuit.findMany({
      include: {
        highlights: true,
        included: true,
        notIncluded: true,
        itineraries: {
          select:{
            id: true,
            day: true,
            title: true,
            description: true,
            image: true,
            imageDescription: true,
            distance: true,
            itineraryDistanceRel: true
          }
        },
        reservations: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            personnes: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 🔄 Calculer les statistiques + image principale
    const circuitsWithStats = circuits.map((circuit) => {
      const confirmedReservations = circuit.reservations.filter(
        (reservation) => reservation.status === "confirmé"
      );

      const totalPersonnes = confirmedReservations.reduce(
        (sum, reservation) => sum + reservation.personnes,
        0
      );

      const reservationCount = confirmedReservations.length;

      const placesDisponibles = Math.max(
        0,
        (circuit.maxPeople ?? 0) - totalPersonnes
      );

      // 🖼️ Image principale = première image non vide trouvée dans les itinéraires
      const mainImage =
        circuit.itineraries.find(
          (it) => it.image && it.image.trim() !== ""
        )?.image || null;

      return {
        ...circuit,
        reservationCount,
        totalPersonnesReservees: totalPersonnes,
        placesDisponibles,
        mainImage, // ✅ ajout ici
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
