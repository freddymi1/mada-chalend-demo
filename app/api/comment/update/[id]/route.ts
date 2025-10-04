// api/comment/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// 🚨 ça force Next/Vercel à exécuter à chaque appel (pas de cache CDN)
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Récupère l'utilisateur connecté depuis le token JWT envoyé dans le header Authorization.
 * @param req NextRequest
 * @returns User ID ou null si non authentifié
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

/**
 * PUT - Modifier un commentaire
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = params.id;

    // Récupérer l'utilisateur connecté
    const userId = await getUserFromSession(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Non autorisé. Vous devez être connecté pour modifier un commentaire." },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // Récupérer le commentaire
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Commentaire introuvable." },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est l'auteur du commentaire
    if (comment.userId !== userId) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier ce commentaire." },
        { status: 403 }
      );
    }

    // Récupérer les données du body
    const body = await req.json();
    const { content } = body;

    // Validation des données
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Le contenu du commentaire est requis." },
        { status: 400 }
      );
    }

    // Mettre à jour le commentaire
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
        updatedAt: new Date(),
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
        message: "Commentaire modifié avec succès.",
        comment: updatedComment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la modification du commentaire:", error);
    return NextResponse.json(
      {
        error: "Une erreur s'est produite lors de la modification du commentaire.",
      },
      { status: 500 }
    );
  }
}

