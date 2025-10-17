import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { titre, description, note, userId } = body;

    // Validation des champs requis
    if (!titre || !description || !note || !userId) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis: titre, description, note, userId' },
        { status: 400 }
      );
    }

    // Validation de la note (entre 1 et 5 par exemple)
    if (note < 1 || note > 5) {
      return NextResponse.json(
        { error: 'La note doit être comprise entre 1 et 5' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Créer la review
    const review = await prisma.review.create({
      data: {
        titre,
        description,
        note: parseInt(note),
        userId,
        status: 'pending' // Statut par défaut
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(
      { 
        message: 'Review créée avec succès', 
        review 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur lors de la création de la review:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

