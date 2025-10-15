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
      travelDates,
      description,
      highlights = [], // Default to empty array
      included = [], // Default to empty array
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
        price,
        duration,
        travelDates: {
          create: travelDates.map((date: any) => ({
            startDate: new Date(date.startDate),
            endDate: new Date(date.endDate),
            maxPeople: Number(date.maxPeople),
            price: Number(date.price),
            duration: Number(date.duration),
          })),
        },
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
