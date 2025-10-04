// api/comment/validate/[id]/route.ts
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
 * PATCH - Approuver un commentaire (Admin seulement)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = params.id;

    // Récupérer l'utilisateur connecté
    const userId = await getUserFromSession(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Non autorisé. Vous devez être connecté." },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur existe et est admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Accès refusé. Seuls les administrateurs peuvent approuver des commentaires." },
        { status: 403 }
      );
    }

    // Vérifier que le commentaire existe
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Commentaire introuvable." },
        { status: 404 }
      );
    }

    // Récupérer le statut d'approbation depuis le body (optionnel)
    const body = await req.json().catch(() => ({}));
    const { isApproved } = body;

    // Si isApproved n'est pas fourni, on approuve par défaut
    const approvalStatus = typeof isApproved === "boolean" ? isApproved : true;

    // Mettre à jour le statut d'approbation
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        isApproved: approvalStatus,
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
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
        article: {
          select: {
            id: true,
            title: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: approvalStatus 
          ? "Commentaire approuvé avec succès." 
          : "Commentaire rejeté avec succès.",
        comment: updatedComment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la validation du commentaire:", error);
    return NextResponse.json(
      {
        error: "Une erreur s'est produite lors de la validation du commentaire.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Récupérer les détails d'un commentaire spécifique (Admin seulement)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = params.id;

    // Récupérer l'utilisateur connecté
    const userId = await getUserFromSession(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Non autorisé. Vous devez être connecté." },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur existe et est admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé. Seuls les administrateurs peuvent voir les détails des commentaires." },
        { status: 403 }
      );
    }

    // Récupérer le commentaire
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
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
        blog: {
          select: {
            id: true,
            title: true,
            subtitle: true,
          },
        },
        article: {
          select: {
            id: true,
            title: true,
            caption: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Commentaire introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        comment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du commentaire:", error);
    return NextResponse.json(
      {
        error: "Une erreur s'est produite lors de la récupération du commentaire.",
      },
      { status: 500 }
    );
  }
}