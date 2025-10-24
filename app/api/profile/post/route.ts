// app/api/profile/post/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données requises
    if (!body.instaLink) {
      return NextResponse.json(
        { error: 'Le champ instaLink est requis' },
        { status: 400 }
      );
    }

    // Création du contact avec ses services
    const contact = await prisma.contact.create({
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

        // Services (si fournis)
        services: body.services && body.services.length > 0 ? {
          create: body.services.map((service: any) => ({
            title: service.title || null,
            content: service.content || null,
          }))
        } : undefined,
      },
      include: {
        services: true, // Inclure les services dans la réponse
      },
    });

    return NextResponse.json(contact, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du contact:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

