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