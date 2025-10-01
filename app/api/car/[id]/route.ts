import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fonction pour vérifier si un véhicule est disponible
function isVehicleAvailable(reservations: any[]): boolean {
  const now = new Date();
  
  // Vérifier s'il existe une réservation active
  const hasActiveReservation = reservations.some(reservation => {
    const startDate = new Date(reservation.startDate);
    const endDate = new Date(reservation.endDate);
    
    // La voiture est indisponible SEULEMENT si :
    // - La date actuelle est >= startDate
    // - ET la date actuelle est < endDate (pas encore passée)
    return now >= startDate && now < endDate;
  });
  
  return !hasActiveReservation;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Récupérer le véhicule avec ses relations
    const car = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        categoryRel: true,   // Inclure aussi la catégorie si nécessaire
        reservations: true,
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Car non trouvé" }, { status: 404 });
    }

    // Calculer la disponibilité et enrichir les données
    const now = new Date();
    
    // Récupérer toutes les dates réservées
    const bookedDates = car.reservations.map(res => ({
      startDate: res.startDate,
      endDate: res.endDate,
      reservationId: res.id,
      status: res.status,
      clientName: `${res.prenom} ${res.nom}`
    }));
    
    // Récupérer les réservations actives (en cours)
    const activeReservations = car.reservations.filter(res => {
      const startDate = new Date(res.startDate);
      const endDate = new Date(res.endDate);
      // Actif seulement si now >= startDate ET now < endDate
      return now >= startDate && now < endDate;
    });
    
    // Récupérer les réservations futures
    const futureReservations = car.reservations.filter(res => {
      const startDate = new Date(res.startDate);
      return now < startDate;
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    // Construire la réponse enrichie
    const carWithAvailability = {
      ...car,
      isAvailable: isVehicleAvailable(car.reservations),
      activeReservationsCount: activeReservations.length,
      bookedDates, // Tableau de toutes les dates réservées
      currentReservation: activeReservations.length > 0 ? {
        startDate: activeReservations[0].startDate,
        endDate: activeReservations[0].endDate,
        reservationId: activeReservations[0].id,
        clientName: `${activeReservations[0].prenom} ${activeReservations[0].nom}`,
        status: activeReservations[0].status
      } : null,
      nextReservation: futureReservations.length > 0 ? {
        startDate: futureReservations[0].startDate,
        endDate: futureReservations[0].endDate,
        reservationId: futureReservations[0].id,
        clientName: `${futureReservations[0].prenom} ${futureReservations[0].nom}`,
        status: futureReservations[0].status
      } : null
    };

    return NextResponse.json(carWithAvailability, { status: 200 });
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la voiture" },
      { status: 500 }
    );
  }
}