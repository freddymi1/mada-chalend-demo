"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Plus,
  Car,
  Users,
  Star,
  Euro,
  Tag,
  FileText,
  Save,
  ArrowLeft,
  Camera,
  Trash2,
  Loader,
} from "lucide-react";
import { useVehicle } from "../providers/admin/VehicleProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategory } from "../providers/admin/CategoryProvider";

// Theme hook
const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return { isDark, setIsDark };
};

const AddVehicleScreen: React.FC = () => {
  const { isDark } = useTheme();
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const {
    formData,
    setFormData,
    handleInputChange,
    handleMultilingualChange,
    handleArrayMultilingualChange,
    addArrayItem,
    removeArrayItem,
    handleImageUpload,
    handleSubmit,
    handleUpdate,
    isLoading,
    isUpdate,
  } = useVehicle();

  const {
    categories,
    fetchCategories,
    loading: categoryLoading,
  } = useCategory();

  const [newFeature, setNewFeature] = useState({ en: "", fr: "" });
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    mainImage: boolean;
    detailImages: boolean[];
  }>({
    mainImage: false,
    detailImages: [false, false, false, false],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const addFeature = () => {
    if (newFeature.en.trim() || newFeature.fr.trim()) {
      // Créer une nouvelle caractéristique avec les deux langues
      const newFeatureItem = {
        en: newFeature.en.trim(),
        fr: newFeature.fr.trim(),
      };

      // Ajouter directement au tableau features
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeatureItem],
      }));

      // Réinitialiser le formulaire
      setNewFeature({ en: "", fr: "" });
    }
  };

  const handleImageClick = async (index: number) => {
    // Créer un input file invisible
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = index === -1 ? false : true;

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // Mettre à jour l'état de loading
        if (index === -1) {
          setImageLoadingStates((prev) => ({ ...prev, mainImage: true }));
        } else {
          setImageLoadingStates((prev) => ({
            ...prev,
            detailImages: prev.detailImages.map((loading, i) =>
              i === index ? true : loading
            ),
          }));
        }

        try {
          await handleImageUpload(index, {
            target: { files },
          } as React.ChangeEvent<HTMLInputElement>);
        } catch (error) {
          console.error("Erreur lors du téléchargement de l'image:", error);
        } finally {
          // Réinitialiser l'état de loading
          if (index === -1) {
            setImageLoadingStates((prev) => ({ ...prev, mainImage: false }));
          } else {
            setImageLoadingStates((prev) => ({
              ...prev,
              detailImages: prev.detailImages.map((loading, i) =>
                i === index ? false : loading
              ),
            }));
          }
        }
      }
    };

    input.click();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.fr.trim() || !formData.name.en.trim()) {
      return;
    }

    if (!formData.type.trim()) {
      return;
    }

    if (!formData.description.fr.trim() || !formData.description.en.trim()) {
      return;
    }

    if (!formData.mainImage) {
      return;
    }

    // Utiliser handleSubmit ou handleUpdate selon le mode
    if (isUpdate && id) {
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
            onClick={() => router.push("/admin/vehicles")}
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
              {isUpdate === "true"
                ? "Modifier le véhicule"
                : "Ajouter un véhicule"}
            </h1>
            <p
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {isUpdate === "true"
                ? "Modifiez les informations du véhicule"
                : "Complétez les informations du nouveau véhicule"}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              {/* Basic Information */}
              <div
                className={`rounded-2xl p-6 ${
                  isDark
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-100"
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Car className="w-6 h-6" />
                  Informations générales
                </h2>

                <div className="space-y-6">
                  {/* Nom du véhicule - FR/EN */}
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Nom du véhicule
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Nom (🇫🇷) *
                        </label>
                        <input
                          type="text"
                          value={formData.name.fr}
                          onChange={(e) =>
                            handleMultilingualChange(
                              "name",
                              "fr",
                              e.target.value
                            )
                          }
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                          placeholder="Ex: Toyota Land Cruiser Prado"
                          required
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Name (🇬🇧) *
                        </label>
                        <input
                          type="text"
                          value={formData.name.en}
                          onChange={(e) =>
                            handleMultilingualChange(
                              "name",
                              "en",
                              e.target.value
                            )
                          }
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                          placeholder="Ex: Toyota Land Cruiser Prado"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Catégorie
                      </label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Type *
                      </label>
                      <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Ex: 4x4 Premium"
                        required
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Nombre de passagers
                      </label>
                      <div className="flex items-center gap-2">
                        <Users
                          className={`w-5 h-5 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <input
                          type="number"
                          name="passengers"
                          min="1"
                          max="20"
                          value={formData.passengers}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Prix par jour (€)
                      </label>
                      <div className="flex items-center gap-2">
                        <Euro
                          className={`w-5 h-5 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <input
                          type="number"
                          name="pricePerDay"
                          min="0"
                          step="0.01"
                          value={formData.pricePerDay}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Note (1-5)
                      </label>
                      <div className="flex items-center gap-2">
                        <Star
                          className={`w-5 h-5 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <input
                          type="number"
                          name="rating"
                          min="1"
                          max="5"
                          step="0.1"
                          value={formData.rating}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div
                className={`rounded-2xl p-6 ${
                  isDark
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-100"
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Tag className="w-6 h-6" />
                  Caractéristiques / Features
                </h2>

                <div className="space-y-4">
                  {/* Liste des caractéristiques */}
                  <div className="space-y-3">
                    {formData.features
                      .filter((f) => f.fr.trim() || f.en.trim())
                      .map((feature, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-4 rounded-lg border ${
                            isDark
                              ? "bg-gray-700 border-gray-600"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">🇫🇷</span>
                              <span
                                className={
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }
                              >
                                {feature.fr || (
                                  <span className="text-gray-500 italic">
                                    Non spécifié
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">🇬🇧</span>
                              <span
                                className={
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }
                              >
                                {feature.en || (
                                  <span className="text-gray-500 italic">
                                    Not specified
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, "features")}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                  {/* Nouvelle caractéristique - FR/EN */}
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Ajouter une caractéristique
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          🇫🇷 Caractéristique
                        </label>
                        <input
                          type="text"
                          value={newFeature.fr}
                          onChange={(e) =>
                            setNewFeature((prev) => ({
                              ...prev,
                              fr: e.target.value,
                            }))
                          }
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addFeature())
                          }
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Ajouter une caractéristique en français..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          🇬🇧 Feature
                        </label>
                        <input
                          type="text"
                          value={newFeature.en}
                          onChange={(e) =>
                            setNewFeature((prev) => ({
                              ...prev,
                              en: e.target.value,
                            }))
                          }
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addFeature())
                          }
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Add a feature in English..."
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  
                </div>
              </div>

              {/* Description */}
              <div
                className={`rounded-2xl p-6 ${
                  isDark
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-100"
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  <FileText className="w-6 h-6" />
                  Description
                </h2>

                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Description du véhicule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Description (🇫🇷) *
                      </label>
                      <textarea
                        value={formData.description.fr}
                        onChange={(e) =>
                          handleMultilingualChange(
                            "description",
                            "fr",
                            e.target.value
                          )
                        }
                        rows={4}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none`}
                        placeholder="Décrivez le véhicule en détail en français..."
                        required
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Description (🇬🇧) *
                      </label>
                      <textarea
                        value={formData.description.en}
                        onChange={(e) =>
                          handleMultilingualChange(
                            "description",
                            "en",
                            e.target.value
                          )
                        }
                        rows={4}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none`}
                        placeholder="Describe the vehicle in detail in English..."
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div
              className={`rounded-2xl p-6 ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-100"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <Camera className="w-6 h-6" />
                Images
              </h2>

              {/* Main Image */}
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-3 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Image principale *
                </label>
                <div
                  onClick={() =>
                    !imageLoadingStates.mainImage && handleImageClick(-1)
                  }
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                    imageLoadingStates.mainImage
                      ? "cursor-wait opacity-60"
                      : "cursor-pointer hover:border-gray-400"
                  } ${isDark ? "border-gray-600" : "border-gray-300"}`}
                >
                  {imageLoadingStates.mainImage ? (
                    <div className="flex flex-col items-center justify-center h-48">
                      <Loader className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Téléchargement en cours...
                      </p>
                    </div>
                  ) : formData.mainImage ? (
                    <div className="relative">
                      <img
                        src={formData.mainImage}
                        alt="Main"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((prev) => ({ ...prev, mainImage: "" }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload
                        className={`w-12 h-12 mx-auto mb-4 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <p
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Cliquez pour choisir l'image principale
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Detail Images */}
              <div>
                <label
                  className={`block text-sm font-medium mb-3 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Images détaillées (jusqu'à 4)
                </label>

                <p
                  className={`text-sm mb-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Cliquez sur chaque cadre pour ajouter une image
                </p>

                {/* Preview Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.detailImages.map((image, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        !imageLoadingStates.detailImages[index] &&
                        handleImageClick(index)
                      }
                      className={`border-2 border-dashed rounded-lg p-4 aspect-square transition-colors ${
                        imageLoadingStates.detailImages[index]
                          ? "cursor-wait opacity-60"
                          : "cursor-pointer hover:border-gray-400"
                      } ${isDark ? "border-gray-600" : "border-gray-300"}`}
                    >
                      {imageLoadingStates.detailImages[index] ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <Loader className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                          <span
                            className={`text-xs text-center ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Chargement...
                          </span>
                        </div>
                      ) : image ? (
                        <div className="relative h-full">
                          <img
                            src={image}
                            alt={`Detail ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newImages = [...formData.detailImages];
                              newImages[index] = "";
                              setFormData((prev) => ({
                                ...prev,
                                detailImages: newImages,
                              }));
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-50">
                          <Camera
                            className={`w-6 h-6 mb-2 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-xs text-center ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Slot {index + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Clear All Button */}
                {formData.detailImages.some((img) => img) && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          detailImages: ["", "", "", ""],
                        }));
                      }}
                      disabled={imageLoadingStates.detailImages.some(
                        (loading) => loading
                      )}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        imageLoadingStates.detailImages.some(
                          (loading) => loading
                        )
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      } ${
                        isDark
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer toutes les images
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                isLoading ||
                imageLoadingStates.mainImage ||
                imageLoadingStates.detailImages.some((loading) => loading)
              }
              className={`flex items-center gap-2 px-8 py-4 rounded-lg font-medium transition-colors shadow-lg ${
                isLoading ||
                imageLoadingStates.mainImage ||
                imageLoadingStates.detailImages.some((loading) => loading)
                  ? "bg-gray-400 cursor-not-allowed"
                  : isUpdate === "true"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-primary hover:bg-primary/90"
              } text-white`}
            >
              <Save className="w-5 h-5" />
              {isLoading ||
              imageLoadingStates.mainImage ||
              imageLoadingStates.detailImages.some((loading) => loading)
                ? "Traitement..."
                : isUpdate === "true"
                ? "Mettre à jour le véhicule"
                : "Enregistrer le véhicule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleScreen;
