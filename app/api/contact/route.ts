// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Email template generator (inchangé)
function generateEmailHTML(type: string, data: any): string {
  const baseStyles = `
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
      .info-row { display: flex; margin: 15px 0; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #667eea; }
      .info-label { font-weight: 600; color: #667eea; min-width: 140px; }
      .info-value { color: #4b5563; flex: 1; }
      .message-box { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #e5e7eb; }
      .message-label { font-weight: 600; color: #667eea; margin-bottom: 10px; }
      .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
      .badge-circuit { background: #dbeafe; color: #1e40af; }
      .badge-partner { background: #dcfce7; color: #166534; }
      .badge-other { background: #fef3c7; color: #92400e; }
    </style>
  `;

  let badgeClass = 'badge-other';
  let typeLabel = 'Autre';
  
  if (type === 'circuit') {
    badgeClass = 'badge-circuit';
    typeLabel = 'Demande de Circuit';
  } else if (type === 'partenariat') {
    badgeClass = 'badge-partner';
    typeLabel = 'Demande de Partenariat';
  }

  let contentHTML = '';

  if (type === 'circuit') {
    contentHTML = `
      <div class="info-row">
        <span class="info-label">Nom complet:</span>
        <span class="info-value">${data.nom} ${data.prenom}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value"><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></span>
      </div>
      <div class="info-row">
        <span class="info-label">Téléphone:</span>
        <span class="info-value">${data.telephone}</span>
      </div>
      ${data.adresse ? `
      <div class="info-row">
        <span class="info-label">Adresse:</span>
        <span class="info-value">${data.adresse}</span>
      </div>` : ''}
      <div class="info-row">
        <span class="info-label">Nombre de personnes:</span>
        <span class="info-value">${data.nbPersonnes} Personnes</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date de départ:</span>
        <span class="info-value">${new Date(data.dateDepart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
      ${data.duree ? `
      <div class="info-row">
        <span class="info-label">Durée:</span>
        <span class="info-value">${data.duree} Jours</span>
      </div>` : ''}
      ${data.budget ? `
      <div class="info-row">
        <span class="info-label">Budget:</span>
        <span class="info-value">${data.budget} Euro</span>
      </div>` : ''}
      ${data.circuitTitle ? `
      <div class="info-row">
        <span class="info-label">Circuit demandé:</span>
        <span class="info-value"><strong>${data.circuitTitle}</strong></span>
      </div>` : ''}
      ${data.otherCircuit && data.otherCircuit !== 'other' ? `
      <div class="info-row">
        <span class="info-label">Autre circuit:</span>
        <span class="info-value"><strong>${data.otherCircuit}</strong></span>
      </div>` : ''}
      ${data.message ? `
      <div class="message-box">
        <div class="message-label">Message:</div>
        <div style="color: #4b5563; white-space: pre-wrap;">${data.message}</div>
      </div>` : ''}
    `;
  } else if (type === 'partenariat') {
    contentHTML = `
      <div class="info-row">
        <span class="info-label">Nom complet:</span>
        <span class="info-value">${data.nom} ${data.prenom}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value"><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></span>
      </div>
      <div class="info-row">
        <span class="info-label">Téléphone:</span>
        <span class="info-value">${data.telephone}</span>
      </div>
      ${data.nomEntreprise ? `
      <div class="info-row">
        <span class="info-label">Entreprise:</span>
        <span class="info-value"><strong>${data.nomEntreprise}</strong></span>
      </div>` : ''}
      ${data.objet ? `
      <div class="info-row">
        <span class="info-label">Objet:</span>
        <span class="info-value">${data.objet}</span>
      </div>` : ''}
      ${data.typePartenariat ? `
      <div class="info-row">
        <span class="info-label">Type de partenariat:</span>
        <span class="info-value"><span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500;">${data.typePartenariat.charAt(0).toUpperCase() + data.typePartenariat.slice(1)}</span></span>
      </div>` : ''}
      ${data.description ? `
      <div class="info-row">
        <span class="info-label">Description:</span>
        <span class="info-value">${data.description}</span>
      </div>` : ''}
      ${data.message ? `
      <div class="message-box">
        <div class="message-label">Message:</div>
        <div style="color: #4b5563; white-space: pre-wrap;">${data.message}</div>
      </div>` : ''}
    `;
  } else {
    // Type "autre"
    contentHTML = `
      <div class="info-row">
        <span class="info-label">Nom complet:</span>
        <span class="info-value">${data.nom} ${data.prenom}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value"><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></span>
      </div>
      ${data.objet ? `
      <div class="info-row">
        <span class="info-label">Objet:</span>
        <span class="info-value">${data.objet}</span>
      </div>` : ''}
      ${data.message ? `
      <div class="message-box">
        <div class="message-label">Message:</div>
        <div style="color: #4b5563; white-space: pre-wrap;">${data.message}</div>
      </div>` : ''}
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Nouvelle demande reçue</h1>
          <span class="badge ${badgeClass}">${typeLabel}</span>
        </div>
        <div class="content">
          ${contentHTML}
        </div>
        <div class="footer">
          <p>Ce message a été envoyé depuis votre formulaire de contact</p>
          <p style="color: #9ca3af;">Reçu le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { type, ...data } = body;

    // 1) Sauvegarde dans la base selon le type
    let savedData: any;
    let circuit: any = null;

    if (type === "circuit") {      
      // Vérifier si c'est un circuit existant ou "other"
      const isOtherCircuit = data.circuitDemande === "other";
      
      // Récupérer les détails du circuit seulement si ce n'est pas "other"
      if (!isOtherCircuit && data.circuitDemande) {
        circuit = await prisma.circuit.findUnique({
          where: { id: data.circuitDemande },
          select: { 
            id: true, 
            title: true 
          }
        });
      }

      // Préparer les données pour la création
      const circuitRequestData: any = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone,
        adresse: data.adresse,
        nbPersonnes: Number(data.nbPersonnes),
        dateDepart: new Date(data.dateDepart),
        budget: data.budget,
        duree: data.duree,
        message: data.message,
        otherCircuit: data.otherCircuit,
      };

      // Ne lier le circuit que si ce n'est pas "other" et que le circuit existe
      if (!isOtherCircuit && circuit) {
        circuitRequestData.circuitId = data.circuitDemande;
      }

      savedData = await prisma.circuitRequest.create({
        data: circuitRequestData,
      });
      
      // Ajouter le titre du circuit aux données pour l'email
      if (circuit) {
        data.circuitTitle = circuit.title;
      } else if (isOtherCircuit && data.otherCircuit) {
        data.circuitTitle = `Circuit personnalisé: ${data.otherCircuit}`;
      } else {
        data.circuitTitle = 'Circuit non spécifié';
      }
    } else if (type === "partenariat") {
      savedData = await prisma.partenariatRequest.create({ data });
    } else if (type === "autre") {
      savedData = await prisma.autreRequest.create({ data });
    } else {
      return NextResponse.json(
        { success: false, message: "Type de formulaire invalide" },
        { status: 400 }
      );
    }

    // 2) Configuration transport email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3) Préparer email avec HTML
    const htmlContent = generateEmailHTML(type, data);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: data.email,
      to: process.env.EMAIL_USER,
      subject: `🔔 Nouvelle demande ${type === 'circuit' ? 'de circuit' : type === 'partenariat' ? 'de partenariat' : ''} - ${data.nom} ${data.prenom}`,
      html: htmlContent,
      text: JSON.stringify(data, null, 2),
    };

    // 4) Envoyer email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Message envoyé et sauvegardé avec succès",
      data: savedData,
    });
  } catch (error: any) {
    console.error("Erreur API contact:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}