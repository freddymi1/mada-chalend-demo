// Update a circuit by ID
import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await request.json();

  try {
    const updatedTrip = await prisma.tripTravel.update({
      where: { id },
      data: {
        title: data.title,
        duration: data.duration,
        price: data.price,
        maxPeople: data.maxPeople ? Number(data.maxPeople) : null,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        description: data.description,

        // ⚡ Highlights (si c’est un tableau de string => delete + recrée)
        highlights: {
          deleteMany: { circuitId: id },
          create: data.highlights?.map((text: string) => ({ text })),
        },

        // ⚡ Program (si tu veux full replace aussi)
        program: {
          deleteMany: { tripTravelId: id },
          create: data.program?.map((it: any) => ({
            day: it.day,
            title: it.title,
            description: it.description,
            image: it.image,
            imageDescription: it.imageDescription,
          })),
        },

        // ⚡ Included
        included: {
          deleteMany: { tripTravelId: id },
          create: data.included?.map((text: string) => ({ text })),
        },

        // ⚡ Not included
        notIncluded: {
          deleteMany: { tripTravelId: id },
          create: data.notIncluded?.map((text: string) => ({ text })),
        },
      },
      include: {
        highlights: true,
        program: true,
        included: true,
        notIncluded: true,
      },
    });

    return NextResponse.json(updatedTrip, { status: 200 });
  } catch (error) {
    console.error("PUT ERROR", error);
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}
