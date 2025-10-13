import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

// Initialize Prisma client properly
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// Configurer le transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("BODY", body);

    const {
      resType,
      circuit,
      vehicle,
      tripTravel,
      travelDate,
      nom,
      prenom,
      email,
      telephone,
      address,
      personnes,
      nbrChild,
      nbrAge2_3,
      nbrAge4_7,
      nbrAge8_10,
      nbrAge11,
      nbrAdult,
      startDate,
      endDate,
      duration,
      preferences,
    } = body;

    // Convertir les types si nécessaire
    const personnesNumber = parseInt(personnes, 10);
    const durationNumber = parseInt(duration, 10);

    // Initialize variables for details
    let circuitDetails = null;
    let carsDetails = null;
    let tripDetails = null;
    let travelDatesDetails = null;

    // 🔹 Validate based on reservation type
    if (resType === "circuit") {
      if (!circuit) {
        return NextResponse.json(
          { error: "Circuit ID is required for circuit reservations" },
          { status: 400 }
        );
      }

      // 🔹 Récupérer les détails du circuit
      circuitDetails = await prisma.circuit.findUnique({
        where: { id: circuit },
        select: {
          id: true,
          title: true,
          description: true,
        },
      });

      if (!circuitDetails) {
        return NextResponse.json(
          { error: "Circuit non trouvé" },
          { status: 404 }
        );
      }
    }

    if (resType === "vehicle" || vehicle) {
      if (!vehicle) {
        return NextResponse.json(
          { error: "Vehicle ID is required for vehicle reservations" },
          { status: 400 }
        );
      }

      carsDetails = await prisma.vehicle.findUnique({
        where: { id: vehicle },
        select: {
          id: true,
          name: true,
          type: true,
          passengers: true,
        },
      });

      if (!carsDetails) {
        return NextResponse.json(
          { error: "Vehicle non trouvé" },
          { status: 404 }
        );
      }
    }

    if(travelDate){
      travelDatesDetails = await prisma.travelDates.findUnique({
        where: { id: travelDate },
        select: {
          id: true,
          startDate: true,
          endDate: true,
        },
      });

      if (!travelDatesDetails) {
        return NextResponse.json(
          { error: "Travel dates not found" },
          { status: 404 }
        );
      }
    }

    if (resType === "trip") {
      if (!tripTravel) {
        return NextResponse.json(
          { error: "Trip ID is required for trip reservations" },
          { status: 400 }
        );
      }

      // 🔹 Récupérer les détails du trip
      tripDetails = await prisma.tripTravel.findUnique({
        where: { id: tripTravel },
        select: {
          id: true,
          title: true,
          description: true,
        },
      });

      if (!tripDetails) {
        return NextResponse.json(
          { error: "Trip non trouvé" },
          { status: 404 }
        );
      }

    }

    // 🔹 Prepare reservation data based on type
    const reservationData: any = {
      resType,
      nom,
      prenom,
      email,
      telephone,
      address,
      personnes: Number(personnesNumber),
      nbrChild: Number(nbrChild),
      nbrAdult: Number(nbrAdult),
      nbrAge2_3: Number(nbrAge2_3),
      nbrAge4_7: Number(nbrAge4_7),
      nbrAge8_10: Number(nbrAge8_10),
      nbrAge11: Number(nbrAge11),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      duration: durationNumber,
      preferences,
      status: "en_attente",
    };

    // Only add circuitId if it's a circuit reservation and circuit exists
    if (resType === "circuit" && circuit) {
      reservationData.circuitId = circuit;
    }

    // Only add vehicleId if it's provided and vehicle exists
    if (vehicle) {
      reservationData.vehicleId = vehicle;
    }

    // Only add tripId if it's a trip reservation and trip exists
    if (resType === "trip" && tripTravel) {
      reservationData.tripTravelId = tripTravel;
      if (travelDatesDetails) {
        reservationData.startDate = travelDatesDetails.startDate;
        reservationData.endDate = travelDatesDetails.endDate;
      }
    }

    // 🔹 Sauvegarde dans la BDD
    const reservation = await prisma.reservation.create({
      data: reservationData,
    });

    // 🔹 Formatage des dates
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // 🔹 Determine the title for email based on reservation type
    let reservationTitle = "";

    if (resType === "circuit") {
      reservationTitle = circuitDetails?.title || "";
    } else if (resType === "trip") {
      reservationTitle = tripDetails?.title || "";
    } else {
      reservationTitle = carsDetails?.name || "";
    }

    

    // 🔹 Email with elegant design
    const htmlMessage = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvelle Réservation</title>
      </head>
      <body style="
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f5f7fa;
        line-height: 1.6;
      ">
        <div style="
          max-width: 600px;
          margin: 20px auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        ">
          <!-- Header -->
          <div style="
            background: rgba(255,255,255,0.1);
            padding: 30px;
            text-align: center;
            backdrop-filter: blur(10px);
          ">
            <h1 style="
              color: white;
              margin: 0;
              font-size: 28px;
              font-weight: 600;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">✈️ Nouvelle Réservation</h1>
            <p style="
              color: rgba(255,255,255,0.9);
              margin: 10px 0 0 0;
              font-size: 16px;
            ">Une demande de réservation vient d'être reçue</p>
          </div>

          <!-- Service destacado -->
          <div style="
            background: rgba(255,255,255,0.95);
            margin: 0 20px;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            border-left: 4px solid #667eea;
          ">
            <h2 style="
              color: #2d3748;
              margin: 0 0 5px 0;
              font-size: 24px;
              font-weight: 600;
            ">${resType === "circuit" ? "🗺️" : "🚗"} ${
      reservationTitle || "Service"
    }</h2>
            <p style="
              color: #4a5568;
              margin: 5px 0 0 0;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Type: ${resType}</p>
          </div>

          <!-- Main Content -->
          <div style="
            background: white;
            margin: 20px;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          ">
            <!-- Client Info -->
            <div style="margin-bottom: 30px;">
              <h3 style="
                color: #2d3748;
                margin: 0 0 20px 0;
                font-size: 20px;
                font-weight: 600;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 10px;
              ">👤 Informations Client</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="
                    padding: 12px 0;
                    border-bottom: 1px solid #f7fafc;
                    color: #4a5568;
                    font-weight: 600;
                    width: 140px;
                  ">Nom complet:</td>
                  <td style="
                    padding: 12px 0;
                    border-bottom: 1px solid #f7fafc;
                    color: #2d3748;
                  ">${nom} ${prenom}</td>
                </tr>
                <tr>
                  <td style="
                    padding: 12px 0;
                    border-bottom: 1px solid #f7fafc;
                    color: #4a5568;
                    font-weight: 600;
                  ">Email:</td>
                  <td style="
                    padding: 12px 0;
                    border-bottom: 1px solid #f7fafc;
                    color: #2d3748;
                  ">
                    <a href="mailto:${email}" style="
                      color: #667eea;
                      text-decoration: none;
                    ">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="
                    padding: 12px 0;
                    border-bottom: 1px solid #f7fafc;
                    color: #4a5568;
                    font-weight: 600;
                  ">Téléphone:</td>
                  <td style="
                    padding: 12px 0;
                    border-bottom: 1px solid #f7fafc;
                    color: #2d3748;
                  ">
                    <a href="tel:${telephone}" style="
                      color: #667eea;
                      text-decoration: none;
                    ">${telephone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="
                    padding: 12px 0;
                    color: #4a5568;
                    font-weight: 600;
                  ">Adresse:</td>
                  <td style="
                    padding: 12px 0;
                    color: #2d3748;
                  ">${address}</td>
                </tr>
              </table>
            </div>

            <!-- Travel Details -->
            <div style="margin-bottom: 30px;">
              <h3 style="
                color: #2d3748;
                margin: 0 0 20px 0;
                font-size: 20px;
                font-weight: 600;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 10px;
              ">🎯 Détails du Voyage</h3>
              
              <div style="
                background: linear-gradient(45deg, #f7fafc, #edf2f7);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
              ">
                <div style="
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px;
                  margin-bottom: 15px;
                ">
                  <div>
                    <p style="
                      margin: 0 0 5px 0;
                      color: #4a5568;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">🗓️ Date de départ</p>
                    <p style="
                      margin: 0;
                      color: #2d3748;
                      font-size: 16px;
                      font-weight: 600;
                    ">${formatDate(startDate)}</p>
                  </div>
                  <div>
                    <p style="
                      margin: 0 0 5px 0;
                      color: #4a5568;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">🏁 Date de retour</p>
                    <p style="
                      margin: 0;
                      color: #2d3748;
                      font-size: 16px;
                      font-weight: 600;
                    ">${formatDate(endDate)}</p>
                  </div>
                </div>
                
                <div style="
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px;
                ">
                  <div>
                    <p style="
                      margin: 0 0 5px 0;
                      color: #4a5568;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">👥 Nombre de personnes</p>
                    <p style="
                      margin: 0;
                      color: #2d3748;
                      font-size: 16px;
                      font-weight: 600;
                    ">${personnes} personne${personnes > 1 ? "s" : ""}</p>
                  </div>
                  <div>
                    <p style="
                      margin: 0 0 5px 0;
                      color: #4a5568;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">👥 Nombre d'adulte</p>
                    <p style="
                      margin: 0;
                      color: #2d3748;
                      font-size: 16px;
                      font-weight: 600;
                    ">${nbrAdult} adulte${nbrAdult > 1 ? "s" : ""}</p>
                  </div>
                  
                  <div>
                    <p style="
                      margin: 0 0 5px 0;
                      color: #4a5568;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">👥 Nombre enfants</p>
                    <p style="
                      margin: 0;
                      color: #2d3748;
                      font-size: 16px;
                      font-weight: 600;
                    ">${nbrChild} enfant${nbrChild > 1 ? "s" : ""}</p>
                  </div>
                  <div>
                    <p style="
                      margin: 0 0 5px 0;
                      color: #4a5568;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">👥 2 a 3 ans</p>
                    <p style="
                      margin: 0;
                      color: #2d3748;
                      font-size: 16px;
                      font-weight: 600;
                    ">${nbrAge2_3} enfant${nbrAge2_3 > 1 ? "s" : ""}</p>
                  </div>
                  <div>
                    <p style="
                      margin: 0 0 5px 0;
                      color: #4a5568;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">👥 4 a 7 ans</p>
                    <p style="
                      margin: 0;
                      color: #2d3748;
                      font-size: 16px;
                      font-weight: 600;
                    ">${nbrAge4_7} enfant${nbrAge4_7 > 1 ? "s" : ""}</p>
                  </div>

                  <div>
                    <p style="
                      margin: 0 0 5px 0;
                      color: #4a5568;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">👥 8 a 10 ans</p>
                    <p style="
                      margin: 0;
                      color: #2d3748;
                      font-size: 16px;
                      font-weight: 600;
                    ">${nbrAge8_10} enfant${nbrAge8_10 > 1 ? "s" : ""}</p>
                  </div>

                  <div>
                    <p style="
                      margin: 0 0 5px 0;
                      color: #4a5568;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">👥 + 11ans</p>
                    <p style="
                      margin: 0;
                      color: #2d3748;
                      font-size: 16px;
                      font-weight: 600;
                    ">${nbrAge11} enfant${nbrAge11 > 1 ? "s" : ""}</p>
                  </div>

                  <div>
                    <p style="
                      margin: 0 0 5px 0;
                      color: #4a5568;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">⏱️ Durée</p>
                    <p style="
                      margin: 0;
                      color: #2d3748;
                      font-size: 16px;
                      font-weight: 600;
                    ">${duration} jour${duration > 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preferences -->
            ${
              preferences
                ? `
            <div style="margin-bottom: 30px;">
              <h3 style="
                color: #2d3748;
                margin: 0 0 15px 0;
                font-size: 20px;
                font-weight: 600;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 10px;
              ">💭 Préférences</h3>
              <div style="
                background: #fffbf0;
                border-left: 4px solid #f6ad55;
                padding: 15px;
                border-radius: 4px;
              ">
                <p style="
                  margin: 0;
                  color: #2d3748;
                  line-height: 1.6;
                ">${preferences}</p>
              </div>
            </div>
            `
                : ""
            }

            <!-- Status -->
            <div style="
              background: #f0fff4;
              border: 1px solid #68d391;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
            ">
              <p style="
                margin: 0;
                color: #22543d;
                font-weight: 600;
              ">📋 Statut: <span style="color: #38a169;">En attente de confirmation</span></p>
            </div>
          </div>

          <!-- Footer -->
          <div style="
            padding: 20px;
            text-align: center;
            background: rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.8);
          ">
            <p style="
              margin: 0 0 10px 0;
              font-size: 14px;
            ">📧 Email automatique - Merci de ne pas répondre</p>
            <p style="
              margin: 0;
              font-size: 12px;
              opacity: 0.7;
            ">Réservation ID: #${reservation.id}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 🔹 Envoi du mail à l'admin
    await transporter.sendMail({
      from: `"Nouvelle Réservation" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `🎯 Nouvelle réservation: ${reservationTitle} - ${nom} ${prenom}`,
      html: htmlMessage,
    });

    return NextResponse.json(
      { message: "Réservation créée avec succès", reservation },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur réservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la réservation" },
      { status: 500 }
    );
  }
}
