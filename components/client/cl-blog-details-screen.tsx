"use client";

import { useTheme } from "@/src/hooks/useTheme";
import {
  ArrowLeft,
  User,
  FileText,
  Loader2,
  ImageIcon,
  MessageCircle,
  Send,
  X,
  Edit2,
  Trash2,
  Save,
  ChevronRight,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCiBlog } from "../providers/client/ClBlogProvider";
import { useLocale, useTranslations } from "next-intl";
import { useAuthClient } from "@/src/hooks/useAuthClient";
import { IComment } from "@/src/domain/entities/comment";
import { toast } from "sonner";
import AnimateLoading from "./animate-loading";

interface CommentSectionState {
  type: "blog" | "article";
  id: string;
}

const CiBlogDetailScreen = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("lng");
  const locale = useLocale();
  const id = params?.id;

  const { blogDetail, getBlogById, isLoading1 } = useCiBlog();

  useEffect(() => {
    if (id) {
      getBlogById(id.toString());
    }
  }, [id]);

  const title = blogDetail?.title ? JSON.parse(blogDetail?.title as any) :"";

  if (isLoading1) {
    return <AnimateLoading/>;
  }

  if (!blogDetail) {
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
            Blog introuvable
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
        {/* Fil d'Ariane */}
        <div className="flex items-center justify-between mb-8">
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
              <span
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {locale === "fr" ? title?.fr : title?.en}
              </span>
            </nav>
          </div>
        </div>

        <div
          className={`rounded-xl p-8 shadow-lg mb-8 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {locale === "fr" ? title?.fr : title?.en}
          </h1>

          {blogDetail.subtitle && (
            <p
              className={`text-xl mb-6 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {blogDetail.subtitle}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mb-6">
            {blogDetail.articles && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <FileText
                  className={`w-4 h-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {blogDetail.articles.length} article
                  {blogDetail.articles.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {blogDetail.articles && blogDetail.articles.length > 0 && (
          <div>
            <div className="space-y-6">
              {blogDetail.articles.map((article: any, index: number) => {
                const articleTitle = article.title ? JSON.parse(article.title) : "";
                return(
                  <div
                  key={article.id}
                  className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div
                      className={`p-6 flex flex-col justify-center ${
                        index % 2 === 0 ? "md:order-2" : "md:order-1"
                      }`}
                    >
                      {article.title && (
                        <a
                          href={`/question/${article.id}`}
                          className={`text-md text-left font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {locale === "fr" ? articleTitle?.fr : articleTitle?.en}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        )}

        {(!blogDetail.articles || blogDetail.articles.length === 0) && (
          <div
            className={`rounded-xl p-12 text-center ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <FileText
              className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("blog.details.noArticle")}
            </h3>
            <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {t("blog.details.noArticleFound")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CiBlogDetailScreen;
