"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  User,
} from "lucide-react";
import { useAdminBooking } from "../providers/admin/BookingProvider";
import { Reservation } from "@/src/domain/entities/reservation";
import { LoadingSpinner } from "../client/loading";
import { useVehicle } from "../providers/admin/VehicleProvider";

const BookingScreen = () => {
  // Simulation des données de réservation basées sur votre format

  const { bookingData, getAllBokkingData, loading, updateReservation } = useAdminBooking();
  const { handleUpdate, isLoading } = useVehicle();

  const [searchTerm, setSearchTerm] = useState("");
  const [restTypeFilter, setResTypeFilter] = useState("tous");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      await getAllBokkingData();
    };

    loadBooking();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmee":
        return "bg-green-100 text-green-800 border-green-200";
      case "annulee":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_attente":
        return "En attente";
      case "confirmee":
        return "Confirmée";
      case "annulee":
        return "Annulée";
      default:
        return status;
    }
  };

  const filteredReservations = bookingData?.reservations?.filter(
    (reservation: Reservation) => {
      const matchesSearch =
        searchTerm === "" ||
        reservation.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.resType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation?.circuitRel?.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "tous" || reservation.status === statusFilter;

      const reservationFilter =
        restTypeFilter === "tous" || reservation.resType === restTypeFilter;

      return matchesSearch && matchesStatus && reservationFilter;
    }
  );

  const handleValidateBooking = async (id: string) => {
  try {
    const dataRes: Partial<Reservation> = {
      status: "confirmee" as any // Make sure this matches your actual status values
    };
    await updateReservation(id, dataRes as any);
  } catch (error) {
    console.error("Error validating booking:", error);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="w-full">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestion des Réservations
          </h1>
          <p className="text-gray-600">
            Gérez et suivez toutes les réservations de circuits touristiques
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Recherche */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou circuit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Filtres */}

                <div className="flex gap-3">
                  <select
                    value={restTypeFilter}
                    onChange={(e) => setResTypeFilter(e.target.value)}
                    className="px-4 py-3 border text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-w-32"
                  >
                    <option value="tous">Tous les reservations</option>
                    <option value="circuit">Circuit</option>
                    <option value="car">Voiture</option>
                    <option value="trip">Voyage</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-w-32"
                  >
                    <option value="tous">Tous les statuts</option>
                    <option value="en_attente">En attente</option>
                    <option value="confirmee">Confirmée</option>
                    <option value="annulee">Annulée</option>
                  </select>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filtres
                  </button>
                </div>
              </div>

              {/* Statistiques rapides */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {/* {bookingData?.pagination?.totalCount} */}
                    {filteredReservations?.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total réservations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      bookingData?.reservations?.filter(
                        (r: any) => r.status === "en_attente"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">En attente</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {bookingData?.reservations?.reduce(
                      (sum: any, r: any) => sum + r.personnes,
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Personnes au total
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des réservations */}
            <div className="space-y-4">
              {filteredReservations?.map((reservation: any) => (
                <div
                  key={reservation?.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div className="flex items-center gap-4 mb-4 lg:mb-0">
                        <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center">
                          <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {reservation?.prenom} {reservation?.nom}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            Créée le {formatDate(reservation.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            reservation?.status as any
                          )}`}
                        >
                          {getStatusLabel(reservation?.status as any)}
                        </span>

                        <div className="flex gap-2">
                          {reservation.status === "en_attente" && (
                            <button
                              onClick={() =>
                                handleValidateBooking(reservation?.id)
                              }
                              className="p-2 text-gray-400 cursor-pointer hover:text-green-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Informations client */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Informations Client
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {reservation?.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {reservation?.telephone}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {reservation?.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {reservation?.personnes} personne(s)
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {reservation?.nbrAdult} adulte(s)
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {reservation?.nbrChild} enfant(s)
                            </span>
                          </div>

                          {
                            reservation?.nbrAge2_3 > 0 && (
                              <div className="flex items-center gap-3 text-sm">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {reservation?.nbrAge2_3} enfant(s) de 2 à 3 ans
                                </span>
                              </div>
                            )
                          }

                          {reservation?.nbrAge4_7 > 0 && (
                            <div className="flex items-center gap-3 text-sm">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {reservation?.nbrAge4_7} enfant(s) de 4 à 7 ans
                              </span>
                            </div>
                          )}
                          {
                            reservation?.nbrAge8_10 > 0 && (
                              <div className="flex items-center gap-3 text-sm">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {reservation?.nbrAge8_10} enfant(s) de 8 à 10 ans
                                </span>
                              </div>
                            )
                          }
                          {
                            reservation?.nbrAge11 > 0 && (
                              <div className="flex items-center gap-3 text-sm">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {reservation?.nbrAge11} enfant(s) de 11 ans et plus
                                </span>
                              </div>
                            )
                          }
                        </div>
                      </div>

                      {/* Informations voyage */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Détails du Voyage
                        </h4>
                        {reservation.resType === "circuit" ? (
                          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4">
                            <a
                              href={`/admin/circuits/${reservation?.circuitRel?.id}`}
                              className="font-bold text-xl text-indigo-900 mb-2"
                            >
                              {reservation?.circuitRel?.title}
                            </a>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Prix:</span>
                                <span className="font-medium text-green-600">
                                  {reservation?.circuitRel?.price}€
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Difficulté:
                                </span>
                                <span className="font-medium text-black/80">
                                  {reservation?.circuitRel?.difficulty}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Dates:</span>
                                <span className="font-medium text-primary">
                                  {formatDate(reservation?.startDate)} -{" "}
                                  {formatDate(reservation?.endDate)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Durée:</span>
                                <span className="font-medium text-black/80">
                                  {reservation?.circuitRel?.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4">
                            <a
                              href={`/admin/circuits/${reservation?.vehicleRel?.id}`}
                              className="font-bold text-xl text-indigo-900 mb-2"
                            >
                              {reservation?.vehicleRel?.name}
                            </a>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Prix:</span>
                                <span className="font-medium text-green-600">
                                  {reservation?.vehicleRel?.pricePerDay}€/Jour
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-gray-600">Dates:</span>
                                <span className="font-medium text-primary">
                                  {formatDate(reservation?.startDate)} -{" "}
                                  {formatDate(reservation?.endDate)}
                                </span>
                              </div>
                              
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Préférences */}
                    {reservation?.preferences &&
                      reservation?.preferences !==
                        "Lorem Ipsum is simply dummy text..." && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Préférences
                          </h4>
                          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                            {reservation.preferences}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {bookingData?.pagination?.totalPages &&
              bookingData?.pagination?.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {bookingData?.pagination?.currentPage} sur{" "}
                    {bookingData?.pagination?.totalPages}(
                    {bookingData?.pagination?.totalCount} réservations au total)
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={!bookingData?.pagination.hasPrev}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Précédent
                    </button>

                    <div className="flex gap-1">
                      {Array.from(
                        { length: bookingData?.pagination?.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          className={`px-3 py-2 rounded-lg ${
                            page === bookingData?.pagination?.currentPage
                              ? "bg-indigo-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={!bookingData?.pagination?.hasNext}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingScreen;
