import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get the most recent privacy policy
    const legalNotices = await prisma.legalNotice.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc', // Plus récent en premier
      },
      take: 1, // Prendre seulement le premier résultat
    });

    const legalNotice = legalNotices[0]; // Premier élément du tableau

    if (!legalNotice) {
      // Return a default structure if no policy exists
      return NextResponse.json({
        id: null,
        content: 'LegalNotice content will be available soon.',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
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