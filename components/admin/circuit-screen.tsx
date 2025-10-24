"use client";

import { Circuit } from "@/src/domain/entities/circuit";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCircuit } from "../providers/admin/CircuitProvider";
import {
  Armchair,
  Clock,
  Edit,
  Eye,
  Filter,
  MapPin,
  Plus,
  Star,
  Trash2,
  Users,
  X,
  ChevronDown,
} from "lucide-react";
import { LoadingSpinner } from "../client/loading";
import { useLocale } from "next-intl";

const CircuitScreen = () => {
  const locale = useLocale();
  const router = useRouter();
  const [editingCircuit, setEditingCircuit] = useState<Circuit | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const {
    addedCircuits: circuits,
    handleDelete,
    fetchCircuits,
    isLoading,
  } = useCircuit();
  const [filters, setFilters] = useState({
    difficulty: "",
    minPrice: "",
    maxPrice: "",
    minDuration: "",
    maxDuration: "",
    minPeople: "",
    maxPeople: "",
  });

  useEffect(() => {
    const loadCircuit = () => {
      fetchCircuits();
    };
    loadCircuit();
  }, []);

  const getPriceValue = (price: string) => {
    return parseInt(price.replace("€", "").replace(/\s/g, ""));
  };

  const getDurationValue = (duration: string) => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[0]) : 0;
  };

  const filteredCircuits = circuits.filter((circuit) => {
    if (filters.difficulty && circuit.difficulty !== filters.difficulty) {
      return false;
    }

    const priceValue = getPriceValue(circuit.price);
    if (filters.minPrice && priceValue < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && priceValue > parseInt(filters.maxPrice)) {
      return false;
    }

    const durationValue = getDurationValue(circuit.duration);
    if (filters.minDuration && durationValue < parseInt(filters.minDuration)) {
      return false;
    }
    if (filters.maxDuration && durationValue > parseInt(filters.maxDuration)) {
      return false;
    }

    if (filters.minPeople && circuit.maxPeople < parseInt(filters.minPeople)) {
      return false;
    }
    if (filters.maxPeople && circuit.maxPeople > parseInt(filters.maxPeople)) {
      return false;
    }

    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "facile":
        return "bg-green-100 text-green-800";
      case "modéré":
        return "bg-yellow-100 text-yellow-800";
      case "difficile":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (circuit: Circuit) => {
    setEditingCircuit(circuit);
    router.push(`/admin/circuits/add?update=true&id=${circuit.id}`);
  };

  const handleViewCircuitDetail = (circuit: Circuit) => {
    router.push(`/admin/circuits/${circuit.id}`);
  };

  const handleAddCircuit = () => {
    setEditingCircuit(null);
    router.push(`/admin/circuits/add?update=false`);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      difficulty: "",
      minPrice: "",
      maxPrice: "",
      minDuration: "",
      maxDuration: "",
      minPeople: "",
      maxPeople: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Gestion des Circuits
              </h1>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base">
                Gérez vos circuits touristiques Madagascar
              </p>
            </div>
            <div className="flex flex-row w-full sm:w-auto gap-2 sm:gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 font-medium rounded-lg transition-colors duration-200 shadow-sm text-sm ${
                  showFilters || hasActiveFilters
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="whitespace-nowrap">
                  Filtres
                  {hasActiveFilters &&
                    ` (${Object.values(filters).filter((v) => v !== "").length})`}
                </span>
              </button>
              <button
                onClick={handleAddCircuit}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white border-b shadow-sm">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filtres</h3>
            <div className="flex items-center gap-2 sm:gap-3">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
                >
                  Réinitialiser
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Filtre par difficulté */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Difficulté
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) =>
                  handleFilterChange("difficulty", e.target.value)
                }
                className="w-full px-2 sm:px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
              >
                <option value="">Toutes</option>
                <option value="Facile">Facile</option>
                <option value="Modéré">Modéré</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>

            {/* Filtre par prix */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Prix (€)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Filtre par durée */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Durée (jours)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minDuration}
                  onChange={(e) =>
                    handleFilterChange("minDuration", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxDuration}
                  onChange={(e) =>
                    handleFilterChange("maxDuration", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Filtre par participants */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Participants max
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPeople}
                  onChange={(e) =>
                    handleFilterChange("minPeople", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPeople}
                  onChange={(e) =>
                    handleFilterChange("maxPeople", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6 border">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 rounded-full bg-blue-100 flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Total Circuits
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {filteredCircuits.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6 border">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 rounded-full bg-purple-100 flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Circuits Actifs
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {filteredCircuits.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table & Mobile Cards */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Liste des Circuits
              </h2>
              {hasActiveFilters && (
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-gray-600">
                    {filteredCircuits.length} circuit(s)
                  </span>
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 hover:text-blue-800 whitespace-nowrap"
                  >
                    Réinitialiser
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Circuit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durée
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix(€/pers)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réservations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulté
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points Forts
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCircuits.map((circuit) => {
                    const title = circuit.title ? JSON.parse(circuit.title) : "";
                    const description = circuit.description ? JSON.parse(circuit.description) : "";
                    return (
                      <tr
                        key={circuit.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {locale === "fr" ? title.fr : title.en}
                            </div>
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {locale === "fr" ? description.fr : description.en}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            {Number(circuit.duration)} jour(s) / {Number(circuit.duration) - 1} nuit(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {circuit.price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Armchair className="w-4 h-4 mr-2 text-gray-400" />
                            {circuit.totalPersonnesReservees}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                              circuit.difficulty
                            )}`}
                          >
                            {circuit.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {circuit.highlights
                              .slice(0, 3)
                              .map((highlight: any, index: number) => {
                                const text = highlight.text ? JSON.parse(highlight.text) : "";
                                return (
                                  <span
                                    key={highlight.id || index}
                                    className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                                  >
                                    {locale === "fr" ? text.fr : text.en}
                                  </span>
                                );
                              })}
                            {circuit.highlights.length > 3 && (
                              <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                +{circuit.highlights.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-4">
                            <button
                              onClick={() => handleViewCircuitDetail(circuit)}
                              className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(circuit)}
                              className="text-gray-400 cursor-pointer hover:text-green-600 transition-colors duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(circuit.id)}
                              className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card Layout */}
            <div className="lg:hidden">
              {filteredCircuits.map((circuit) => {
                const title = circuit.title ? JSON.parse(circuit.title) : "";
                const description = circuit.description ? JSON.parse(circuit.description) : "";
                return (
                  <div
                    key={circuit.id}
                    className="border-b border-gray-200 last:border-b-0 p-4"
                  >
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                          {locale === "fr" ? title.fr : title.en}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {locale === "fr" ? description.fr : description.en}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ${getDifficultyColor(
                          circuit.difficulty
                        )}`}
                      >
                        {circuit.difficulty}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center text-xs text-gray-600">
                        <Clock className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{Number(circuit.duration)} j / {Number(circuit.duration) - 1} n</span>
                      </div>
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {circuit.price}€/pers
                      </div>
                      <div className="flex items-center text-xs text-gray-600 col-span-2">
                        <Armchair className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {circuit.totalPersonnesReservees} réservations
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {circuit.highlights
                          .slice(0, 2)
                          .map((highlight: any, index: number) => {
                            const text = highlight.text ? JSON.parse(highlight.text) : "";
                            return (
                              <span
                                key={highlight.id || index}
                                className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                              >
                                {locale === "fr" ? text.fr : text.en}
                              </span>
                            );
                          })}
                        {circuit.highlights.length > 2 && (
                          <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{circuit.highlights.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => handleViewCircuitDetail(circuit)}
                        className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </button>
                      <button
                        onClick={() => handleEdit(circuit)}
                        className="flex items-center text-xs text-green-600 hover:text-green-800 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(circuit.id)}
                        className="flex items-center text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {filteredCircuits.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 lg:p-12 text-center">
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters
                  ? "Aucun circuit ne correspond aux filtres"
                  : "Aucun circuit trouvé"}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {hasActiveFilters
                  ? "Essayez de modifier vos critères de filtrage."
                  : "Commencez par ajouter votre premier circuit touristique."}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                >
                  Réinitialiser les filtres
                </button>
              ) : (
                <button
                  onClick={handleAddCircuit}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Ajouter un Circuit
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CircuitScreen;