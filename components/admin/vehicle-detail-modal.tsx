"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Euro,
  MapPin,
  Calendar,
  Shield,
  Zap,
  Wifi,
  Snowflake,
  Music,
  Coffee,
  Utensils,
} from "lucide-react";
import { Vehicle } from "@/src/domain/entities/car";
import { useLocale } from "next-intl";

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  isDark,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const locale = useLocale();

  // Parse les données multilingues
  const carName = JSON.parse(vehicle.name);
  const carDescription = JSON.parse(vehicle.description);
  const features = vehicle.features.map((feature) => JSON.parse(feature));

  const allImages = [vehicle.mainImage, ...vehicle.detailImages].filter(
    (img) => img
  );

  // Réinitialiser l'index d'image quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePreviousImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Icônes pour les features courantes
  const getFeatureIcon = (featureText: string) => {
    const text = featureText.toLowerCase();
    if (text.includes("wifi") || text.includes("wi-fi"))
      return <Wifi className="w-4 h-4" />;
    if (text.includes("climatisation") || text.includes("air condition"))
      return <Snowflake className="w-4 h-4" />;
    if (text.includes("audio") || text.includes("music"))
      return <Music className="w-4 h-4" />;
    if (text.includes("assurance") || text.includes("insurance"))
      return <Shield className="w-4 h-4" />;
    if (text.includes("énergie") || text.includes("power"))
      return <Zap className="w-4 h-4" />;
    if (text.includes("café") || text.includes("coffee"))
      return <Coffee className="w-4 h-4" />;
    if (text.includes("repas") || text.includes("meal"))
      return <Utensils className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div
        className={`relative w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header avec bouton fermer */}
        <div className={`absolute top-4 right-4 z-10 flex gap-2`}>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite
                ? "bg-red-500 text-white"
                : isDark
                ? "bg-gray-800/80 text-white hover:bg-red-500"
                : "bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isDark
                ? "bg-gray-800/80 text-white hover:bg-gray-700"
                : "bg-white/80 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Section Images - Gauche */}
          <div className="lg:w-1/2 relative">
            {/* Image principale */}
            <div className="relative h-64 lg:h-full bg-gray-200 dark:bg-gray-700">
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[currentImageIndex]}
                    alt={locale === "fr" ? carName.fr : carName.en}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation images */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePreviousImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Indicateur d'image */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white scale-125"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Compteur d'images */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {vehicle.rating}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Aucune image disponible
                </div>
              )}
            </div>

            {/* Miniatures */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-blue-500 ring-2 ring-blue-500"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${
                        locale === "fr" ? carName.fr : carName.en
                      } - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section Détails - Droite */}
          <div className="lg:w-1/2 flex flex-col h-full overflow-y-auto">
            <div className="p-6 lg:p-8">
              {/* En-tête */}
              <div className="mb-6">
                <div className="flex flex-col w-full gap-2 mb-2">
                  
                  <h2
                    className={`text-2xl lg:text-3xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {locale === "fr" ? carName.fr : carName.en}
                  </h2>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full font-medium ${
                      isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {vehicle.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <Users
                      className={`w-4 h-4 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      {vehicle.passengers}{" "}
                      {locale === "fr" ? "passagers" : "passengers"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Description
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {locale === "fr" ? carDescription.fr : carDescription.en}
                </p>
              </div>

              {/* Caractéristiques */}
              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Caractéristiques
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isDark
                            ? "bg-gray-600 text-gray-300"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        {getFeatureIcon(
                          locale === "fr" ? feature.fr : feature.en
                        )}
                      </div>
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        {locale === "fr" ? feature.fr : feature.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prix et Réservation */}
              <div
                className={`mt-auto pt-6 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-3xl font-bold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        €{vehicle.pricePerDay}
                      </span>
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        / {locale === "fr" ? "jour" : "day"}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {locale === "fr"
                        ? "Taxes et frais inclus"
                        : "Taxes and fees included"}
                    </p>
                  </div>

                  
                </div>

                {/* Informations supplémentaires */}
                <div
                  className={`grid grid-cols-2 gap-4 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>
                      {locale === "fr"
                        ? "Assurance incluse"
                        : "Insurance included"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {locale === "fr" ? "Retrait flexible" : "Flexible pickup"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
