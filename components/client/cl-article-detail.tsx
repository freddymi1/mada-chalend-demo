"use client";

import React from "react";
import { useCiBlog } from "../providers/client/ClBlogProvider";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/src/hooks/useTheme";
import {
  Calendar,
  ChevronRight,
  Facebook,
  FileText,
  Linkedin,
  Loader2,
  Twitter,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import AnimateLoading from "./animate-loading";

const ClArticleDetail = () => {
  const params = useParams();
  const articleId = params?.id;
  const t = useTranslations("lng");
  const locale = useLocale();

  const {
    article,
    getArticleById,
    isLoading,
    isLoading1,
    blogDetail,
    getBlogById,
    updateArticle,
  } = useCiBlog();
  const { isDark } = useTheme();
  const router = useRouter();
  const [userVote, setUserVote] = React.useState<"like" | "dislike" | null>(
    null
  );

  React.useEffect(() => {
    if (articleId) {
      getArticleById(articleId.toString());
    }
  }, [articleId]);

  React.useEffect(() => {
    if (article?.blogId) {
      getBlogById(article.blogId.toString());
    }
  }, [article]);

  // Charger le vote de l'utilisateur depuis le state local
  React.useEffect(() => {
    if (articleId) {
      const savedVote = localStorage.getItem(`article_vote_${articleId}`);
      if (savedVote) {
        setUserVote(savedVote as "like" | "dislike");
      }
    }
  }, [articleId]);

  const handleLike = async () => {
    if (!articleId) return;

    // Puis on ajoute le like
    await updateArticle(articleId.toString(), {
      likeCount: Number(article?.likeCount) + 1,
      dislikeCount: Number(article?.dislikeCount),
    });
    setUserVote("like");
    localStorage.setItem(`article_vote_${articleId}`, "like");
  };

  const handleDislike = async () => {
    if (!articleId) return;

    // Puis on ajoute le dislike
    await updateArticle(articleId.toString(), {
      dislikeCount: Number(article?.dislikeCount) + 1,
      likeCount: Number(article?.likeCount),
    });
    setUserVote("dislike");
    localStorage.setItem(`article_vote_${articleId}`, "dislike");
  };

  if (isLoading) {
    return <AnimateLoading/>;
  }

  const title = article?.title ? JSON.parse(article?.title as any) : "";
  const description = article?.description ? JSON.parse(article?.description as any) : "";

  if (!article) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        <div className="text-center">
          <FileText
            className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <h2
            className={`text-2xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Article introuvable
          </h2>
          <button
            onClick={() => router.push("/admin/blogs")}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-slate-50 to-indigo-50"
      }`}
    >
      <div className="px-6 py-8 container mx-auto">
        <div className="flex items-center gap-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => router.push("/blog")}
              className={`transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Blog
            </button>
            <ChevronRight
              className={`w-4 h-4 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <button
              onClick={() => router.push(`/blog/${article.blogId}`)}
              className={`transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Blog Details
            </button>
            <ChevronRight
              className={`w-4 h-4 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <span
              className={`font-medium ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {locale === "fr" ? title?.fr : title?.en}
            </span>
          </nav>
        </div>
        <div className="w-full mt-16">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3">
              <h3
                className={`text-lg font-semibold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("blog.details.articleDetail.title")}
              </h3>
              {isLoading1 ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  {blogDetail?.articles && blogDetail.articles.length > 0 && (
                    <div>
                      <div className="space-y-4">
                        {blogDetail.articles.map(
                          (relatedArticle: any, index: number) => {
                            const isActive =
                              relatedArticle.id.toString() ===
                              articleId?.toString();
                            const relatedTitle = relatedArticle.title ? JSON.parse(
                              relatedArticle.title as any
                            ) : null;
                            return (
                              <div
                                key={relatedArticle.id}
                                onClick={() =>
                                  router.push(`/question/${relatedArticle.id}`)
                                }
                                className={`rounded-xl cursor-pointer overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl ${
                                  isActive
                                    ? isDark
                                      ? "bg-indigo-900 border-2 border-indigo-500"
                                      : "bg-indigo-100 border-2 border-indigo-400"
                                    : isDark
                                    ? "bg-gray-800"
                                    : "bg-white"
                                }`}
                              >
                                <div
                                  className={`p-6 flex flex-col justify-center ${
                                    index % 2 === 0
                                      ? "md:order-2"
                                      : "md:order-1"
                                  }`}
                                >
                                  {relatedArticle.title && (
                                    <button
                                      disabled={isActive}
                                      className={`text-sm text-left font-semibold transition-colors ${
                                        isActive
                                          ? isDark
                                            ? "text-indigo-300 cursor-default"
                                            : "text-indigo-700 cursor-default"
                                          : isDark
                                          ? "text-white hover:text-indigo-400"
                                          : "text-gray-900 hover:text-indigo-600"
                                      }`}
                                    >
                                      {locale === "fr"
                                        ? relatedTitle?.fr
                                        : relatedTitle?.en}
                                      {isActive && (
                                        <span className="ml-2 text-xs font-normal opacity-75">
                                          (actuel)
                                        </span>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="w-full lg:w-2/3">
              {article.title && (
                <h3
                  className={`text-xl md:text-2xl lg:text-3xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {locale === "fr" ? title?.fr : title?.en}
                </h3>
              )}
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                Mada-Chaland
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {article.createdAt && (
                  <time
                    dateTime={new Date(article.createdAt).toISOString()}
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                )}
              </div>
              {article.description && (
                <div className="relative mt-4 bottom-0 left-0 right-0 rounded-lg bg-opacity-60 p-3">
                  <div
                    className="text-md leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html:
                        locale === "fr" ? description?.fr : description?.en,
                    }}
                  />
                </div>
              )}
              {/* Share with social network facebook, twitter, linkedin */}
              <div className="my-6">
                <div className="flex gap-4">
                  <button
                    className={`w-10 h-10 rounded-full border-2 ${
                      isDark
                        ? "border-gray-600 hover:border-blue-500 hover:bg-blue-500/10"
                        : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                    } flex items-center justify-center transition-all`}
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    className={`w-10 h-10 rounded-full border-2 ${
                      isDark
                        ? "border-gray-600 hover:border-sky-500 hover:bg-sky-500/10"
                        : "border-gray-300 hover:border-sky-500 hover:bg-sky-50"
                    } flex items-center justify-center transition-all`}
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    className={`w-10 h-10 rounded-full border-2 ${
                      isDark
                        ? "border-gray-600 hover:border-blue-600 hover:bg-blue-600/10"
                        : "border-gray-300 hover:border-blue-600 hover:bg-blue-50"
                    } flex items-center justify-center transition-all`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div
                className={`w-full h-[2px] ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                }`}
              ></div>
              <div className="mt-4 w-full flex flex-col gap-4 items-center">
                <p
                  className={`font-medium ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {t("blog.details.articleDetail.articleIsInterseted")}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleLike}
                    className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                      userVote === "like"
                        ? "bg-indigo-600 text-white shadow-lg"
                        : isDark
                        ? "bg-gray-700 text-gray-200 hover:bg-indigo-600 hover:text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-indigo-600 hover:text-white"
                    }`}
                  >
                    👍 {t("blog.details.articleDetail.yes")}
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                      userVote === "dislike"
                        ? isDark
                          ? "bg-red-900 text-white shadow-lg"
                          : "bg-red-100 text-red-700 shadow-lg"
                        : isDark
                        ? "bg-gray-700 text-gray-200 hover:bg-red-900 hover:text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-700"
                    }`}
                  >
                    👎 {t("blog.details.articleDetail.no")}
                  </button>
                </div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("blog.details.articleDetail.userInterested")}:{" "}
                  <span className="font-semibold text-indigo-600">
                    {article.likeCount || 0}
                  </span>{" "}
                  {t("blog.details.articleDetail.of")}{" "}
                  <span className="font-semibold">
                    {article.dislikeCount || 0}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClArticleDetail;
