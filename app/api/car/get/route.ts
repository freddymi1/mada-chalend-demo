import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚨 ça force Next/Vercel à exécuter à chaque appel (pas de cache CDN)
export const dynamic = "force-dynamic";

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

// Get all cars
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        categoryRel: true, // Include related category
        reservations: true
      },
      orderBy: { createdAt: "desc" },
    });
    
    // Ajouter le statut de disponibilité calculé pour chaque véhicule
    const vehiclesWithAvailability = vehicles.map(vehicle => {
      const now = new Date();
      
      // Récupérer toutes les dates réservées
      const bookedDates = vehicle.reservations.map(res => ({
        startDate: res.startDate,
        endDate: res.endDate,
        reservationId: res.id,
        status: res.status
      }));
      
      // Récupérer les réservations actives (en cours)
      const activeReservations = vehicle.reservations.filter(res => {
        const startDate = new Date(res.startDate as any);
        const endDate = new Date(res.endDate as any);
        // Actif seulement si now >= startDate ET now < endDate
        return now >= startDate && now < endDate;
      });
      
      return {
        ...vehicle,
        isAvailable: isVehicleAvailable(vehicle.reservations),
        activeReservationsCount: activeReservations.length,
        bookedDates, // Tableau de toutes les dates réservées
        currentReservation: activeReservations.length > 0 ? {
          startDate: activeReservations[0].startDate,
          endDate: activeReservations[0].endDate,
          reservationId: activeReservations[0].id
        } : null
      };
    });
    
    return NextResponse.json(vehiclesWithAvailability, { status: 200 });
  } catch (error) {
    console.error("GET ERROR", error);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}