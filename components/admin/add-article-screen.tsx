"use client";
import { useTheme } from "@/src/hooks/useTheme";
import { ArrowLeft, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useBlog } from "../providers/admin/BlogProvider";
import ArticleEditor from "./editor";

const AddBlogScreen = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useSearchParams();
  const isUpdate = params.get("edit");
  const id = params.get("id");

  const {
    formData,
    handleInputChange,
    handleArticleChange,
    addArticle,
    removeArticle,
    handleImageUpload,
    handleMainImageUpload,
    handleSubmit,
    handleUpdate,
    isLoading,
  } = useBlog();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdate === "true" && id) {
      handleUpdate(id);
    } else {
      handleSubmit(e);
    }
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
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/admin/blogs")}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1
              className={`text-4xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {isUpdate === "true" ? "Modifier le blog" : "Ajouter un blog"}
            </h1>
            <p
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {isUpdate === "true"
                ? "Modifiez les informations du blog"
                : "Complétez les informations du nouveau blog"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Main Information Card */}
          <div
            className={`rounded-xl p-6 shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Informations générales
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Titre *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Entrez le titre du blog"
                />
              </div>

              {/* Main Image Upload */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Image principale
                </label>
                <div className="flex items-center gap-4">
                  <label
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                      isDark
                        ? "border-gray-600 hover:border-indigo-500 bg-gray-700"
                        : "border-gray-300 hover:border-indigo-500 bg-gray-50"
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                      Logo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.image && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Articles Section */}
          <div
            className={`rounded-xl p-6 shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Article
              </h2>
              <button
                type="button"
                onClick={addArticle}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Ajouter un article
              </button>
            </div>

            <div className="space-y-6">
              {formData.articles.map((article: any, index: any) => (
                <div
                  key={article.id}
                  className={`p-4 rounded-lg border-2 ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Article {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeArticle(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Article Title */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Titre
                      </label>
                      <input
                        type="text"
                        value={article.title || ""}
                        onChange={(e) =>
                          handleArticleChange(index, "title", e.target.value)
                        }
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isDark
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="Titre de l'article"
                      />
                    </div>

                    {/* Caption */}
                    <div>
                      {/* <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Description
                      </label>
                      <textarea
                        value={article.description || ""}
                        onChange={(e) =>
                          handleArticleChange(index, "description", e.target.value)
                        }
                        rows={3}
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isDark
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="Contenu de l'article"
                      /> */}
                      <ArticleEditor
                        article={article}
                        index={index}
                        isDark={isDark}
                        handleArticleChange={handleArticleChange}
                      />
                    </div>

                    {/* Image Description */}
                    {/* <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Legende
                      </label>
                      <input
                        type="text"
                        value={article.caption || ""}
                        onChange={(e) =>
                          handleArticleChange(
                            index,
                            "caption",
                            e.target.value
                          )
                        }
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isDark
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="Caption de l'image"
                      />
                    </div> */}

                    {/* Article Image Upload */}
                    {/* <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Capture d'ecran ou image
                      </label>
                      <div className="flex items-center gap-4">
                        <label
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                            isDark
                              ? "border-gray-500 hover:border-indigo-500 bg-gray-600"
                              : "border-gray-300 hover:border-indigo-500 bg-white"
                          }`}
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Choisir
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                            className="hidden"
                          />
                        </label>
                        {article.image && (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                            <img
                              src={article.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div> */}
                  </div>
                </div>
              ))}

              {formData.articles.length === 0 && (
                <div
                  className={`text-center py-12 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun article ajouté pour le moment</p>
                  <p className="text-sm mt-2">
                    Cliquez sur "Ajouter un article" pour commencer
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/blog")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isDark
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-primary"
              }`}
            >
              {isLoading
                ? "En cours..."
                : isUpdate === "true"
                ? "Mettre à jour"
                : "Créer le blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogScreen;