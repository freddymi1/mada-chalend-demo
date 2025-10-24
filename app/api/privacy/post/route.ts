// app/api/privacy-policy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Create new PrivacyPolicy
    const privacyPolicy = await prisma.privacyPolicy.create({
      data: {
        content,
      },
    });

    return NextResponse.json(
      { 
        message: 'Privacy policy created successfully',
        data: privacyPolicy 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating privacy policy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}