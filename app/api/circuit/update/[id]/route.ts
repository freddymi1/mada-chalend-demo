// Update a circuit by ID
import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await request.json();

  try {
    const updatedCircuit = await prisma.circuit.update({
      where: { id },
      data: {
        title: data.title,
        duration: data.duration,
        price: data.price,
        maxPeople: data.maxPeople ? Number(data.maxPeople) : null, // 🔥 cast en Int ou null
        difficulty: data.difficulty,
        description: data.description,
        itinereryImage: data.itinereryImage,

        // ⚡ Highlights (si c’est un tableau de string => delete + recrée)
        highlights: {
          deleteMany: { circuitId: id },
          create: data.highlights?.map((text: string) => ({ text })),
        },

        // ⚡ Itinerary (si tu veux full replace aussi)
        itineraries: {
          deleteMany: { circuitId: id },
          create: data.itinerary?.map((it: any) => ({
            day: it.day,
            title: it.title,
            description: it.description,
            image: it.image,
            imageDescription: it.imageDescription,
            distance: Number(it.distance),
          })),
        },

        // ⚡ Included
        included: {
          deleteMany: { circuitId: id },
          create: data.included?.map((text: string) => ({ text })),
        },

        // ⚡ Not included
        notIncluded: {
          deleteMany: { circuitId: id },
          create: data.notIncluded?.map((text: string) => ({ text })),
        },
      },
      include: {
        highlights: true,
        itineraries: true,
        included: true,
        notIncluded: true,
      },
    });

    return NextResponse.json(updatedCircuit, { status: 200 });
  } catch (error) {
    console.error("PUT ERROR", error);
    return NextResponse.json({ error: 'Failed to update circuit' }, { status: 500 });
  }
}
