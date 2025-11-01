// app/api/stats/get/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get("filterType") || "month"; // 'month' ou 'year'
    const specificMonth = searchParams.get("month"); // Format: '2025-10'
    const specificYear = searchParams.get("year"); // Format: '2025'

    // Déterminer la période de filtrage
    let dateDebut: Date;
    let dateFin: Date;

    if (filterType === "year" && specificYear) {
      // Filtre annuel
      dateDebut = new Date(`${specificYear}-01-01T00:00:00.000Z`);
      dateFin = new Date(`${specificYear}-12-31T23:59:59.999Z`);
    } else if (specificMonth) {
      // Filtre mensuel spécifique
      dateDebut = new Date(`${specificMonth}-01T00:00:00.000Z`);
      dateFin = new Date(dateDebut);
      dateFin.setMonth(dateFin.getMonth() + 1);
      dateFin.setDate(0); // Dernier jour du mois
      dateFin.setHours(23, 59, 59, 999);
    } else {
      // Mois en cours par défaut
      dateDebut = new Date();
      dateDebut.setDate(1);
      dateDebut.setHours(0, 0, 0, 0);

      dateFin = new Date(dateDebut);
      dateFin.setMonth(dateFin.getMonth() + 1);
      dateFin.setDate(0);
      dateFin.setHours(23, 59, 59, 999);
    }

    // Fonction utilitaire pour ajouter le filtre de date aux requêtes
    const withDateFilter = (where: any = {}) => ({
      ...where,
      createdAt: {
        gte: dateDebut,
        lte: dateFin,
      },
    });

    // 1. Get total circuit actif (pas de filtre de date)
    const totalCircuitsActif = await prisma.circuit.count();

    // 2. Get total vehicle actif (pas de filtre de date)
    const totalVehiclesActif = await prisma.vehicle.count({
      where: {
        status: "dispo",
      },
    });

    // 3. Get total participants avec filtre de date
    const reservationsParticipants = await prisma.reservation.aggregate({
      where: withDateFilter(),
      _sum: {
        personnes: true,
        nbrAdult: true,
        nbrChild: true,
      },
    });

    const totalParticipants = reservationsParticipants._sum.personnes || 0;

    // 4. Get total reservations avec filtre de date
    const totalReservations = await prisma.reservation.count({
      where: withDateFilter(),
    });

    // 5. Get TOUS les circuits avec réservations (avec filtre de date)
    const circuitsAvecReservations = await prisma.reservation.groupBy({
      by: ["circuitId"],
      _count: {
        id: true,
      },
      where: withDateFilter({
        circuitId: {
          not: null,
        },
      }),
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Récupérer les détails de tous les circuits avec réservations
    const circuitsPlusReserveDetails = await Promise.all(
      circuitsAvecReservations.map(async (circuitGroup) => {
        const circuitDetails = await prisma.circuit.findUnique({
          where: {
            id: circuitGroup.circuitId!,
          },
          select: {
            id: true,
            title: true,
          },
        });
        return circuitDetails
          ? {
              id: circuitDetails.id,
              title: circuitDetails.title,
              nombreReservations: circuitGroup._count.id,
            }
          : null;
      })
    ).then((results) => results.filter(Boolean));

    // 5b. Get TOUS les trips avec réservations (avec filtre de date)
    const tripsAvecReservations = await prisma.reservation.groupBy({
      by: ["tripTravelId"],
      _count: {
        id: true,
      },
      where: withDateFilter({
        tripTravelId: {
          not: null,
        },
      }),
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Récupérer les détails de tous les trips avec réservations
    const tripsPlusReserveDetails = await Promise.all(
      tripsAvecReservations.map(async (tripGroup) => {
        const tripDetails = await prisma.tripTravel.findUnique({
          where: {
            id: tripGroup.tripTravelId!,
          },
          select: {
            id: true,
            title: true,
          },
        });
        return tripDetails
          ? {
              id: tripDetails.id,
              title: tripDetails.title,
              nombreReservations: tripGroup._count.id,
            }
          : null;
      })
    ).then((results) => results.filter(Boolean));

    // 6. Get les réservations de la période
    const reservationsDeLaPeriode = await prisma.reservation.findMany({
      where: withDateFilter(),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        circuitRel: {
          select: {
            title: true,
          },
        },
        TripTravel: {
          select: {
            title: true,
          },
        },
        vehicleRel: {
          select: {
            name: true,
          },
        },
        travelDate: {
          select: {
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    // 7. Get les circuits populaires (avec filtre de date)
    const circuitsAvecReservationsPop = await prisma.circuit.findMany({
      where: {
        reservations: {
          some: withDateFilter(),
        },
      },
      include: {
        reservations: {
          where: withDateFilter(),
          select: {
            id: true,
            personnes: true,
          },
        },
      },
    });

    const circuitsAvecStats = circuitsAvecReservationsPop
      .map((circuit) => ({
        id: circuit.id,
        title: circuit.title,
        nombreReservations: circuit.reservations.length,
        nombreParticipants: circuit.reservations.reduce(
          (sum, res) => sum + res.personnes,
          0
        ),
      }))
      .sort(
        (a, b) =>
          b.nombreReservations +
          b.nombreParticipants -
          (a.nombreReservations + a.nombreParticipants)
      )
      .slice(0, 5);

    // 7b. Get les trips populaires (avec filtre de date)
    const tripsAvecReservationsPop = await prisma.tripTravel.findMany({
      where: {
        reservations: {
          some: withDateFilter(),
        },
      },
      include: {
        reservations: {
          where: withDateFilter(),
          select: {
            id: true,
            personnes: true,
          },
        },
      },
    });

    const tripsAvecStats = tripsAvecReservationsPop
      .map((trip) => ({
        id: trip.id,
        title: trip.title,
        nombreReservations: trip.reservations.length,
        nombreParticipants: trip.reservations.reduce(
          (sum, res) => sum + res.personnes,
          0
        ),
      }))
      .sort(
        (a, b) =>
          b.nombreReservations +
          b.nombreParticipants -
          (a.nombreReservations + a.nombreParticipants)
      )
      .slice(0, 5);

    // 8. Get stats mensuelles pour les 12 derniers mois (toujours afficher l'historique)
    const douzeMoisDate = new Date();
    douzeMoisDate.setMonth(douzeMoisDate.getMonth() - 12);

    const reservationsDesDouzeMois = await prisma.reservation.findMany({
      where: {
        createdAt: {
          gte: douzeMoisDate,
        },
      },
      select: {
        createdAt: true,
        personnes: true,
      },
    });

    const statsParMois = reservationsDesDouzeMois.reduce((acc, reservation) => {
      const mois = reservation.createdAt.toISOString().substring(0, 7);
      if (!acc[mois]) {
        acc[mois] = {
          reservations: 0,
          participants: 0,
        };
      }
      acc[mois].reservations += 1;
      acc[mois].participants += reservation.personnes;
      return acc;
    }, {} as { [key: string]: { reservations: number; participants: number } });

    const statsMensuellesFormatees = Object.entries(statsParMois)
      .map(([mois, stats]) => ({
        mois,
        ...stats,
      }))
      .sort((a, b) => a.mois.localeCompare(b.mois));

    // 9. Get total revenus avec filtre de date
    const reservationsAvecPrix = await prisma.reservation.findMany({
      where: withDateFilter({
        status: "confirmed",
      }),
      include: {
        circuitRel: {
          select: {
            price: true,
          },
        },
        TripTravel: {
          select: {
            price: true,
          },
        },
        travelDate: {
          select: {
            price: true,
          },
        },
      },
    });

    let totalRevenus = 0;
    reservationsAvecPrix.forEach((reservation) => {
      console.log("RESR", reservation)
      const prix = Number(reservation.total) || 0;
      totalRevenus += prix;
    });

    // 10. Get la liste des mois disponibles pour le filtre
    const moisDisponibles = await prisma.reservation.findMany({
      distinct: ["createdAt"],
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const moisUniques = [
      ...new Set(
        moisDisponibles.map((m) => m.createdAt.toISOString().substring(0, 7))
      ),
    ]
      .sort()
      .reverse();

    const anneesDisponibles = [
      ...new Set(
        moisDisponibles.map((m) => m.createdAt.getFullYear().toString())
      ),
    ]
      .sort()
      .reverse();

    // Compilation de toutes les statistiques
    const statsCompletes = {
      // Métadonnées du filtre
      filtre: {
        type: filterType,
        periode: {
          debut: dateDebut,
          fin: dateFin,
        },
        moisDisponibles: moisUniques,
        anneesDisponibles: anneesDisponibles,
      },
      // Statistiques
      totalCircuitsActif,
      totalVehiclesActif,
      totalParticipants,
      totalReservations,
      circuitsPlusReserve: circuitsPlusReserveDetails,
      tripsPlusReserve: tripsPlusReserveDetails,
      reservationsDeLaPeriode: reservationsDeLaPeriode.map((reservation) => ({
        id: reservation.id,
        nom: reservation.nom,
        prenom: reservation.prenom,
        type: reservation.resType,
        circuit: reservation.circuitRel?.title,
        trip: reservation.TripTravel?.title,
        vehicle: reservation.vehicleRel?.name,
        date: reservation.createdAt,
        personnes: reservation.personnes,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        travelDates: reservation.travelDate,
        status: reservation.status,
      })),
      circuitsPopulaires: circuitsAvecStats,
      tripsPopulaires: tripsAvecStats,
      statsMensuelles: statsMensuellesFormatees,
      totalRevenus,
      detailParticipants: {
        total: totalParticipants,
        adultes: reservationsParticipants._sum.nbrAdult || 0,
        enfants: reservationsParticipants._sum.nbrChild || 0,
      },
    };

    return NextResponse.json(statsCompletes);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      {
        message: "Erreur interne du serveur",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
