// update review status

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { title } from "process";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await request.json();
  try {
    const { status } = data;

    // Validate required fields
    if (!status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        status: data.status,
      },
      
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la review" },
      { status: 500 }
    );
  }
}
