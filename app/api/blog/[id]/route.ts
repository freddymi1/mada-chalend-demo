import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Récupérer le circuit avec ses relations
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        articles: true,
       
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "blog non trouvé" }, { status: 404 });
    }


    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error fetching circuit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du circuit" },
      { status: 500 }
    );
  }
}