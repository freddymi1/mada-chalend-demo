import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get the most recent privacy policy
    const privacyPolicies = await prisma.privacyPolicy.findMany({
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

    const privacyPolicy = privacyPolicies[0]; // Premier élément du tableau

    if (!privacyPolicy) {
      // Return a default structure if no policy exists
      return NextResponse.json({
        id: null,
        content: 'Privacy policy content will be available soon.',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
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