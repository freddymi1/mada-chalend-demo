"use client";

import { useTheme } from "@/src/hooks/useTheme";
import {
  Plus,
  Eye,
  User,
  FileText,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useCiBlog } from "../providers/client/ClBlogProvider";
import { useLocale, useTranslations } from "next-intl";
import { useAuthClient } from "@/src/hooks/useAuthClient";
import AnimateLoading from "./animate-loading";

const BlogSection = () => {
  const { isDark } = useTheme();
  const t = useTranslations("lng");
  const locale = useLocale();

  const router = useRouter();
  const {
    addedBlogs,
    fetchBlogs,
    isLoading,
    handleSearchInputChange,
    searchQuery,
  } = useCiBlog();
  const { user, isAuthenticated } = useAuthClient();

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300`}
    >
      {/* Header avec image de fond */}
      <div className="relative min-h-80 max-h-96 mb-8 overflow-hidden">
        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070')`,
          }}
        >
          {/* Overlay gradient */}
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900/90"
                : "bg-gradient-to-b from-black/40 via-black/20 to-white/80"
            }`}
          ></div>
        </div>

        {/* Contenu du header */}
        <div className="relative h-full w-full mt-8 flex flex-col items-center justify-center px-6">
          <div className="text-center animate-slide-up">
            <h2
              className={`text-4xl sm:text-5xl font-bold mb-6 text-balance ${
                isDark ? "text-white" : "text-white"
              }`}
            >
              {t("blog.title")}
            </h2>
            <p
              className={`text-lg max-w-3xl mx-auto text-pretty ${
                isDark ? "text-gray-200" : "text-white/90"
              }`}
            >
              {t("blog.subtitle")}
            </p>
          </div>
          {/* Input search blogs */}
          <div className="mt-8 mb-8 w-full lg:max-w-3xl">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder={t("blog.searchPlaceholder")}
              className={`w-full p-4 border rounded-lg transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                isDark
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-8 container mx-auto">
        {/* Loading State */}
        {isLoading && (
          <AnimateLoading/>
        )}

        {/* Empty State */}
        {!isLoading && addedBlogs.length === 0 && (
          <div
            className={`rounded-xl p-12 text-center ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <FileText
              className={`w-16 h-16 mx-auto mb-4 text-slate-700`}
            />
            <h3
              className={`text-xl font-semibold mb-2 text-slate-700`}
            >
              {t("blog.emptyBlogs")}
            </h3>
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && addedBlogs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {addedBlogs.map((blog) => {
              const title = blog.title ? JSON.parse(blog.title as any) : null;
              return(
                <div
                key={blog.id}
                onClick={() => router.push(`/blog/${blog.id}`)}
                className={`rounded-xl overflow-hidden shadow-lg transition-all relative cursor-pointer duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white/50`}
              >
                {/* Blog Image */}
                <div
                  className={`relative h-24 flex items-center justify-center overflow-hidden ${
                    isDark ? "bg-gray-100" : "bg-gray-500"
                  }`}
                >
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={locale === "fr" ? title?.fr : title?.en}
                      className="w-18 object-cover h-auto"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-white opacity-50" />
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="p-6 relative">
                  {/* Title */}
                  <h3
                    className={`text-xl font-bold mb-2 line-clamp-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {locale === "fr" ? title?.fr : title?.en}
                  </h3>

                  {/* Subtitle */}
                  {blog.subtitle && (
                    <p
                      className={`text-sm mb-3 line-clamp-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {blog.subtitle}
                    </p>
                  )}
                </div>
                {/* Meta Information */}
                <div className="space-y-2 absolute bottom-2 right-4">
                  {blog.articles && blog.articles.length > 0 && (
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>
                        {blog.articles.length} article
                        {blog.articles.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSection;
