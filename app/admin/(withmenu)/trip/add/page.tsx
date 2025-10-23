"use client";

import React, { useState } from "react";
import { Plus, X, Upload, Calendar, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCircuit } from "@/components/providers/admin/CircuitProvider";
import { useTrip } from "@/components/providers/admin/TripProvider";

const AddTripPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const {
    formData,
    handleInputChange,
    handleLocalizedInputChange,
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
    formatDuration
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
            <div className="space-y-8">
              {/* Section Titre - Affichage côte à côte */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Titre du Voyage</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre (🇫🇷) *
                    </label>
                    <input
                      type="text"
                      value={formData.title.fr}
                      onChange={(e) => handleLocalizedInputChange('title', 'fr', e.target.value)}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du voyage en 🇫🇷..."
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
                      onChange={(e) => handleLocalizedInputChange('title', 'en', e.target.value)}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Trip name in 🇬🇧..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section Informations de base */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Prix et Durée */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix *
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Durée (Ex: 4) *
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="3"
                        required
                      />
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
                          onChange={(e) => handleLocalizedInputChange('description', 'fr', e.target.value)}
                          className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Description du voyage en 🇫🇷..."
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
                          onChange={(e) => handleLocalizedInputChange('description', 'en', e.target.value)}
                          className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Trip description in 🇬🇧..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Travel dates */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dates de voyage
                    </label>
                    {formData.travelDates.map((date, index) => (
                      <div key={index} className="w-full mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-col lg:flex-row w-full items-center mb-2">
                          <div className="w-full">
                            <label
                              htmlFor={`startDate-${index}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
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
                              className="w-full flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <span className="mx-2 my-2 lg:my-0">à</span>
                          <div className="w-full">
                            <label
                              htmlFor={`endDate-${index}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
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
                              className="flex-1 w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          {formData.travelDates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTravelDate(index)}
                              className="ml-2 mt-2 lg:mt-0 p-2 text-red-600 hover:bg-red-100 rounded-full"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <div className="flex w-full items-center gap-4 mb-2">
                          <div className="w-full">
                            <label
                              htmlFor={`maxPeople-${index}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Participants max
                            </label>
                            <input
                              type="number"
                              id={`maxPeople-${index}`}
                              value={date.maxPeople}
                              onChange={(e) =>
                                handleTravelDatesChange(
                                  index,
                                  "maxPeople",
                                  e.target.value
                                )
                              }
                              className="flex-1 w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
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
                </div>

                <div className="space-y-6">
                  {/* Points forts - Affichage côte à côte */}
                  <div className="bg-gray-50 w-full p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Points Forts / Highlights</h2>
                    {formData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center w-full gap-3 mb-3 border-2 border-gray-200 p-3 rounded-lg">
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium flex-shrink-0">🇫🇷</span>
                            <input
                              type="text"
                              value={highlight.fr}
                              onChange={(e) => handleArrayInputChange(index, 'fr', e.target.value, 'highlights')}
                              className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Point fort en français"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium flex-shrink-0">🇬🇧</span>
                            <input
                              type="text"
                              value={highlight.en}
                              onChange={(e) => handleArrayInputChange(index, 'en', e.target.value, 'highlights')}
                              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Highlight in English"
                            />
                          </div>
                        </div>
                        {formData.included.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, 'included')}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('included')}
                      className="mt-2 inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un élément / Add Item
                    </button>
                    

                    <div className="bg-gray-50 w-full p-4 rounded-lg">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Non inclus / Not Included</h2>
                      {formData.notIncluded.map((item, index) => (
                        <div key={index} className="flex items-center w-full gap-3 mb-3 border-2 border-gray-200 p-3 rounded-lg">
                          {/* Conteneur pour les inputs - prend toute la largeur */}
                          <div className="flex flex-col gap-2 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium flex-shrink-0">🇫🇷</span>
                              <input
                                type="text"
                                value={item.fr}
                                onChange={(e) => handleArrayInputChange(index, 'fr', e.target.value, 'notIncluded')}
                                className="flex-1 min-w-0 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Élément non inclus en français"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium flex-shrink-0">🇬🇧</span>
                              <input
                                type="text"
                                value={item.en}
                                onChange={(e) => handleArrayInputChange(index, 'en', e.target.value, 'notIncluded')}
                                className="flex-1 min-w-0 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Not included item in English"
                              />
                            </div>
                          </div>
                          
                          {/* Bouton de suppression compact */}
                          {formData.notIncluded.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem(index, 'notIncluded')}
                              className="flex-shrink-0 p-1 bg-red-600 cursor-pointer text-white hover:bg-red-700 rounded-full transition-colors duration-200 mt-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('notIncluded')}
                        className="mt-2 inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter un élément / Add Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Programme - Affichage côte à côte */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Programme / Itinerary</h2>
                </div>

                {formData.program.length === 0 ? (
                  <div className="text-center py-6 bg-white rounded-lg border border-dashed border-gray-300">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Aucun programme ajouté / No itinerary added</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.program.map((day, index) => (
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
                            onClick={() => removeProgramDay(index)}
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
                              onChange={(e) => handleProgramChange(index, 'title', 'fr', e.target.value)}
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
                              onChange={(e) => handleProgramChange(index, 'title', 'en', e.target.value)}
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
                              onChange={(e) => handleProgramChange(index, 'description', 'fr', e.target.value)}
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
                              onChange={(e) => handleProgramChange(index, 'description', 'en', e.target.value)}
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
                              onChange={(e) => handleProgramChange(index, 'imageDescription', 'fr', e.target.value)}
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
                              onChange={(e) => handleProgramChange(index, 'imageDescription', 'en', e.target.value)}
                              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Image description in English..."
                            />
                          </div>
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
                                  onClick={() => handleProgramChange(index, 'image', 'fr', '')}
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
                    onClick={addProgramDay}
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
                  : isUpdate === "true"
                  ? "Mettre à jour le voyage / Update Trip"
                  : "Ajouter le voyage / Add Trip"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTripPage;