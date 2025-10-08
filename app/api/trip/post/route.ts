import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      duration,
      price,
      maxPeople,
      startDate,
      endDate,
      description,
      highlights = [], // Default to empty array
      included = [],   // Default to empty array
      notIncluded = [], // Default to empty array
      program = [], // Default to empty array
    } = body;

    // Validate required fields
    if (!title || !duration || !price || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTrip = await prisma.tripTravel.create({
      data: {
        title,
        duration,
        price,
        maxPeople: Number(maxPeople),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        highlights: {
          create: highlights.map((text: string) => ({ text })),
        },
        included: {
          create: included.map((text: string) => ({ text })),
        },
        notIncluded: {
          create: notIncluded.map((text: string) => ({ text })),
        },
        program: {
          create: program.map((it: any) => ({
            day: it.day,
            title: it.title,
            description: it.description,
            image: it.image,
            imageDescription: it.imageDescription,
          })),
        },
      },
      include: {
        highlights: true,
        included: true,
        notIncluded: true,
        program: true,
      },
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du trip" },
      { status: 500 }
    );
  }
}