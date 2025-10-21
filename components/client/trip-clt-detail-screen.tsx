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
  DollarSign,
} from "lucide-react";
import { useTrip } from "../providers/admin/TripProvider";
import { useCltTrip } from "../providers/client/TripCltProvider";
import { useTranslations } from "next-intl";
import { formatDate } from "./trip-screen";

const TripCltDetailScreen = () => {
  const t = useTranslations("lng");
  const { id } = useParams();
  const router = useRouter();
  const { tripDetail, getTripById } = useCltTrip();
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
    tripDetail.program?.map((pr: { image: any }) => pr.image).filter(Boolean) ||
    [];

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
      <div className="container mx-auto p-6">
        {/* Images Gallery */}
        {images.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 mb-6">
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

          <div>
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span className="text-xl">{tripDetail.duration}</span>
              </div>
              <div className="flex bg-gray-200 dark:bg-gray-700 p-6 rounded-xl items-center gap-2">
                <DollarSign className="w-6 h-6" />
                <span className="text-xl font-semibold">
                  ${tripDetail.price}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex flex-col items-start">
            <p className="text-xl font-bold  text-gray-100 dark:text-white">
              Dates
            </p>

            <div className="grid grid-cols-1 mt-4 w-full md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripDetail.travelDates.map((date) => (
                <div
                  key={date.id}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex flex-col gap-4 items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <p className="text-sm font-semibold">
                              {formatDate(date.startDate)} →{" "}
                              {formatDate(date.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center w-full">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <p className="text-sm font-semibold">
                          {date.maxPeople} max
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Armchair className="w-4 h-4 text-blue-400" />
                        <p className="text-sm font-semibold">
                          {date.placesDisponibles}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full mb-6">
          {/* Highlights */}
          {tripDetail.highlights && tripDetail.highlights.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h3 className="font-semibold text-lg mb-4 text-blue-600 dark:text-blue-400 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Points forts
              </h3>
              <ul className="lg:flex flex-wrap items-center gap-4">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-6 mb-6">
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
          {tripDetail.notIncluded && tripDetail.notIncluded.length > 0 && (
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

        <div className="flex items-center justify-center w-full ">
          <button
            onClick={() =>
              router.push(`/reservation/trip?trip=${tripDetail?.id}`)
            }
            className="w-auto group/btn relative my-6 px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{t("ourTrip.booking")}</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Daily Itinerary */}
        {tripDetail.program && tripDetail.program.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h3 className="font-semibold text-lg mb-6 text-gray-900 dark:text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Programmes par jour ({tripDetail.program.length} jours)
            </h3>
            <div className="space-y-6">
              {tripDetail.program.map((itinerary: any, index: number) => (
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCltDetailScreen;
