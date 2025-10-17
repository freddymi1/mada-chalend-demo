import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q')?.trim() || '';
    const blogId = searchParams.get('blogId');
    const searchIn = searchParams.get('searchIn') || 'all'; // 'all', 'blogs', 'articles', 'articles-only'

    // Construction de la clause WHERE pour les blogs
    let blogWhereClause: any = {};

    if (blogId) {
      blogWhereClause.id = blogId;
    }

    // Si recherche active, on filtre les blogs selon le scope
    if (searchQuery) {
      const searchCondition = {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
        ]
      };

      const articleSearchCondition = {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } }
        ]
      };

      switch (searchIn) {
        case 'blogs':
          // Recherche uniquement dans les titres de blogs
          blogWhereClause = { ...blogWhereClause, ...searchCondition };
          break;
        
        case 'articles':
          // Recherche dans les articles mais retourne les blogs complets
          blogWhereClause = {
            ...blogWhereClause,
            articles: {
              some: articleSearchCondition
            }
          };
          break;
        
        case 'articles-only':
          // Recherche uniquement dans les articles (retourne tous les blogs mais filtre les articles)
          blogWhereClause = {
            ...blogWhereClause,
            articles: {
              some: articleSearchCondition
            }
          };
          break;
        
        default: // 'all'
          // Recherche dans tout : blogs ET articles
          blogWhereClause = { 
            ...blogWhereClause, 
            OR: [
              searchCondition,
              {
                articles: {
                  some: articleSearchCondition
                }
              }
            ]
          };
          break;
      }
    }

    const blogs = await prisma.blog.findMany({
      where: blogWhereClause,
      include: {
        articles: {
          // Pour 'articles-only', on filtre les articles dans la requête
          where: searchQuery && searchIn === 'articles-only' ? {
            OR: [
              { title: { contains: searchQuery, mode: 'insensitive' } },
              { description: { contains: searchQuery, mode: 'insensitive' } }
            ]
          } : {},
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
                    replies: true,
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

    // Fonctions utilitaires
    const highlightMatches = (text: string, query: string): string => {
      if (!query || !text) return text;
      // Échapper les caractères spéciaux pour la regex
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      return text.replace(regex, '$1');
    };

    const calculateRelevanceScore = (blog: any, query: string): number => {
      let score = 0;
      const lowerQuery = query.toLowerCase();

      // Score pour le titre du blog
      if (blog.title.toLowerCase().includes(lowerQuery)) {
        score += 10;
      }

      // Score pour les articles
      blog.articles.forEach((article: any) => {
        if (article.title.toLowerCase().includes(lowerQuery)) {
          score += 5;
        }
        if (article.description.toLowerCase().includes(lowerQuery)) {
          score += 3;
        }
        
        // Bonus pour multiples occurrences
        const titleMatches = (article.title.match(new RegExp(lowerQuery, 'gi')) || []).length;
        const descMatches = (article.description.match(new RegExp(lowerQuery, 'gi')) || []).length;
        score += (titleMatches * 2) + descMatches;
      });

      return score;
    };

    const getMatchType = (blog: any, query: string): string => {
      const lowerQuery = query.toLowerCase();
      const matches = [];

      if (blog.title.toLowerCase().includes(lowerQuery)) {
        matches.push('blog_title');
      }

      blog.articles.forEach((article: any) => {
        if (article.title.toLowerCase().includes(lowerQuery)) {
          matches.push('article_title');
        }
        if (article.description.toLowerCase().includes(lowerQuery)) {
          matches.push('article_content');
        }
      });

      if (matches.includes('blog_title')) return 'blog_title';
      if (matches.includes('article_title')) return 'article_title';
      if (matches.includes('article_content')) return 'article_content';
      return 'none';
    };

    // Préparer les données avec highlighting
    const blogsWithSearchData = blogs.map(blog => {
      const relevanceScore = searchQuery ? calculateRelevanceScore(blog, searchQuery) : 0;
      const matchType = searchQuery ? getMatchType(blog, searchQuery) : 'none';
      
      // Mettre en évidence les correspondances
      const highlightedBlog = {
        ...blog,
        title: searchQuery ? highlightMatches(blog.title!, searchQuery) : blog.title,
        articles: blog.articles.map((article: any) => ({
          ...article,
          title: searchQuery ? highlightMatches(article.title, searchQuery) : article.title,
          description: searchQuery ? highlightMatches(article.description, searchQuery) : article.description,
          // Ajouter un flag pour indiquer si l'article contient des matches
          hasSearchMatch: searchQuery ? 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase())
            : false
        }))
      };

      return {
        ...highlightedBlog,
        totalComments: blog._count.comments + blog.articles.reduce((acc, article) => acc + article.comments.length, 0),
        relevanceScore,
        matchType
      };
    });

    // Trier par pertinence si recherche active
    if (searchQuery) {
      blogsWithSearchData.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    // Calculer les statistiques
    const searchStats = {
      totalBlogs: blogsWithSearchData.length,
      totalArticles: blogsWithSearchData.reduce((acc, blog) => acc + blog.articles.length, 0),
      blogsWithMatches: blogsWithSearchData.filter(blog => blog.relevanceScore > 0).length,
      articlesWithMatches: blogsWithSearchData.reduce((acc, blog) => 
        acc + blog.articles.filter((article: any) => article.hasSearchMatch).length, 0
      )
    };

    return NextResponse.json({
      blogs: blogsWithSearchData,
      search: {
        query: searchQuery,
        scope: searchIn,
        stats: searchStats,
        hasResults: blogsWithSearchData.length > 0
      },
      metadata: {
        total: blogsWithSearchData.length,
        timestamp: new Date().toISOString()
      }
    }, {
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