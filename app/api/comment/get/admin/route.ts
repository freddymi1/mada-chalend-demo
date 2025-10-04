// api/comment/get/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// 🚨 ça force Next/Vercel à exécuter à chaque appel (pas de cache CDN)

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");
    const articleId = searchParams.get("articleId");

    const where: any = {
    //   isApproved: true,
      // parentId: null,
    };

    if (blogId) {
      where.blogId = blogId;
    }

    if (articleId) {
      where.articleId = articleId;
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        blog: true,
        article: true,
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
          where: { isApproved: true },
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
              where: { isApproved: true },
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        comments,
        count: comments.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la récupération des commentaires." },
      { status: 500 }
    );
  }
}