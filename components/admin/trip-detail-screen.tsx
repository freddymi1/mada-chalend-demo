"use client";
import React, { useEffect, useState } from "react";
import { useCircuit } from "../providers/admin/CircuitProvider";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Camera,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Plus,
  Armchair,
} from "lucide-react";
import { useTrip } from "../providers/admin/TripProvider";

const TripDetailScreen = () => {
  const { id } = useParams();
  const router = useRouter();
  const { tripDetail, getTripById, handleDelete } = useTrip();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      getTripById(id.toString());
    }
  }, [id]);

  if (!tripDetail) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Chargement des détails du circuit...
          </p>
        </div>
      </div>
    );
  }

  const images =
    tripDetail.program
      ?.map((pr: { image: any }) => pr.image)
      .filter(Boolean) || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: any) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Backoffice */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin/circuits")}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour aux voyages
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Détail du voyage
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => router.push("/admin/circuits/add")} className="flex items-center px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </button>
              <button onClick={() => router.push(`/admin/circuits/add?update=true&id=${id}`)} className="flex items-center px-4 py-2 text-sm bg-primary text-white rounded-lg transition-colors">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </button>

              <button
                onClick={() => {
                  handleDelete(id.toString());
                  router.push("/admin/circuits");
                }}
                className="flex items-center px-4 py-2 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Circuit Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {tripDetail.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {tripDetail.description}
              </p>
            </div>
            <div className="ml-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                Actif
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Durée
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tripDetail.duration} jour(s) et {tripDetail.duration - 1} nuit(s)
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Max personnes
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tripDetail.maxPeople}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Armchair className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nombre de reservations
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tripDetail.reservationCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Armchair className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Places disponnibles
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tripDetail.placesDisponibles}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Armchair className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nombre des personnes
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tripDetail.totalPersonnesReservees} (Enfant: {tripDetail.nbrChild ?? 0 } et Adulte: {tripDetail.nbrAdult ?? 0 })
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Date
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tripDetail.startDate} - {tripDetail.endDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-red-600 dark:text-red-400 font-bold">
                  €
                </span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Prix
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tripDetail.price}€/pers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Highlights */}
          {tripDetail.highlights && tripDetail.highlights.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h3 className="font-semibold text-lg mb-4 text-blue-600 dark:text-blue-400 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Points forts
              </h3>
              <ul className="space-y-3">
                {tripDetail.highlights.map((highlight: any) => (
                  <li key={highlight.id} className="flex items-start space-x-3">
                    <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {highlight.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Included */}
          {tripDetail.included && tripDetail.included.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h3 className="font-semibold text-lg mb-4 text-green-600 dark:text-green-400 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Inclus
              </h3>
              <ul className="space-y-3">
                {tripDetail.included.map((item: any) => (
                  <li key={item.id} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Not Included */}
          {tripDetail.notIncluded &&
            tripDetail.notIncluded.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
                <h3 className="font-semibold text-lg mb-4 text-red-600 dark:text-red-400 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Non inclus
                </h3>
                <ul className="space-y-3">
                  {tripDetail.notIncluded.map((item: any) => (
                    <li key={item.id} className="flex items-start space-x-3">
                      <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        {/* Images Gallery */}
        {images.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Galerie d'images ({images.length})
            </h3>
            <div className="relative">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`Circuit ${tripDetail.title}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </>
              )}

              {images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {images.map((_: any, index: any) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Daily Itinerary */}
        {tripDetail.itineraries && tripDetail.itineraries.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h3 className="font-semibold text-lg mb-6 text-gray-900 dark:text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Programmes par jour ({tripDetail.itineraries.length}{" "}
              jours)
            </h3>
            <div className="space-y-6">
              {tripDetail.program.map(
                (itinerary: any, index: number) => (
                  <div
                    key={itinerary.id}
                    className="border dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="lg:flex">
                      {/* Image */}
                      {itinerary.image && (
                        <div className="lg:w-1/3">
                          <img
                            src={itinerary.image}
                            alt={
                              itinerary.imageDescription ||
                              `Jour ${itinerary.day}`
                            }
                            className="w-full h-48 lg:h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div
                        className={`p-6 ${
                          itinerary.image ? "lg:w-2/3" : "w-full"
                        } bg-gray-50 dark:bg-gray-700`}
                      >
                        <div className="flex items-center mb-4">
                          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-4">
                            {itinerary.day}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {itinerary.title}
                            </h4>
                            {itinerary.imageDescription && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {itinerary.imageDescription}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="prose max-w-none">
                          {itinerary.description
                            .split("\n\n")
                            .map((paragraph: any, pIndex: any) => (
                              <p
                                key={pIndex}
                                className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                              >
                                {paragraph}
                              </p>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetailScreen;
