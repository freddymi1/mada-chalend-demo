"use client";

import React, { useMemo, useState } from "react";
import { Plus, X, Upload, Calendar, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCircuit } from "@/components/providers/admin/CircuitProvider";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useTheme } from "@/src/hooks/useTheme";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AddCircuit = () => {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useTheme();
  const id = params.get("id");
  const {
    formData,
    handleInputChange,
    handleMultilingualChange,
    handleArrayMultilingualChange,
    addArrayItem,
    removeArrayItem,
    handleItineraryChange,
    handleItineraryMultilingualChange,
    addItineraryDay,
    removeItineraryDay,
    handleImageUpload,
    handleSubmit,
    isLoading,
    isUpdate,
    handleUpdate,
    handleItineraryImageChange,
    handleItineraryImageUpload,
    isLoadingUpload,
    handleItineraryImageRemove,
  } = useCircuit();

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }, { size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ align: [] }],
        ["link", "blockquote", "code-block"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "blockquote",
    "code-block",
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdate && id) {
      await handleUpdate(id);
    } else {
      await handleSubmit(e);
    }
  };

  const handleEditorChangeFR = (value: string) => {
    handleMultilingualChange("description", "fr", value);
  };

  const handleEditorChangeEN = (value: string) => {
    handleMultilingualChange("description", "en", value);
  };

  const getTextLength = (html: string) => {
    if (typeof document === "undefined") return 0;
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.length || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 sm:mr-4 w-fit"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
              <span className="text-sm sm:text-base">Retour</span>
            </button>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              {isUpdate ? "Modifier le Circuit" : "Ajouter un Nouveau Circuit"}
            </h1>
          </div>

          <form onSubmit={onSubmit}>
            <div className="space-y-6 sm:space-y-8">
              {/* Section Titre */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Titre du Circuit
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Titre (🇫🇷) *
                    </label>
                    <input
                      type="text"
                      value={formData.title.fr}
                      onChange={(e) =>
                        handleMultilingualChange("title", "fr", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du circuit en français..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Title (🇬🇧) *
                    </label>
                    <input
                      type="text"
                      value={formData.title.en}
                      onChange={(e) =>
                        handleMultilingualChange("title", "en", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Circuit name in English..."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Durée
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="5 jours / 4 nuits"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Prix
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="€850"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Difficulté
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Facile">Facile</option>
                      <option value="Modéré">Modéré</option>
                      <option value="Difficile">Difficile</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Description
                    </h2>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Description (🇫🇷) *
                        </label>
                        {/* <textarea
                          rows={3}
                          value={formData.description.fr}
                          onChange={(e) => handleMultilingualChange("description", "fr", e.target.value)}
                          className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Description du circuit en français..."
                          required
                        /> */}
                        <div
                          className={`relative privacy-editor-wrapper ${
                            isDark ? "dark-mode" : ""
                          }`}
                        >
                          <ReactQuill
                            value={formData.description.fr || ""}
                            onChange={handleEditorChangeFR}
                            modules={modules}
                            formats={formats}
                            className={`rounded-xl border-2 transition-colors `}
                            placeholder="Rédigez votre politique de confidentialité en français..."
                            theme="snow"
                          />
                          <div
                            className={`mt-2 text-xs text-right ${
                              isDark ? "text-gray-500" : "text-slate-400"
                            }`}
                          >
                            {getTextLength(formData.description.fr || "")}{" "}
                            caractères
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Description (🇬🇧) *
                        </label>
                        {/* <textarea
                          rows={3}
                          value={formData.description.en}
                          onChange={(e) =>
                            handleMultilingualChange(
                              "description",
                              "en",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Circuit description in English..."
                          required
                        /> */}
                        <div
                          className={`relative privacy-editor-wrapper ${
                            isDark ? "dark-mode" : ""
                          }`}
                        >
                          <ReactQuill
                            value={formData.description.en || ""}
                            onChange={handleEditorChangeEN}
                            modules={modules}
                            formats={formats}
                            className={`rounded-xl border-2 transition-colors `}
                            placeholder="Rédigez votre politique de confidentialité en français..."
                            theme="snow"
                          />
                          <div
                            className={`mt-2 text-xs text-right ${
                              isDark ? "text-gray-500" : "text-slate-400"
                            }`}
                          >
                            {getTextLength(formData.description.en || "")}{" "}
                            caractères
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Circuit image */}
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Image du circuit
                    </label>
                    {formData.itinereryImage ? (
                      <div className="relative w-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={formData.itinereryImage}
                          alt="Aperçu de l'image"
                          className="w-full object-cover h-40 sm:h-48 lg:h-60"
                        />
                        <button
                          type="button"
                          onClick={handleItineraryImageRemove}
                          className="absolute top-2 right-2 bg-red-500 text-white cursor-pointer rounded-full p-1.5 hover:bg-red-600 shadow-lg"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                        <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                        {isLoadingUpload ? (
                          <span className="text-xs sm:text-sm text-gray-500 mt-1">
                            Uploading...
                          </span>
                        ) : (
                          <span className="text-xs sm:text-sm text-gray-500 mt-1">
                            Upload
                          </span>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleItineraryImageUpload(e)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Points forts */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Points Forts / Highlights
                </h2>
                <div className="space-y-3">
                  {formData.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border-2 border-gray-200 p-3 rounded-lg"
                    >
                      <div className="flex flex-col gap-2 flex-1 w-full min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-medium flex-shrink-0">
                            🇫🇷
                          </span>
                          <input
                            type="text"
                            value={highlight.fr}
                            onChange={(e) =>
                              handleArrayMultilingualChange(
                                index,
                                "fr",
                                e.target.value,
                                "highlights"
                              )
                            }
                            className="flex-1 min-w-0 px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Point fort en français"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-medium flex-shrink-0">
                            🇬🇧
                          </span>
                          <input
                            type="text"
                            value={highlight.en}
                            onChange={(e) =>
                              handleArrayMultilingualChange(
                                index,
                                "en",
                                e.target.value,
                                "highlights"
                              )
                            }
                            className="flex-1 min-w-0 px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Highlight in English"
                          />
                        </div>
                      </div>
                      {formData.highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, "highlights")}
                          className="flex-shrink-0 p-2 text-red-600 hover:bg-red-100 rounded-full self-end sm:self-auto"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem("highlights")}
                  className="mt-3 inline-flex items-center px-3 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Ajouter un point fort
                </button>
              </div>

              {/* Inclus / Non inclus */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Inclus dans le prix
                  </h2>
                  <div className="space-y-3">
                    {formData.included.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border-2 border-gray-200 p-3 rounded-lg"
                      >
                        <div className="flex flex-col gap-2 flex-1 w-full min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-medium flex-shrink-0">
                              🇫🇷
                            </span>
                            <input
                              type="text"
                              value={item.fr}
                              onChange={(e) =>
                                handleArrayMultilingualChange(
                                  index,
                                  "fr",
                                  e.target.value,
                                  "included"
                                )
                              }
                              className="flex-1 min-w-0 px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Élément inclus"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-medium flex-shrink-0">
                              🇬🇧
                            </span>
                            <input
                              type="text"
                              value={item.en}
                              onChange={(e) =>
                                handleArrayMultilingualChange(
                                  index,
                                  "en",
                                  e.target.value,
                                  "included"
                                )
                              }
                              className="flex-1 min-w-0 px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Included item"
                            />
                          </div>
                        </div>
                        {formData.included.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, "included")}
                            className="flex-shrink-0 p-2 text-red-600 hover:bg-red-100 rounded-full self-end sm:self-auto"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem("included")}
                    className="mt-3 inline-flex items-center px-3 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Ajouter un élément
                  </button>
                </div>

                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Non inclus
                  </h2>
                  <div className="space-y-3">
                    {formData.notIncluded.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border-2 border-gray-200 p-3 rounded-lg"
                      >
                        <div className="flex flex-col gap-2 flex-1 w-full min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-medium flex-shrink-0">
                              🇫🇷
                            </span>
                            <input
                              type="text"
                              value={item.fr}
                              onChange={(e) =>
                                handleArrayMultilingualChange(
                                  index,
                                  "fr",
                                  e.target.value,
                                  "notIncluded"
                                )
                              }
                              className="flex-1 min-w-0 px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Élément non inclus"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-medium flex-shrink-0">
                              🇬🇧
                            </span>
                            <input
                              type="text"
                              value={item.en}
                              onChange={(e) =>
                                handleArrayMultilingualChange(
                                  index,
                                  "en",
                                  e.target.value,
                                  "notIncluded"
                                )
                              }
                              className="flex-1 min-w-0 px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Not included item"
                            />
                          </div>
                        </div>
                        {formData.notIncluded.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem(index, "notIncluded")
                            }
                            className="flex-shrink-0 p-2 text-red-600 hover:bg-red-100 rounded-full self-end sm:self-auto"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem("notIncluded")}
                    className="mt-3 inline-flex items-center px-3 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Ajouter un élément
                  </button>
                </div>
              </div>

              {/* Itinéraire */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Itinéraire / Itinerary
                  </h2>
                </div>

                {formData.itinerary.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 bg-white rounded-lg border border-dashed border-gray-300">
                    <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm sm:text-base text-gray-600">
                      Aucun jour d'itinéraire ajouté
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {formData.itinerary.map((day, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 sm:p-4 bg-white"
                      >
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                          <h4 className="text-sm sm:text-base font-medium text-gray-900">
                            Jour {day.day} / Day {day.day}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>

                        {/* Titre du jour */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              Titre (🇫🇷) *
                            </label>
                            <input
                              type="text"
                              value={day.title.fr}
                              onChange={(e) =>
                                handleItineraryMultilingualChange(
                                  index,
                                  "title",
                                  "fr",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Titre du jour..."
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              Title (🇬🇧) *
                            </label>
                            <input
                              type="text"
                              value={day.title.en}
                              onChange={(e) =>
                                handleItineraryMultilingualChange(
                                  index,
                                  "title",
                                  "en",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Day title..."
                              required
                            />
                          </div>
                        </div>

                        {/* Description du jour */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              Description (🇫🇷) *
                            </label>
                            <textarea
                              rows={3}
                              value={day.description.fr}
                              onChange={(e) =>
                                handleItineraryMultilingualChange(
                                  index,
                                  "description",
                                  "fr",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Description des activités..."
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              Description (🇬🇧) *
                            </label>
                            <textarea
                              rows={3}
                              value={day.description.en}
                              onChange={(e) =>
                                handleItineraryMultilingualChange(
                                  index,
                                  "description",
                                  "en",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Activities description..."
                              required
                            />
                          </div>
                        </div>

                        {/* Description de l'image */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              Description de l'image (🇫🇷)
                            </label>
                            <input
                              type="text"
                              value={day.imageDescription.fr}
                              onChange={(e) =>
                                handleItineraryMultilingualChange(
                                  index,
                                  "imageDescription",
                                  "fr",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Description de l'image..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              Image Description (🇬🇧)
                            </label>
                            <input
                              type="text"
                              value={day.imageDescription.en}
                              onChange={(e) =>
                                handleItineraryMultilingualChange(
                                  index,
                                  "imageDescription",
                                  "en",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Image description..."
                            />
                          </div>
                        </div>

                        {/* Distance */}
                        {/* <div className="mb-3 sm:mb-4">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Distance (km)
                          </label>
                          <input
                            type="number"
                            value={day.distance}
                            onChange={(e) => handleItineraryChange(index, "distance", e.target.value)}
                            className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Distance..."
                          />
                        </div> */}

                        {/* Upload d'image */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Image
                          </label>
                          <div className="flex items-center gap-3 sm:gap-4">
                            {day.image ? (
                              <div className="relative flex-shrink-0">
                                <img
                                  src={day.image}
                                  alt="Preview"
                                  className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleItineraryChange(index, "image", "")
                                  }
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                                >
                                  <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 flex-shrink-0">
                                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(index, e)}
                                />
                              </label>
                            )}
                            <span className="text-xs sm:text-sm text-gray-500">
                              JPEG, PNG ou GIF
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end mt-3 sm:mt-4">
                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Ajouter un jour
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200 mt-6 sm:mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:flex-1 px-4 py-2.5 text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Annuler / Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:flex-1 px-4 py-2.5 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
              >
                {isLoading
                  ? "Loading..."
                  : isUpdate
                  ? "Mettre à jour"
                  : "Ajouter circuit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCircuit;
