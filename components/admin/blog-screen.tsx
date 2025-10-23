"use client";

import { useTheme } from "@/src/hooks/useTheme";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  FileText,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useBlog } from "../providers/admin/BlogProvider";
import { useLocale } from "next-intl";

const BlogScreen = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  const { addedBlogs, fetchBlogs, handleDelete, isLoading } = useBlog();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const locale = useLocale()

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = (id: string) => {
    handleDelete(id);
    setDeleteConfirm(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-slate-50 to-indigo-50"
      }`}
    >
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1
              className={`text-4xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Gestion des blogs
            </h1>
            <p
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Découvrez nos blogs ({addedBlogs.length})
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/blog/add?edit=false")}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium transition-colors shadow-lg mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5" />
            Ajouter un blog
          </button>
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
            <p
              className={`mb-6 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {addedBlogs.map((blog) => {
              const title = JSON.parse(blog.title as any);
              // const description = JSON.parse(blog.description as any);
              return(
                <div
                key={blog.id}
                className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Blog Image */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={title?.fr || "Blog Image"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="p-6">
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

                  

                  {/* Meta Information */}
                  <div className="space-y-2 mb-4">
                    {blog.author && (
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span>{blog.author}</span>
                      </div>
                    )}

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

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/blog/${blog.id}?view=true`)
                      }
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Voir</span>
                    </button>

                    <button
                      onClick={() =>
                        router.push(
                          `/admin/blog/add?edit=true&id=${blog.id}`
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm font-medium">Modifier</span>
                    </button>

                    <button
                      onClick={() => handleDeleteClick(blog.id)}
                      className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-xl p-6 max-w-md w-full ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Confirmer la suppression
            </h3>
            <p
              className={`mb-6 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Êtes-vous sûr de vouloir supprimer ce blog ? Cette action est
              irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Annuler
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogScreen;