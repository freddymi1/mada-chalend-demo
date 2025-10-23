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
  Map,
} from "lucide-react";
import { useLocale } from "next-intl";

const CircuitDetailScreen = () => {
  const locale = useLocale();
  const { id } = useParams();
  const router = useRouter();
  const { circuitDetail, getCircuitById, handleDelete } = useCircuit();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      getCircuitById(id.toString());
    }
  }, [id]);

  if (!circuitDetail) {
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
    circuitDetail.itineraries
      ?.map((itinerary: { image: any }) => itinerary.image)
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

  const title = JSON.parse(circuitDetail.title);
  const description = JSON.parse(circuitDetail.description);

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
                Retour aux circuits
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Détail du circuit
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/admin/circuits/add")}
                className="flex items-center px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </button>
              <button
                onClick={() =>
                  router.push(`/admin/circuits/add?update=true&id=${id}`)
                }
                className="flex items-center px-4 py-2 text-sm bg-primary text-white rounded-lg transition-colors"
              >
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
        {/* Images Gallery */}
        {images.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-6">
            
            <div className="relative">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`Circuit ${circuitDetail.title}`}
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
        {/* Circuit Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {locale === "fr" ? title.fr : title.en}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {locale === "fr" ? description.fr : description.en}
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
                    {Number(circuitDetail.duration)} jour(s) /{" "}
                    {Number(circuitDetail.duration) - 1} nuit(s)
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Max personnes
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {circuitDetail.maxPeople}
                  </p>
                </div>
              </div>
            </div> */}

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Armchair className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nombre de reservations
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {circuitDetail.reservationCount}
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Armchair className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Places disponnibles
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {circuitDetail.placesDisponibles}
                  </p>
                </div>
              </div>
            </div> */}

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Armchair className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nombre des personnes
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {circuitDetail.totalPersonnesReservees} (Enfant:{" "}
                    {circuitDetail.nbrChild ?? 0} et Adulte:{" "}
                    {circuitDetail.nbrAdult ?? 0})
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Difficulté
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {circuitDetail.difficulty}
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
                    {circuitDetail.price}€/pers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Highlights */}
          {circuitDetail.highlights && circuitDetail.highlights.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h3 className="font-semibold text-lg mb-4 text-blue-600 dark:text-blue-400 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Points forts
              </h3>
              <ul className="space-y-3">
                {circuitDetail.highlights.map((highlight: any) => {
                  const highlightText = JSON.parse(highlight.text);
                  return (
                    <li
                      key={highlight.id}
                      className="flex items-start space-x-3"
                    >
                      <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {locale === "fr" ? highlightText.fr : highlightText.en}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Included */}
          {circuitDetail.included && circuitDetail.included.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h3 className="font-semibold text-lg mb-4 text-green-600 dark:text-green-400 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Inclus
              </h3>
              <ul className="space-y-3">
                {circuitDetail.included.map((item: any) => {
                  const itemText = JSON.parse(item.text);
                  return (
                    <li key={item.id} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {locale === "fr" ? itemText.fr : itemText.en}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Not Included */}
          {circuitDetail.notIncluded &&
            circuitDetail.notIncluded.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
                <h3 className="font-semibold text-lg mb-4 text-red-600 dark:text-red-400 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Non inclus
                </h3>
                <ul className="space-y-3">
                  {circuitDetail.notIncluded.map((item: any) => {
                    const itemText = JSON.parse(item.text);
                    return (
                      <li key={item.id} className="flex items-start space-x-3">
                        <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {locale === "fr" ? itemText.fr : itemText.en}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
        </div>

        {/* Image du circuit */}
        {circuitDetail.itinereryImage && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Image du circuit
            </h3>
            <div className="relative">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={circuitDetail.itinereryImage}
                  alt={`Circuit ${title.fr}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Daily Itinerary */}

        {circuitDetail.itineraries && circuitDetail.itineraries.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h3 className="font-semibold text-lg mb-6 text-gray-900 dark:text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Itinéraire jour par jour ({circuitDetail.itineraries.length}{" "}
              jours)
            </h3>
            <div className="space-y-6">
              {circuitDetail.itineraries.map(
                (itinerary: any, index: number) => {
                  const itineraryTitle = JSON.parse(itinerary.title);
                  const itineraryDescription = JSON.parse(
                    itinerary.description
                  );
                  const itineraryImageDescription = itinerary.imageDescription
                    ? JSON.parse(itinerary.imageDescription)
                    : null;
                  return (
                    <div
                      key={itinerary.id}
                      className="border dark:border-gray-700 rounded-lg overflow-hidden relative"
                    >
                      <div className="lg:flex lg:h-[400px]">
                        {" "}
                        {/* Hauteur réduite et plus adaptée */}
                        {/* Image */}
                        {itinerary.image && (
                          <div className="lg:w-1/3 relative">
                            <img
                              src={itinerary.image}
                              alt={
                                itineraryImageDescription.fr ||
                                `Jour ${itinerary.day}`
                              }
                              className="w-full max-h-82 lg:h-full object-cover"
                            />

                            {/* Timeline repositionnée à droite */}
                            <div className="absolute top-4 right-2 !z-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-xs font-medium shadow-lg">
                              <div className="relative">
                                {/* Ligne verticale continue */}
                                <div className="absolute left-[6px] top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>

                                {circuitDetail.itineraries
                                  .filter(
                                    (it: any, i: number) =>
                                      i >= 0 && i <= index + 1
                                  )
                                  .map((it: any, i: number) => {
                                    const isCurrentItem = i === index;
                                    const isLastInList =
                                      i ===
                                      circuitDetail.itineraries.length - 1;
                                    const isNextItem = i === index + 1;
                                    const itText = JSON.parse(
                                      it.imageDescription
                                    );

                                    return (
                                      <div
                                        className="flex flex-col items-start relative mb-3 last:mb-0"
                                        key={it.id}
                                      >
                                        {/* Point et description */}
                                        <div className="flex items-center gap-2 relative z-10">
                                          <MapPin
                                            className={`w-4 h-4 text-gray-400 ${
                                              isCurrentItem
                                                ? "text-green-500"
                                                : isNextItem
                                                ? "text-orange-500"
                                                : "text-blue-500"
                                            }`}
                                          />
                                          {/* <div
                                          className={`w-2 h-2 rounded-full mr-2 ${
                                            isCurrentItem
                                              ? "bg-green-500"
                                              : isNextItem
                                              ? "bg-orange-500"
                                              : "bg-blue-500"
                                          }`}
                                        /> */}
                                          <span className="text-xs font-medium max-w-[120px] truncate">
                                            {locale === "fr"
                                              ? itText.fr
                                              : itText.en}
                                          </span>
                                        </div>

                                        {/* Distance (sauf pour le dernier élément) */}
                                        {!isLastInList && (
                                          <div className="flex gap-2 items-center relative z-10 mt-2">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                              {it.distance} km
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Content */}
                        <div
                          className={`p-6 ${
                            itinerary.image ? "lg:w-2/3" : "w-full"
                          } bg-gray-50 dark:bg-gray-700 flex flex-col`}
                        >
                          <div className="flex items-center mb-4">
                            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-4">
                              {itinerary.day}
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {locale === "fr"
                                  ? itineraryTitle.fr
                                  : itineraryTitle.en}
                              </h4>
                              {itineraryImageDescription && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {locale === "fr"
                                    ? itineraryImageDescription.fr
                                    : itineraryImageDescription.en}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="prose max-w-none flex-grow">
                            {locale === "fr" ? (
                              <>
                                {itineraryDescription.fr
                                  .split("\n\n")
                                  .map((paragraph: any, pIndex: any) => (
                                    <p
                                      key={pIndex}
                                      className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                                    >
                                      {paragraph}
                                    </p>
                                  ))}
                              </>
                            ) : (
                              <>
                                {itineraryDescription.en
                                  .split("\n\n")
                                  .map((paragraph: any, pIndex: any) => (
                                    <p
                                      key={pIndex}
                                      className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                                    >
                                      {paragraph}
                                    </p>
                                  ))}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CircuitDetailScreen;
