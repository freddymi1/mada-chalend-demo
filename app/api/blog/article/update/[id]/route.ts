import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await request.json();
  try {
    const { likeCount, dislikeCount} = data;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedBlog = await prisma.article.update({
      where: { id },
      data: {
        likeCount: Number(likeCount),
        dislikeCount: Number(dislikeCount)
      },
      
    });

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'article" },
      { status: 500 }
    );
  }
}
