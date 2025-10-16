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
import { useTranslations } from "next-intl";
import { useAuthClient } from "@/src/hooks/useAuthClient";

const BlogSection = () => {
  const { isDark } = useTheme();
  const t = useTranslations("lng");

  const router = useRouter();
  const { addedBlogs, fetchBlogs, isLoading } = useCiBlog();
  const { user, isAuthenticated } = useAuthClient();

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-slate-50 to-indigo-50"
      }`}
    >
      <div className="px-6 py-8 container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
            {t("blog.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t("blog.subtitle")}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2
              className={`w-8 h-8 animate-spin ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && addedBlogs.length === 0 && (
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
              Aucun blog pour le moment
            </h3>
            <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Commencez par créer votre premier blog
            </p>
            <button
              onClick={() => router.push("/admin/blog/add?edit=false")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Créer un blog
            </button>
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && addedBlogs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {addedBlogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => router.push(`/blog/${blog.id}`)}
                className={`rounded-xl overflow-hidden shadow-lg transition-all relative cursor-pointer duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Blog Image */}
                <div className={`relative h-24 flex items-center justify-center  overflow-hidden ${isDark ? "bg-gray-100" : "bg-gray-500"}`}>
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
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
                    {blog.title}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSection;
