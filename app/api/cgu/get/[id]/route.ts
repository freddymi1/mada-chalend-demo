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
    const legalNotice = await prisma.legalNotice.findUnique({
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

    if (!legalNotice) {
      return NextResponse.json(
        { error: 'legalNotice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(legalNotice);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Unable to fetch legalNotice',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}