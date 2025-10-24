// app/api/profile/put/route.ts (version avec gestion des services)
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await request.json();

    console.log({"ID": id, "BODY": body})
    
    // Validation des données requises
    if (!id) {
      return NextResponse.json(
        { error: 'ID du contact est requis' },
        { status: 400 }
      );
    }

    if (!body.instaLink) {
      return NextResponse.json(
        { error: 'Le champ instaLink est requis' },
        { status: 400 }
      );
    }

    // Vérifier si le contact existe
    const existingContact = await prisma.contact.findUnique({
      where: { id: id },
      include: { services: true }
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      );
    }

    // Mise à jour du contact avec gestion des services
    const updatedContact = await prisma.contact.update({
      where: {
        id: id,
      },
      data: {
        // About
        aboutTitle: body.aboutTitle || null,
        aboutContent: body.aboutContent || null,
        subContent: body.subContent || null,

        // Contact
        whatsapp: body.whatsapp || null,
        phone: body.phone || null,
        email: body.email || null,
        fbLink: body.fbLink || null,
        instaLink: body.instaLink,
        address: body.address,

        // Gestion des services (optionnel)
        ...(body.services && {
          services: {
            // Supprimer tous les services existants
            deleteMany: {},
            // Créer les nouveaux services
            create: body.services.map((service: any) => ({
              title: service.title || null,
              content: service.content || null,
            }))
          }
        })
      },
      include: {
        services: true,
      },
    });

    return NextResponse.json(updatedContact);

  } catch (error) {
    console.error('Erreur lors de la mise à jour du contact:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}