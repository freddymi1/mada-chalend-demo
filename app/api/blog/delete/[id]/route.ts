import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID du blog manquant" },
        { status: 400 }
      );
    }

    // Vérifier si le blog existe
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
      include: {
        articles: {
          include: {
            comments: true // Inclure les commentaires des articles si nécessaire
          }
        },
        comments: true,
      },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog non trouvé" },
        { status: 404 }
      );
    }

    // Option 1: Suppression en cascade automatique (recommandée)
    await prisma.blog.delete({
      where: { id },
    });

    // Option 2: Suppression manuelle si nécessaire
    // await prisma.$transaction(async (tx) => {
    //   // Supprimer d'abord les commentaires des articles
    //   for (const article of existingBlog.articles) {
    //     await tx.comment.deleteMany({
    //       where: { articleId: article.id }
    //     });
    //   }
      
    //   // Supprimer les articles
    //   await tx.article.deleteMany({
    //     where: { blogId: id }
    //   });
      
    //   // Supprimer les commentaires du blog
    //   await tx.comment.deleteMany({
    //     where: { blogId: id }
    //   });
      
    //   // Supprimer le blog
    //   await tx.blog.delete({
    //     where: { id }
    //   });
    // });

    return NextResponse.json(
      { 
        message: "Blog et tous ses articles supprimés avec succès",
        deletedBlog: {
          id: existingBlog.id,
          title: existingBlog.title,
          articleCount: existingBlog.articles.length,
          commentCount: existingBlog.comments.length
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la suppression du blog:", error);
    
    // Gestion spécifique des erreurs de contrainte
    if (error instanceof Error && error.message.includes("foreign key constraint")) {
      return NextResponse.json(
        { error: "Impossible de supprimer le blog car il est référencé ailleurs" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Erreur serveur lors de la suppression du blog",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}