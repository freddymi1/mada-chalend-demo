"use client";

import React, { useState } from "react";
import { Plus, X, Upload, Calendar, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCircuit } from "@/components/providers/admin/CircuitProvider";
import { useTrip } from "@/components/providers/admin/TripProvider";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  image: string;
  imageDescription: string;
}

const AddTripPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const {
    formData,
    handleInputChange,
    handleArrayInputChange,
    addArrayItem,
    addProgramDay,
    handleDelete,
    handleProgramChange,
    removeProgramDay,
    removeArrayItem,
    handleImageUpload,
    handleSubmit,
    isLoading,
    isUpdate,
    handleUpdate,
    handleTravelDatesChange,
    addTravelDate,
    removeTravelDate,
  } = useTrip();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdate && id) {
      await handleUpdate(id);
    } else {
      await handleSubmit(e);
    }
  };

  console.log("IS UPDATE:", isUpdate);

  // Add this helper function at the top of your component
  const formatDateForInput = (date: any): string => {
    if (!date) return "";

    // If it's a string, parse it and format
    if (typeof date === "string") {
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) return "";
      return parsed.toISOString().split("T")[0];
    }

    // If it's a Date object
    if (date instanceof Date) {
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    }

    return "";
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
              {isUpdate === "true"
                ? "Modifier le voyage"
                : "Ajouter un Nouveau Voyage"}
            </h1>
          </div>

          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre du voyage
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du voyage..."
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
                    <div>
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
                      placeholder="Description du voyage..."
                      required
                    />
                  </div>

                  {/* Travel dates */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dates de voyage
                    </label>
                    {formData.travelDates.map((date, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <div>
                          <label
                            htmlFor={`startDate-${index}`}
                            className="sr-only"
                          >
                            Date de début
                          </label>
                          <input
                            type="date"
                            id={`startDate-${index}`}
                            value={formatDateForInput(date.startDate)}
                            onChange={(e) =>
                              handleTravelDatesChange(
                                index,
                                "startDate",
                                new Date(e.target.value)
                              )
                            }
                            className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <span className="mx-2">à</span>
                        <div>
                          <label
                            htmlFor={`endDate-${index}`}
                            className="sr-only"
                          >
                            Date de fin
                          </label>
                          <input
                            type="date"
                            id={`endDate-${index}`}
                            value={formatDateForInput(date.endDate)}
                            onChange={(e) =>
                              handleTravelDatesChange(
                                index,
                                "endDate",
                                new Date(e.target.value)
                              )
                            }
                            className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        {formData.travelDates.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTravelDate(index)}
                            className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded-full"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTravelDate}
                      className="mt-2 inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter une date de voyage
                    </button>
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
                      Programmes
                    </label>
                  </div>

                  {formData.program.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Aucun programme ajouté</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.program.map((day, index) => (
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
                              onClick={() => removeProgramDay(index)}
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
                                  handleProgramChange(
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
                                  handleProgramChange(
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
                                handleProgramChange(
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
                                      handleProgramChange(index, "image", "")
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
                    onClick={addProgramDay}
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
                {/* {isLoading ? "Loading..." : "Ajouter le Circuit"} */}
                {isLoading
                  ? "Loading..."
                  : isUpdate === "true"
                  ? "Mettre à jour le voyage"
                  : "Ajouter le voyage"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTripPage;
