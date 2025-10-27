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
  Tag,
  X,
  Save,
} from "lucide-react";
import { Vehicle } from "@/src/domain/entities/car";
import { useVehicle } from "../providers/admin/VehicleProvider";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../client/loading";
import { useTheme } from "@/src/hooks/useTheme";
import { useLocale } from "next-intl";
import VehicleDetailModal from "./vehicle-detail-modal";
import { useCategory, Category } from "../providers/admin/CategoryProvider";

// Category Modal Component
const CategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  category?: Category | null;
  onSave: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  loading: boolean;
}> = ({ isOpen, onClose, isDark, category, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    icon: "Car",
  });
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        icon: category.icon || "Car",
      });
    } else {
      setFormData({
        name: "",
        icon: "Car",
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = () => {
    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Le nom de la catégorie est requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // Error is handled in the parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl transform transition-all ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <Tag className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <h2
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Nom de la catégorie *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
                  : isDark
                  ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                  : "border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              }`}
              placeholder="Ex: 4x4 Premium"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Icon Field */}
          {/* <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Icône (optionnel)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                  : "border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              }`}
              placeholder="Ex: car-suv"
            />
            <p
              className={`mt-2 text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Nom de l'icône Lucide React (ex: "car", "suv", "van")
            </p>
          </div> */}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                isDark
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
                  {category ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Vehicle Card Component (unchanged)
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
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const locale = useLocale()

  const {
    vehicles,
    handleDelete: deleteVehicle,
    fetchVehicles,
    handleUpdate,
    isLoading
  } = useVehicle();

  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    loading: categoryLoading
  } = useCategory();

  const router = useRouter();

  // Add "All" option to categories
  const categoryOptions = [
    { id: "all", name: "Tous" },
    ...categories
  ];

  useEffect(() => {
    fetchVehicles();
    fetchCategories();
  }, []);

  const filteredVehicles =
    selectedCategory === "all"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.categoryId === selectedCategory);

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleCloseVehicleModal = () => {
    setIsVehicleModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleOpenCategoryModal = (category?: Category) => {
    setEditingCategory(category || null);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryData);
    } else {
      await createCategory(categoryData);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (categoryId === "all") return;
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        await deleteCategory(categoryId);
        // If deleted category was selected, switch to "all"
        if (selectedCategory === categoryId) {
          setSelectedCategory("all");
        }
      } catch (error) {
        // Error is handled in the provider
      }
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
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => handleOpenCategoryModal()}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:bg-green-700"
            >
              <Tag className="w-5 h-5" />
              Catégorie
            </button>
            <button
              onClick={() => router.push("/admin/vehicles/add?edit=false")}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium transition-colors shadow-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Ajouter une voiture
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-6">
            {categoryOptions.map((category) => (
              <div key={category.id} className="relative group">
                <button
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
                {category.id !== "all" && (
                  <div className="absolute top-0 right-0 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 -mt-4 -mr-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCategoryModal(category as any);
                      }}
                      className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="hidden lg:flex items-center gap-2">
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
        {isLoading || categoryLoading ? (
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

        {/* Vehicle Detail Modal */}
        {selectedVehicle && (
          <VehicleDetailModal
            vehicle={selectedVehicle}
            isOpen={isVehicleModalOpen}
            onClose={handleCloseVehicleModal}
            isDark={isDark}
          />
        )}

        {/* Category Modal */}
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={handleCloseCategoryModal}
          isDark={isDark}
          category={editingCategory}
          onSave={handleSaveCategory}
          loading={categoryLoading}
        />
      </div>
    </div>
  );
};

export default VehicleScreen;