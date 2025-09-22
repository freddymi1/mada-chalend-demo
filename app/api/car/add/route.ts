import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      categoryId,
      type,
      passengers,
      pricePerDay,
      rating,
      mainImage,
      detailImages = [], // Default to empty array
      features = [],    // Default to empty array
      description,
    } = body;

    // Validate required fields
    if (
      !name ||
      !categoryId ||
      !type ||
      !passengers ||
      !pricePerDay
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newVehicle = await prisma.vehicle.create({
      data: {
        name,
        categoryId,
        type,
        passengers: Number(passengers),
        pricePerDay: Number(pricePerDay),
        rating: Number(rating),
        mainImage,
        detailImages,
        features,
        description,
      },
      include: {
        categoryRel: true, // Include related category
      },
    });

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Example vehicle data structure for reference
// {
//   id: "1",
//   name: "Toyota Land Cruiser",
//   categoryId: "4x4",
//   type: "4x4",
//   passengers: 7,
//   pricePerDay: 120,
//   rating: 4.8,
//   mainImage: "https://example.com/main-image.jpg",
//   detailImages: [
//     "https://example.com/detail-image1.jpg",
//     "https://example.com/detail-image2.jpg"
//   ],
//   features: ["7 places", "Transmission intégrale", "Climatisation"],
//   description: "Parfait pour les safaris et excursions tout-terrain."
// }