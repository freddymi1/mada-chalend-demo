"use client";

import React, { useState } from "react";
import { Plus, X, Upload, Calendar, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCircuit } from "@/components/providers/admin/CircuitProvider";

const AddCircuit = () => {
  const router = useRouter();
  const params = useSearchParams();
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
    handleItineraryImageRemove
  } = useCircuit();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdate && id) {
      await handleUpdate(id);
    } else {
      await handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isUpdate ? "Modifier le Circuit" : "Ajouter un Nouveau Circuit"}
            </h1>
          </div>

          <form onSubmit={onSubmit}>
            <div className="space-y-8">
              {/* Section Titre - Affichage côte à côte */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Titre du Circuit</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre (🇫🇷) *
                    </label>
                    <input
                      type="text"
                      value={formData.title.fr}
                      onChange={(e) => handleMultilingualChange("title", "fr", e.target.value)}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du circuit en français..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title (🇬🇧) *
                    </label>
                    <input
                      type="text"
                      value={formData.title.en}
                      onChange={(e) => handleMultilingualChange("title", "en", e.target.value)}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Circuit name in English..."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Durée
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="5 jours / 4 nuits"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="€850"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulté
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Facile">Facile</option>
                        <option value="Modéré">Modéré</option>
                        <option value="Difficile">Difficile</option>
                      </select>
                    </div>
                  </div>

                  {/* Description - Affichage côte à côte */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description (🇫🇷) *
                        </label>
                        <textarea
                          rows={3}
                          value={formData.description.fr}
                          onChange={(e) => handleMultilingualChange("description", "fr", e.target.value)}
                          className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Description du circuit en français..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description (🇬🇧) *
                        </label>
                        <textarea
                          rows={3}
                          value={formData.description.en}
                          onChange={(e) => handleMultilingualChange("description", "en", e.target.value)}
                          className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Circuit description in English..."
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Circuit image */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image du circuit
                    </label>
                    {formData.itinereryImage ? (
                      <div className="relative w-full border-2 border-dashed border-gray-300 rounded-lg">
                        <img
                          src={formData.itinereryImage}
                          alt="Aperçu de l'image"
                          className="mt-2 w-full object-cover h-auto max-h-60 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={handleItineraryImageRemove}
                          className="absolute -top-2 -right-2 bg-red-500 text-white cursor-pointer rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                        <Upload className="w-10 h-10 text-gray-400" />
                        {isLoadingUpload ? (
                          <span className="text-xs text-gray-500 mt-1">Uploading...</span>
                        ) : (
                          <span className="text-xs text-gray-500 mt-1">Upload</span>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e)=>handleItineraryImageUpload(e)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Points forts - Affichage côte à côte */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Points Forts / Highlights</h2>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center w-full gap-3 mb-3 border-2 border-gray-200 p-3 rounded-lg">
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium flex-shrink-0">🇫🇷</span>
                        <input
                          type="text"
                          value={highlight.fr}
                          onChange={(e) => handleArrayMultilingualChange(index, "fr", e.target.value, "highlights")}
                          className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Point fort en français"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium flex-shrink-0">🇬🇧</span>
                        <input
                          type="text"
                          value={highlight.en}
                          onChange={(e) => handleArrayMultilingualChange(index, "en", e.target.value, "highlights")}
                          className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Highlight in English"
                        />
                      </div>
                    </div>
                    {formData.highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, "highlights")}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("highlights")}
                  className="mt-2 inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter un point fort / Add Highlight
                </button>
              </div>

              {/* Inclus / Non inclus - Affichage côte à côte */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Inclus dans le prix / Included</h2>
                  {formData.included.map((item, index) => (
                    <div key={index} className="flex items-center w-full gap-3 mb-3 border-2 border-gray-200 p-3 rounded-lg">
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium flex-shrink-0">🇫🇷</span>
                          <input
                            type="text"
                            value={item.fr}
                            onChange={(e) => handleArrayMultilingualChange(index, "fr", e.target.value, "included")}
                            className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Élément inclus en français"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium flex-shrink-0">🇬🇧</span>
                          <input
                            type="text"
                            value={item.en}
                            onChange={(e) => handleArrayMultilingualChange(index, "en", e.target.value, "included")}
                            className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Included item in English"
                          />
                        </div>
                      </div>
                      {formData.included.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, "included")}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("included")}
                    className="mt-2 inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter un élément / Add Item
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Non inclus / Not Included</h2>
                  {formData.notIncluded.map((item, index) => (
                    <div key={index} className="flex items-center w-full gap-3 mb-3 border-2 border-gray-200 p-3 rounded-lg">
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium flex-shrink-0">🇫🇷</span>
                          <input
                            type="text"
                            value={item.fr}
                            onChange={(e) => handleArrayMultilingualChange(index, "fr", e.target.value, "notIncluded")}
                            className="flex-1 min-w-0 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Élément non inclus en français"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium flex-shrink-0">🇬🇧</span>
                          <input
                            type="text"
                            value={item.en}
                            onChange={(e) => handleArrayMultilingualChange(index, "en", e.target.value, "notIncluded")}
                            className="flex-1 min-w-0 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Not included item in English"
                          />
                        </div>
                      </div>
                      {formData.notIncluded.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, "notIncluded")}
                          className="flex-shrink-0 p-1 bg-red-600 cursor-pointer text-white hover:bg-red-700 rounded-full transition-colors duration-200 mt-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("notIncluded")}
                    className="mt-2 inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter un élément / Add Item
                  </button>
                </div>
              </div>

              {/* Itinéraire - Affichage côte à côte */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Itinéraire / Itinerary</h2>
                </div>

                {formData.itinerary.length === 0 ? (
                  <div className="text-center py-6 bg-white rounded-lg border border-dashed border-gray-300">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Aucun jour d'itinéraire ajouté / No itinerary day added</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.itinerary.map((day, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-900">
                            Jour {day.day} / Day {day.day}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Titre du jour - Affichage côte à côte */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Titre (🇫🇷) *
                            </label>
                            <input
                              type="text"
                              value={day.title.fr}
                              onChange={(e) => handleItineraryMultilingualChange(index, "title", "fr", e.target.value)}
                              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Titre du jour en français..."
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title (🇬🇧) *
                            </label>
                            <input
                              type="text"
                              value={day.title.en}
                              onChange={(e) => handleItineraryMultilingualChange(index, "title", "en", e.target.value)}
                              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Day title in English..."
                              required
                            />
                          </div>
                        </div>

                        {/* Description du jour - Affichage côte à côte */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description (🇫🇷) *
                            </label>
                            <textarea
                              rows={3}
                              value={day.description.fr}
                              onChange={(e) => handleItineraryMultilingualChange(index, "description", "fr", e.target.value)}
                              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Description des activités en français..."
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description (🇬🇧) *
                            </label>
                            <textarea
                              rows={3}
                              value={day.description.en}
                              onChange={(e) => handleItineraryMultilingualChange(index, "description", "en", e.target.value)}
                              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Activities description in English..."
                              required
                            />
                          </div>
                        </div>

                        {/* Description de l'image - Affichage côte à côte */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description de l'image (🇫🇷)
                            </label>
                            <input
                              type="text"
                              value={day.imageDescription.fr}
                              onChange={(e) => handleItineraryMultilingualChange(index, "imageDescription", "fr", e.target.value)}
                              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Description de l'image en français..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Image Description (🇬🇧)
                            </label>
                            <input
                              type="text"
                              value={day.imageDescription.en}
                              onChange={(e) => handleItineraryMultilingualChange(index, "imageDescription", "en", e.target.value)}
                              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Image description in English..."
                            />
                          </div>
                        </div>

                        {/* Distance */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Distance (km)
                          </label>
                          <input
                            type="number"
                            value={day.distance}
                            onChange={(e) =>
                              handleItineraryChange(
                                index,
                                "distance",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Distance..."
                          />
                        </div>

                        {/* Upload d'image */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image
                          </label>
                          <div className="flex items-center space-x-4">
                            {day.image ? (
                              <div className="relative">
                                <img
                                  src={day.image}
                                  alt="Preview"
                                  className="h-16 w-16 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleItineraryChange(index, "image", "")}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                                <Upload className="w-5 h-5 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-1">
                                  Upload
                                </span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(index, e)}
                                />
                              </label>
                            )}
                            <span className="text-sm text-gray-500">
                              JPEG, PNG ou GIF
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="inline-flex items-center px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter un jour / Add Day
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Annuler / Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                {isLoading
                  ? "Loading..."
                  : isUpdate
                  ? "Mettre à jour le Circuit / Update Circuit"
                  : "Ajouter le Circuit / Add Circuit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCircuit;