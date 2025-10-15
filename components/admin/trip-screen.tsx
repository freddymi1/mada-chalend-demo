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
import { TripTravel } from "@/src/domain/entities/trip";
import { useTrip } from "../providers/admin/TripProvider";
import { formatDate } from "../client/trip-screen";

const TripScreen = () => {
  const router = useRouter();
  const [editingTrip, setEditingTrip] = useState<TripTravel | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { addedTrips, handleDelete, fetchTrips, isLoading } = useTrip();
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minDuration: "",
    maxDuration: "",
    minPeople: "",
    maxPeople: "",
  });

  useEffect(() => {
    const loadTrip = () => {
      fetchTrips();
    };
    loadTrip();
  }, []);

  // Fonction pour extraire la valeur numérique du prix
  const getPriceValue = (price: string) => {
    return parseInt(price.replace("€", "").replace(/\s/g, ""));
  };

  // Fonction pour extraire la valeur numérique de la durée
 

  // Filtrer les circuits selon les critères sélectionnés
  const filteredTrips = addedTrips.filter((trip) => {
    // Filtre par difficulté

    // Filtre par prix
    const priceValue = getPriceValue(trip.price);
    if (filters.minPrice && priceValue < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && priceValue > parseInt(filters.maxPrice)) {
      return false;
    }

  

    // Filtre par nombre de participants
    if (filters.minPeople && trip.maxPeople < parseInt(filters.minPeople)) {
      return false;
    }
    if (filters.maxPeople && trip.maxPeople > parseInt(filters.maxPeople)) {
      return false;
    }

    return true;
  });

  const handleEdit = (trip: TripTravel) => {
    setEditingTrip(trip);
    router.push(`/admin/trip/add?update=true&id=${trip.id}`);
  };

  const handleViewTripDetail = (trip: TripTravel) => {
    router.push(`/admin/trip/${trip.id}`);
  };

  const handleAddTrip = () => {
    setEditingTrip(null);
    router.push(`/admin/trip/add?update=false`);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Gestion des voyages
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Gérez vos voyages touristiques Madagascar
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors duration-200 shadow-sm ${
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
                onClick={handleAddTrip}
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Ajouter un Voyage</span>
                <span className="sm:hidden">Ajouter</span>
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
                  className="text-sm text-primary hover:text-blue-800"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtre par difficulté */}
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
                  className="w-full px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  className="w-full px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxDuration}
                  onChange={(e) =>
                    handleFilterChange("maxDuration", e.target.value)
                  }
                  className="w-full px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Filtre par participants */}
            {/* <div>
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
                  className="w-full px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPeople}
                  onChange={(e) =>
                    handleFilterChange("maxPeople", e.target.value)
                  }
                  className="w-full px-3 py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div> */}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Voyage
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {filteredTrips.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 rounded-full bg-purple-100">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Voyage Actifs
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {filteredTrips.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table & Mobile Cards */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Liste des Voyages organisés
              </h2>
              {hasActiveFilters && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">
                    {filteredTrips.length} voyage(s) correspondant aux filtres
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
                      Dates
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
                  {filteredTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {trip.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {trip.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {trip.duration}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {trip.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Armchair className="w-4 h-4 mr-2 text-gray-400" />
                          {trip.totalPersonnesReservees}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          {trip.travelDates && trip.travelDates.length > 0 ? (
                            trip.travelDates.map((date: any, index: number) => (
                              <div key={index} className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm text-gray-900">
                                  {formatDate(date.startDate)} →{" "}
                                  {formatDate(date.endDate)}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">
                                  {date.maxPeople} participants max
                                </span>
                                <span className="text-sm text-gray-500 ml-2">
                                  {date.placesDisponibles} places disponibles
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 italic">
                              Aucune date définie
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {trip.highlights
                            .slice(0, 3)
                            .map((highlight: any, index: number) => (
                              <span
                                key={highlight.id || index}
                                className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                              >
                                {highlight.text}
                              </span>
                            ))}
                          {trip.highlights.length > 3 && (
                            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{trip.highlights.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-4">
                          <button
                            onClick={() => handleViewTripDetail(trip)}
                            className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(trip)}
                            className="text-gray-400 cursor-pointer hover:text-green-600 transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(trip.id)}
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

            {/* Mobile/Tablet Card Layout */}
            <div className="lg:hidden">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="border-b border-gray-200 last:border-b-0 p-4 sm:p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                        {trip.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                        {trip.description}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full`}
                    >
                      {trip.startDate}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full`}
                    >
                      {trip.endDate}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-xs sm:text-sm">
                        {trip.duration}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      <span className="text-xs sm:text-sm">{trip.price}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Armchair className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-xs sm:text-sm">
                        {trip.totalPersonnesReservees} réservations
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {trip.highlights
                        .slice(0, 2)
                        .map((highlight: any, index: number) => (
                          <span
                            key={highlight.id || index}
                            className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            {highlight.text}
                          </span>
                        ))}
                      {trip.highlights.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{trip.highlights.length - 2} autres
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => handleViewTripDetail(trip)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Voir</span>
                    </button>
                    <button
                      onClick={() => handleEdit(trip)}
                      className="flex items-center text-sm text-green-600 hover:text-green-800 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Supprimer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredTrips.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-8 sm:p-12 text-center">
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters
                  ? "Aucun circuit ne correspond aux filtres"
                  : "Aucun circuit trouvé"}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                {hasActiveFilters
                  ? "Essayez de modifier vos critères de filtrage."
                  : "Commencez par ajouter votre premier circuit touristique."}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
                >
                  Réinitialiser les filtres
                </button>
              ) : (
                <button
                  onClick={handleAddTrip}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Ajouter un voyage
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripScreen;
