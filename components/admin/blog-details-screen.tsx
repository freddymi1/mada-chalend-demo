"use client";

import { useTheme } from "@/src/hooks/useTheme";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useBlog } from "../providers/admin/BlogProvider";

const BlogDetailScreen = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { blogDetail, getBlogById, handleDelete, isLoading } = useBlog();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      getBlogById(id.toString());
    }
  }, [id]);

  const handleDeleteClick = () => {
    setDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (id) {
      handleDelete(id.toString());
      router.push("/admin/blogs");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        <Loader2
          className={`w-8 h-8 animate-spin ${
            isDark ? "text-indigo-400" : "text-indigo-600"
          }`}
        />
      </div>
    );
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
      <div className="px-6 py-8 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/blog")}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-xl lg:text-4xl font-bold mb-2">
              Detail du blog
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                router.push(`/admin/blog/add?edit=true&id=${blogDetail.id}`)
              }
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </div>

        {/* Main Image */}
        {blogDetail.image && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={blogDetail.image}
              alt={blogDetail.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Blog Header Card */}
        <div
          className={`rounded-xl p-8 shadow-lg mb-8 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Title */}
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {blogDetail.title}
          </h1>

          {/* Subtitle */}
          {blogDetail.subtitle && (
            <p
              className={`text-xl mb-6 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {blogDetail.subtitle}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 mb-6">
            {blogDetail.author && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <User
                  className={`w-4 h-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {blogDetail.author}
                </span>
              </div>
            )}

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

          {/* Description */}
          {blogDetail.description && (
            <div>
              <h2
                className={`text-xl font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Description
              </h2>
              <p
                className={`text-lg leading-relaxed whitespace-pre-wrap ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {blogDetail.description}
              </p>
            </div>
          )}
        </div>

        {/* Articles Section */}
        {blogDetail.articles && blogDetail.articles.length > 0 && (
          <div>
            <h2
              className={`text-3xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Articles
            </h2>

            <div className="space-y-6">
              {blogDetail.articles.map((article: any, index: number) => (
                <div
                  key={article.id}
                  className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="grid p-6 gap-6">
                    {/* Article Number Badge */}
                    <div className="mb-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          isDark
                            ? "bg-indigo-900 text-indigo-300"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        Question {index + 1}
                      </span>
                    </div>
                    {article.title && (
                      <h3
                        className={`text-2xl font-bold mb-4 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {article.title}
                      </h3>
                    )}
                    {/* Article Image */}
                    <div className={`relative h-64 md:h-auto `}>
                      {article.description && (
                        <div className="relative bottom-0 left-0 right-0 rounded-lg bg-opacity-60 p-3">
                          <div
                            className="text-sm"
                            dangerouslySetInnerHTML={{
                              __html: article.description,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Articles State */}
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
              Aucun article
            </h3>
            <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Ce blog ne contient pas encore d'articles
            </p>
            <button
              onClick={() =>
                router.push(`/admin/blog/add?edit=true&id=${blogDetail.id}`)
              }
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              <Edit className="w-5 h-5" />
              Modifier le blog
            </button>
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
            <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Êtes-vous sûr de vouloir supprimer ce blog et tous ses articles ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
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

export default BlogDetailScreen;
