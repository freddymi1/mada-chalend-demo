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
} from "lucide-react";

const CircuitScreen = () => {
  const router = useRouter();
  const [editingCircuit, setEditingCircuit] = useState<Circuit | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { addedCircuits: circuits, handleDelete, fetchCircuits } = useCircuit();
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

  // Fonction pour extraire la valeur numérique du prix
  const getPriceValue = (price: string) => {
    return parseInt(price.replace("€", "").replace(/\s/g, ""));
  };

  // Fonction pour extraire la valeur numérique de la durée
  const getDurationValue = (duration: string) => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[0]) : 0;
  };

  // Filtrer les circuits selon les critères sélectionnés
  const filteredCircuits = circuits.filter((circuit) => {
    // Filtre par difficulté
    if (filters.difficulty && circuit.difficulty !== filters.difficulty) {
      return false;
    }

    // Filtre par prix
    const priceValue = getPriceValue(circuit.price);
    if (filters.minPrice && priceValue < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && priceValue > parseInt(filters.maxPrice)) {
      return false;
    }

    // Filtre par durée
    const durationValue = getDurationValue(circuit.duration);
    if (filters.minDuration && durationValue < parseInt(filters.minDuration)) {
      return false;
    }
    if (filters.maxDuration && durationValue > parseInt(filters.maxDuration)) {
      return false;
    }

    // Filtre par nombre de participants
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

    router.push(`/admin/circuits/edit/${circuit.id}`);
  };

  const handleViewCircuitDetail = (circuit: Circuit) => {
    router.push(`/admin/circuits/${circuit.id}`);
  };

  const handleAddCircuit = () => {
    setEditingCircuit(null);

    router.push(`/admin/circuits/add`);
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
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des Circuits
              </h1>
              <p className="text-gray-600 mt-1">
                Gérez vos circuits touristiques Madagascar
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors duration-200 shadow-sm ${
                  showFilters || hasActiveFilters
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtres{" "}
                {hasActiveFilters &&
                  `(${Object.values(filters).filter((v) => v !== "").length})`}
              </button>
              <button
                onClick={handleAddCircuit}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un Circuit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-white border-b shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
            <div className="flex space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Réinitialiser
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtre par difficulté */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulté
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) =>
                  handleFilterChange("difficulty", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes</option>
                <option value="Facile">Facile</option>
                <option value="Modéré">Modéré</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>

            {/* Filtre par prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (€)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filtre par durée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (jours)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minDuration}
                  onChange={(e) =>
                    handleFilterChange("minDuration", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxDuration}
                  onChange={(e) =>
                    handleFilterChange("maxDuration", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filtre par participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participants max
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPeople}
                  onChange={(e) =>
                    handleFilterChange("minPeople", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPeople}
                  onChange={(e) =>
                    handleFilterChange("maxPeople", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Circuits
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredCircuits.length}
                </p>
              </div>
            </div>
          </div>
          
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Circuits Actifs
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredCircuits.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Circuits Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Liste des Circuits
            </h2>
            {hasActiveFilters && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">
                  {filteredCircuits.length} circuit(s) correspondant aux filtres
                </span>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
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
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
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
                {filteredCircuits.map((circuit) => (
                  <tr
                    key={circuit.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {circuit.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {circuit.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {circuit.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {circuit.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {circuit.maxPeople} max
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
                          .map((highlight: any, index: number) => (
                            <span
                              key={highlight.id || index}
                              className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {highlight.text}
                            </span>
                          ))}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCircuits.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters
                ? "Aucun circuit ne correspond aux filtres"
                : "Aucun circuit trouvé"}
            </h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters
                ? "Essayez de modifier vos critères de filtrage."
                : "Commencez par ajouter votre premier circuit touristique."}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Réinitialiser les filtres
              </button>
            ) : (
              <button
                onClick={handleAddCircuit}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un Circuit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CircuitScreen;
