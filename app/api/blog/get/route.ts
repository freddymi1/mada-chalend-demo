import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚨 ça force Next/Vercel à exécuter à chaque appel (pas de cache CDN)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        articles: {
          include: {
            comments: {
              where: {
                isApproved: true, // Seulement les commentaires approuvés
                parentId: null,   // Seulement les commentaires de premier niveau
              },
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                    // Ajoutez les champs User que vous voulez exposer
                  },
                },
                replies: {
                  where: {
                    isApproved: true,
                  },
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true,
                        email: true,
                      },
                    },
                    replies: {
                      // Si vous voulez aussi les réponses aux réponses
                      where: {
                        isApproved: true,
                      },
                      include: {
                        user: {
                          select: {
                            id: true,
                            username: true,
                            email: true,
                          },
                        },
                      },
                    },
                  },
                },
                _count: {
                  select: {
                    replies: true, // Compte le nombre de réponses
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
        comments: {
          where: {
            isApproved: true,
            parentId: null,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
            replies: {
              where: {
                isApproved: true,
              },
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                  },
                },
                replies: {
                  where: {
                    isApproved: true,
                  },
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
            _count: {
              select: {
                replies: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            articles: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculer des statistiques supplémentaires si besoin
    const blogsWithStats = blogs.map(blog => ({
      ...blog,
      totalComments: blog._count.comments + blog.articles.reduce((acc, article) => acc + article.comments.length, 0),
    }));

    return NextResponse.json(blogsWithStats, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des blogs" },
      { status: 500 }
    );
  }
}