// api/comment/post/route.ts
import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚨 ça force Next/Vercel à exécuter à chaque appel (pas de cache CDN)
export const dynamic = "force-dynamic";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Récupère l'utilisateur connecté depuis le token JWT envoyé dans le header Authorization.
 * @param req NextRequest
 * @returns User ou null si non authentifié
 */

export async function getUserFromSession(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.slice(7); // retire 'Bearer '
    const decoded = jwt.verify(token, JWT_SECRET as string) as { userId: string };
    return decoded.userId;
  } catch (err) {
    console.error("Token invalide:", err);
    return null;
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("REQQQQ", body)
     const { content, userId, blogId, articleId, parentId } = body;
    // Récupérer l'utilisateur connecté
    const user = await prisma.user.findUnique({
      where:{id: userId}
    });
    console.log("USER", user)

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Vous devez être connecté pour commenter." },
        { status: 401 }
      );
    }

    // Récupérer les données du body
   

    // Validation des données
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Le contenu du commentaire est requis." },
        { status: 400 }
      );
    }

    if (!blogId && !articleId) {
      return NextResponse.json(
        { error: "Le commentaire doit être associé à un blog ou un article." },
        { status: 400 }
      );
    }

    // Vérifier que le blog existe (si blogId est fourni)
    if (blogId) {
      const blog = await prisma.blog.findUnique({
        where: { id: blogId },
      });

      if (!blog) {
        return NextResponse.json(
          { error: "Blog introuvable." },
          { status: 404 }
        );
      }
    }

    // Vérifier que l'article existe (si articleId est fourni)
    if (articleId) {
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });

      if (!article) {
        return NextResponse.json(
          { error: "Article introuvable." },
          { status: 404 }
        );
      }
    }

    // Vérifier que le commentaire parent existe (si parentId est fourni)
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "Commentaire parent introuvable." },
          { status: 404 }
        );
      }
    }

    // Créer le commentaire
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: user?.id,
        blogId: blogId || null,
        articleId: articleId || null,
        parentId: parentId || null,
        isApproved: false,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Commentaire créé avec succès. En attente d'approbation.",
        comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);
    return NextResponse.json(
      {
        error: "Une erreur s'est produite lors de la création du commentaire.",
      },
      { status: 500 }
    );
  }
}
