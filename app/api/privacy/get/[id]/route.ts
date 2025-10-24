import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // Validation de l'ID
    if (!id || id === 'null' || id === 'undefined') {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Récupérer la politique de confidentialité par ID
    const privacyPolicy = await prisma.privacyPolicy.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!privacyPolicy) {
      return NextResponse.json(
        { error: 'Privacy policy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(privacyPolicy);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Unable to fetch privacy policy',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}