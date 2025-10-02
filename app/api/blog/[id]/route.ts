import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Récupérer le blog avec ses relations
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        articles: {
          include: {
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
                    replies: {
                      where: {
                        isApproved: true,
                      },
                    },
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
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
                replies: {
                  where: {
                    isApproved: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            articles: true,
            comments: {
              where: {
                isApproved: true,
                parentId: null,
              },
            },
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog non trouvé" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du blog" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}