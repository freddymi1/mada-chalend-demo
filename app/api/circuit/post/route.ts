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
      difficulty,
      description,
      itinereryImage,
      highlights = [], // Default to empty array
      included = [],   // Default to empty array
      notIncluded = [], // Default to empty array
      itineraries = [], // Default to empty array
    } = body;

    // Validate required fields
    if (!title || !duration || !price || !difficulty || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCircuit = await prisma.circuit.create({
      data: {
        title,
        duration,
        price,
        maxPeople: Number(maxPeople),
        difficulty,
        description,
        itinereryImage,
        highlights: {
          create: highlights.map((text: string) => ({ text })),
        },
        included: {
          create: included.map((text: string) => ({ text })),
        },
        notIncluded: {
          create: notIncluded.map((text: string) => ({ text })),
        },
        itineraries: {
          create: itineraries.map((it: any) => ({
            day: it.day,
            title: it.title,
            description: it.description,
            image: it.image,
            imageDescription: it.imageDescription,
            distance: Number(it.distance),
          })),
        },
      },
      include: {
        highlights: true,
        included: true,
        notIncluded: true,
        itineraries: true,
      },
    });

    return NextResponse.json(newCircuit, { status: 201 });
  } catch (error) {
    console.error("Error creating circuit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du circuit" },
      { status: 500 }
    );
  }
}