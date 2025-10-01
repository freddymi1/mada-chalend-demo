// Update a circuit by ID
import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await request.json();

  try {
    const updateCar = await prisma.reservation.update({
      where: { id },
      data: {
        ...data,
        status: data.status
      },
      
    });

    return NextResponse.json(updateCar, { status: 200 });
  } catch (error) {
    console.error("PUT ERROR", error);
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}
