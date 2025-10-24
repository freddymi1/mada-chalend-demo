"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Users,
  MapPin,
  Heart,
  Filter,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Vehicle } from "@/src/domain/entities/car";
import { useVehicle } from "../providers/admin/VehicleProvider";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../client/loading";
import { useTheme } from "@/src/hooks/useTheme";
import { useLocale } from "next-intl";
import VehicleDetailModal from "./vehicle-detail-modal";

// Vehicle Card Component
const VehicleCard: React.FC<{
  vehicle: Vehicle;
  isDark: boolean;
  deleteVehicle: (id: string) => void;
  onViewDetails: (vehicle: Vehicle) => void;
}> = ({ vehicle, isDark, deleteVehicle, onViewDetails }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const carName = vehicle.name ? JSON.parse(vehicle.name) : "";
  const carDescription = vehicle.description ? JSON.parse(vehicle.description) : "";

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        isDark
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-100"
      }`}
    >
      <div className="relative">
        <img
          src={vehicle.mainImage}
          alt={locale === "fr" ? carName.fr : carName.en}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite
                ? "bg-red-500 text-white"
                : isDark
                ? "bg-gray-800/50 text-white hover:bg-red-500"
                : "bg-white/50 text-gray-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDark ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
            }`}
          >
            {vehicle.type}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {locale === "fr" ? carName.fr : carName.en}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {vehicle.rating}
            </span>
          </div>
        </div>

        <p
          className={`text-sm mb-4 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {locale === "fr" ? carDescription.fr : carDescription.en}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Users
              className={`w-4 h-4 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {vehicle.passengers} passagers
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {vehicle.features.slice(0, 3).map((feature, index) => {
            const text = feature ? JSON.parse(feature) : "";
            return(
              <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full ${
                isDark
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {locale === "fr" ? text.fr : text.en}
            </span>
            )
          })}
          {vehicle.features.length > 3 && (
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                isDark
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              +{vehicle.features.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span
              className={`text-2xl font-bold ${
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
              /jour
            </span>
          </div>
          <button
            
            className="px-6 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Réserver
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onViewDetails(vehicle)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white"
            }`}
          >
            <Eye className="w-4 h-4" />
            Détail
          </button>
          <button
            onClick={() =>
              router.push(`/admin/vehicles/add?edit=true&id=${vehicle?.id}`)
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-gray-700 text-gray-300 hover:bg-green-600 hover:text-white"
                : "bg-gray-100 text-gray-700 hover:bg-green-600 hover:text-white"
            }`}
          >
            <Edit className="w-4 h-4" />
            Éditer
          </button>
          <button
            onClick={() => deleteVehicle(vehicle.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white"
                : "bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Suppr.
          </button>
        </div>
      </div>
    </div>
  );
};

const VehicleScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const locale = useLocale()

  const {
    vehicles,
    handleDelete: deleteVehicle,
    fetchVehicles,
    isLoading
  } = useVehicle();

  const router = useRouter();

  const categories = [
    { id: "cmfrc1gpa0000le04p1d01847", name: "4x4 Premium" },
    { id: "cmfrc1gpa0001le04p1d01847", name: "Pick-up" },
    { id: "cmfrc1gpa0002le04p1d01847", name: "Minibus" },
    { id: "cmfrc1gpa0003le04p1d01847", name: "Bus" },
    { id: "cmfrc1gpa0004le04p1d01847", name: "4x4 Compact" },
  ];
  categories.unshift({ id: "all", name: "Tous" });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles =
    selectedCategory === "all"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.categoryId === selectedCategory);

  const handleViewDetails = (vehicle: Vehicle) => {
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
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1
              className={`text-4xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Nos Véhicules
            </h1>
            <p
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Découvrez notre flotte de véhicules premium
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/vehicles/add?edit=false")}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Ajouter une voiture
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
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
                  ? "bg-blue-600 text-white"
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
                  ? "bg-blue-600 text-white"
                  : isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Vehicle Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
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
                deleteVehicle={deleteVehicle}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

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

        {/* Modal de détail */}
        {selectedVehicle && (
          <VehicleDetailModal
            vehicle={selectedVehicle}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
};

export default VehicleScreen;