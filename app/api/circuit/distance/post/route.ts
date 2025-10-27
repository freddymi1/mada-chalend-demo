import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("BODY", body);

    let itineraryId: string;
    let distances: any[] = [];

    // Vérifier le format des données
    if (body.itineraryId && body.departPoint && body.arrivalPoint) {
      // Format: { itineraryId, departPoint, arrivalPoint, distance }
      itineraryId = body.itineraryId;
      distances = [{
        departPoint: body.departPoint,
        arrivalPoint: body.arrivalPoint,
        distance: body.distance
      }];
    } else if (body.itineraryId && body.distances && Array.isArray(body.distances)) {
      // Format: { itineraryId, distances: [...] }
      itineraryId = body.itineraryId;
      distances = body.distances;
    } else {
      return NextResponse.json(
        { error: "Format de données invalide" },
        { status: 400 }
      );
    }

    console.log("DISTANCES", distances);

    // Validation des données
    if (!itineraryId) {
      return NextResponse.json(
        { error: "L'ID de l'itinéraire est requis" },
        { status: 400 }
      );
    }

    if (distances.length === 0) {
      return NextResponse.json(
        { error: "Aucune distance à sauvegarder" },
        { status: 400 }
      );
    }

    // Vérifier que l'itinéraire existe
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
    });

    if (!itinerary) {
      return NextResponse.json(
        { error: "Itinéraire non trouvé" },
        { status: 404 }
      );
    }

    // Supprimer les distances existantes pour cet itinéraire
    await prisma.itineraryDistance.deleteMany({
      where: { itineraryId },
    });

    // Créer les nouvelles distances
    const createdDistances = await prisma.$transaction(
      distances.map((distance) =>
        prisma.itineraryDistance.create({
          data: {
            departPoint: distance.departPoint,
            arrivalPoint: distance.arrivalPoint,
            distance: parseInt(distance.distance) || 0,
            itineraryId: itineraryId,
          },
        })
      )
    );

    return NextResponse.json({
      message: "Distances sauvegardées avec succès",
      data: createdDistances,
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des distances:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}