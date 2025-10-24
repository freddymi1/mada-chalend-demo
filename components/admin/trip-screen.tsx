"use client";

import { Circuit } from "@/src/domain/entities/circuit";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
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
import { useLocale, useTranslations } from "next-intl";

const TripScreen = () => {
  const router = useRouter();
  const locale = useLocale();
  
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

  const getPriceValue = (price: string) => {
    return parseInt(price.replace("€", "").replace(/\s/g, ""));
  };

  const filteredTrips = addedTrips.filter((trip) => {
    const priceValue = getPriceValue(trip.price);
    if (filters.minPrice && priceValue < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && priceValue > parseInt(filters.maxPrice)) {
      return false;
    }

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Gestion des voyages
              </h1>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base">
                Gérez vos voyages touristiques Madagascar
              </p>
            </div>
            <div className="flex flex-row w-full sm:w-auto gap-2 sm:gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm ${
                  showFilters || hasActiveFilters
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="truncate">
                  Filtres{" "}
                  {hasActiveFilters &&
                    `(${Object.values(filters).filter((v) => v !== "").length})`}
                </span>
              </button>
              <button
                onClick={handleAddTrip}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="truncate">Ajouter</span>
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
                  className="text-xs sm:text-sm text-primary hover:text-blue-800 font-medium"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {/* Filtre par prix */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Filtre par durée */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxDuration}
                  onChange={(e) =>
                    handleFilterChange("maxDuration", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border text-slate-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6 border">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 rounded-full bg-blue-100 flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Total Voyage
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {filteredTrips.length}
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
                    Voyage Actifs
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {filteredTrips.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table & Mobile Cards */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Liste des Voyages organisés
              </h2>
              {hasActiveFilters && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {filteredTrips.length} voyage(s) trouvé(s)
                  </span>
                  <button
                    onClick={resetFilters}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
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
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Circuit
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durée
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix(€/pers)
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réservations
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points Forts
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTrips.map((trip) => {
                    const title = JSON.parse(trip.title);
                    const description = JSON.parse(trip.description);
                    return (
                      <tr
                        key={trip.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-4 xl:px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {locale === "fr" ? title.fr : title.en}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                              {locale === "fr" ? description.fr : description.en}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-xs sm:text-sm text-gray-900">
                            <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{Number(trip.duration)} j / {Number(trip.duration) - 1} n</span>
                          </div>
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">
                            {trip.price}
                          </div>
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-xs sm:text-sm text-gray-900">
                            <Armchair className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            {trip.totalPersonnesReservees}
                          </div>
                        </td>
                        <td className="px-4 xl:px-6 py-4">
                          <div className="flex flex-col gap-1 sm:gap-2 max-w-sm">
                            {trip.travelDates && trip.travelDates.length > 0 ? (
                              trip.travelDates.map((date: any, index: number) => (
                                <div key={index} className="flex flex-col xl:flex-row xl:items-center gap-1">
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                                    <span className="text-xs text-gray-900 whitespace-nowrap">
                                      {formatDate(date.startDate)} → {formatDate(date.endDate)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 pl-4 xl:pl-2">
                                    <span className="whitespace-nowrap">{date.maxPeople} max</span>
                                    <span className="whitespace-nowrap">{date.placesDisponibles} dispo</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500 italic">
                                Aucune date
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 xl:px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {trip.highlights
                              .slice(0, 3)
                              .map((highlight: any, index: number) => {
                                const text = JSON.parse(highlight.text);
                                return (
                                  <span
                                    key={highlight.id || index}
                                    className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded truncate max-w-full"
                                  >
                                    {locale === "fr" ? text.fr : text.en}
                                  </span>
                                );
                              })}
                            {trip.highlights.length > 3 && (
                              <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                +{trip.highlights.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2 sm:gap-4">
                            <button
                              onClick={() => handleViewTripDetail(trip)}
                              className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                              title="Voir"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(trip)}
                              className="text-gray-400 cursor-pointer hover:text-green-600 transition-colors duration-200"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(trip.id)}
                              className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-200"
                              title="Supprimer"
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
              {filteredTrips.map((trip) => {
                const title = JSON.parse(trip.title);
                const description = JSON.parse(trip.description);
                return (
                  <div
                    key={trip.id}
                    className="border-b border-gray-200 last:border-b-0 p-4 sm:p-5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0 pr-3">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {locale === "fr" ? title.fr : title.en}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                          {locale === "fr" ? description.fr : description.en}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm truncate">
                          {Number(trip.duration)} jours
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {trip.price}€/pers
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Armchair className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm truncate">
                          {trip.totalPersonnesReservees} rés.
                        </span>
                      </div>
                    </div>

                    {trip.travelDates && trip.travelDates.length > 0 && (
                      <div className="mb-3 text-xs sm:text-sm">
                        <div className="text-gray-700 font-medium mb-1">Dates:</div>
                        {trip.travelDates.map((date: any, index: number) => (
                          <div key={index} className="text-gray-600 mb-1">
                            {formatDate(date.startDate)} → {formatDate(date.endDate)}
                            <span className="text-gray-500 ml-2">
                              ({date.placesDisponibles} places)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {trip.highlights
                          .slice(0, 2)
                          .map((highlight: any, index: number) => {
                            const text = JSON.parse(highlight.text);
                            return (
                              <span
                                key={highlight.id || index}
                                className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded truncate max-w-full"
                              >
                                {locale === "fr" ? text.fr : text.en}
                              </span>
                            );
                          })}
                        {trip.highlights.length > 2 && (
                          <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{trip.highlights.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 sm:gap-4">
                      <button
                        onClick={() => handleViewTripDetail(trip)}
                        className="flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </button>
                      <button
                        onClick={() => handleEdit(trip)}
                        className="flex items-center text-xs sm:text-sm text-green-600 hover:text-green-800 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="flex items-center text-xs sm:text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
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

          {filteredTrips.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 lg:p-12 text-center">
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters
                  ? "Aucun voyage ne correspond aux filtres"
                  : "Aucun voyage trouvé"}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                {hasActiveFilters
                  ? "Essayez de modifier vos critères de filtrage."
                  : "Commencez par ajouter votre premier voyage."}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base hover:bg-blue-700"
                >
                  Réinitialiser les filtres
                </button>
              ) : (
                <button
                  onClick={handleAddTrip}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base hover:bg-blue-700"
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