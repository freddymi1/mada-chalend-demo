"use client";

import { ChevronLeft, ChevronRight, X, Star, Users, Tag, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

// Interface Vehicle
interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface Vehicle {
  id: string;
  name: string;
  categoryId: string;
  type: string;
  passengers: number;
  pricePerDay: number;
  rating: number;
  mainImage: string;
  detailImages: string[];
  features: string[];
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  categoryRel?: Category;
}

export const ImageModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  vehicle: Vehicle;
  isDark: boolean;
}> = ({ isOpen, onClose, images, vehicle, isDark }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentImageIndex]);

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative z-10 w-full max-w-4xl mx-2 sm:mx-4 rounded-2xl overflow-hidden max-h-[95vh] overflow-y-auto ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* Image Container */}
        <div className="relative aspect-video bg-gray-100">
          <button
            onClick={onClose}
            className={`p-1.5 sm:p-2 absolute top-2 right-2 bg-white/90 rounded-lg transition-colors z-10 ${
              isDark
                ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <img
            src={images[currentImageIndex]}
            alt={`${vehicle.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
         
        </div>

      {/* Header - Section modifiée avec informations détaillées */}
        <div
          className={`flex bg-secondary items-center justify-between p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex-1 space-y-4">
            {/* Titre et rating */}
            <div className="flex items-center justify-between">
              {vehicle.categoryRel && (
                <div className="flex items-center gap-2">
                  <Tag
                    className={`w-5 h-5 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <h1
                    className={`text-xl font-bold ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {vehicle.categoryRel.name}
                  </h1>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {vehicle.rating}
                </span>
              </div>
            </div>

            {/* Prix et type */}
            <div className="flex items-center justify-between">
              <div>
                <span
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  €{vehicle.pricePerDay}
                </span>
                <span
                  className={`text-lg ml-2 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  /jour
                </span>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isDark ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
                }`}
              >
                {vehicle.type}
              </span>
            </div>

            {/* Informations de base */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {vehicle.passengers} passagers
                </span>
              </div>

              

              
            </div>

            {/* Description */}
            <div>
              <p
                className={`text-base leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {vehicle.description}
              </p>
            </div>

            {/* Équipements */}
            <div>
              <h4
                className={`text-sm font-semibold mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Équipements:
              </h4>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full ${
                      isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-2">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Réserver
              </button>
              <button 
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Devis
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};