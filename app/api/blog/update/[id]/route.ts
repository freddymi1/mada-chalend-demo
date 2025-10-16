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
    const { title, subtitle, description, author, image, articles = [] } = data;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        image,
        articles: {
          deleteMany: { blogId: id },
          create: articles.map((it: any) => ({
            title: it.title,
            image: it.image,
            caption: it.caption,
            description: it.description,
          })),
        },
      },
      include: {
        articles: true,
      },
    });

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du blog" },
      { status: 500 }
    );
  }
}
