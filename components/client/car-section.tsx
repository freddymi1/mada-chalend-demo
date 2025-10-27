"use client";

import { Vehicle } from "@/src/domain/entities/car";
import React, { useState, useEffect } from "react";
import { useClVehicle } from "../providers/client/ClVehicleProvider";
import { ImageModal } from "./image-modale";
import { VehicleCard } from "./vehicle-card";
import { LoadingSpinner } from "./loading";
import { useTranslations } from "next-intl";
import { VehicleDTO } from "@/src/domain/entities/vehicle";
import AnimateLoading from "./animate-loading";
import { useCiCategory } from "../providers/client/CiCategoryProvider";

const Grid = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x="3"
      y="3"
      width="7"
      height="7"
    />
    <rect
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x="14"
      y="3"
      width="7"
      height="7"
    />
    <rect
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x="14"
      y="14"
      width="7"
      height="7"
    />
    <rect
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x="3"
      y="14"
      width="7"
      height="7"
    />
  </svg>
);

const List = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <line
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x1="8"
      y1="6"
      x2="21"
      y2="6"
    />
    <line
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x1="8"
      y1="12"
      x2="21"
      y2="12"
    />
    <line
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x1="8"
      y1="18"
      x2="21"
      y2="18"
    />
    <line
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x1="3"
      y1="6"
      x2="3.01"
      y2="6"
    />
    <line
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x1="3"
      y1="12"
      x2="3.01"
      y2="12"
    />
    <line
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x1="3"
      y1="18"
      x2="3.01"
      y2="18"
    />
  </svg>
);

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

const CarSection: React.FC = () => {
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDTO | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("lng");

  const { vehicles, isLoading, fetchVehicles } = useClVehicle();
  const {
    categories,
    fetchCategories,
    loading,
  } = useCiCategory();

  // Add "All" option to categories
  const categoryOptions = [{ id: "all", name: "Tous" }, ...categories];

  useEffect(() => {
    fetchVehicles();
    fetchCategories();
  }, []);

  const filteredVehicles =
    selectedCategory === "all"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.categoryId === selectedCategory);

  const handleShowDetails = (vehicle: VehicleDTO) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-slate-50 to-indigo-50"
      }`}
    >
      {isLoading && loading ? (
        <AnimateLoading />
      ) : (
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1
                className={`text-4xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("car.title")}
              </h1>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("car.description")}
              </p>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-white"
                      : isDark
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isDark={isDark}
                onShowDetails={handleShowDetails}
              />
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div
              className={`text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <p className="text-lg">
                Aucun véhicule trouvé pour cette catégorie.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Modal */}
      {selectedVehicle && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          images={selectedVehicle.detailImages}
          vehicle={selectedVehicle}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default CarSection;
