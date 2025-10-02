import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subtitle, description, author, image, articles = [] } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCircuit = await prisma.blog.create({
      data: {
        title,
        subtitle,
        description,
        author,
        image,
        articles: {
          create: articles.map((it: any) => ({
            title: it.title,
            image: it.image,
            caption: it.caption,
            imageDescription: it.imageDescription,
          })),
        },
      },
      include: {
        articles: true,
      },
    });

    return NextResponse.json(newCircuit, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du blog" },
      { status: 500 }
    );
  }
}
