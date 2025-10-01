// Update a circuit by ID
import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await request.json();

  try {
    const updateCar = await prisma.vehicle.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        passengers: Number(data.passengers),
        pricePerDay: Number(data.pricePerDay),
        rating: Number(data.rating),
        mainImage: data.mainImage,
        detailImages: data.detailImages,
        features: data.features,
        description: data.description,
        categoryId: data.categoryId,
        status: data.status
      },
      
    });

    return NextResponse.json(updateCar, { status: 200 });
  } catch (error) {
    console.error("PUT ERROR", error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}
