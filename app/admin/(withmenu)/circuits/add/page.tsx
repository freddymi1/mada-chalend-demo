"use client";

import React, { useState } from "react";
import { Plus, X, Upload, Calendar, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCircuit } from "@/components/providers/admin/CircuitProvider";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  image: string;
  imageDescription: string;
}

const AddCircuit = () => {
  const router = useRouter();
  const {
    formData,
    handleInputChange,
    handleArrayInputChange,
    addArrayItem,
    removeArrayItem,
    handleItineraryChange,
    addItineraryDay,
    removeItineraryDay,
    handleImageUpload,
    handleSubmit,
    isLoading,
  } = useCircuit();

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
              Ajouter un Nouveau Circuit
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre du circuit
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du circuit..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Durée
                      </label>
                      <input
                        type="text"
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
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Participants max
                      </label>
                      <input
                        type="number"
                        name="maxPeople"
                        value={formData.maxPeople}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="8"
                        required
                      />
                    </div> */}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description du circuit..."
                      required
                    />
                  </div>

                  {/* Points forts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points forts
                    </label>
                    {formData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) =>
                            handleArrayInputChange(
                              index,
                              e.target.value,
                              "highlights"
                            )
                          }
                          className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Point fort..."
                        />
                        {formData.highlights.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, "highlights")}
                            className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded-full"
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
                      Ajouter un point fort
                    </button>
                  </div>

                  {/* Inclus / Non inclus */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inclus dans le prix
                      </label>
                      {formData.included.map((item, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              handleArrayInputChange(
                                index,
                                e.target.value,
                                "included"
                              )
                            }
                            className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Élément inclus..."
                          />
                          {formData.included.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem(index, "included")}
                              className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded-full"
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
                        Ajouter un élément
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Non inclus dans le prix
                      </label>
                      {formData.notIncluded.map((item, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              handleArrayInputChange(
                                index,
                                e.target.value,
                                "notIncluded"
                              )
                            }
                            className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Élément non inclus..."
                          />
                          {formData.notIncluded.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem(index, "notIncluded")
                              }
                              className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded-full"
                            >
                              <X className="w-5 h-5" />
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
                        Ajouter un élément
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {/* Itinéraire */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Itinéraire
                    </label>
                  </div>

                  {formData.itinerary.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        Aucun jour d'itinéraire ajouté
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.itinerary.map((day, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-end items-center mb-3">
                            {/* <h4 className="font-medium text-gray-900">
                              Jour {day.day}
                            </h4> */}
                            <button
                              type="button"
                              onClick={() => removeItineraryDay(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Titre
                              </label>
                              <input
                                type="text"
                                value={day.title}
                                onChange={(e) =>
                                  handleItineraryChange(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Titre du jour..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description de l'image
                              </label>
                              <input
                                type="text"
                                value={day.imageDescription}
                                onChange={(e) =>
                                  handleItineraryChange(
                                    index,
                                    "imageDescription",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Description de l'image..."
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={day.description}
                              onChange={(e) =>
                                handleItineraryChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Description des activités..."
                            />
                          </div>

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
                                    onClick={() =>
                                      handleItineraryChange(index, "image", "")
                                    }
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
                                    onChange={(e) =>
                                      handleImageUpload(index, e)
                                    }
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
                </div>
                <div className="flex justify-end my-6">
                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter un jour
                  </button>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                {isLoading ? "Loading..." : "Ajouter le Circuit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCircuit;
