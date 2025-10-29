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
  EuroIcon,
} from "lucide-react";
import { useTrip } from "../providers/admin/TripProvider";
import { useCltTrip } from "../providers/client/TripCltProvider";
import { useLocale, useTranslations } from "next-intl";
import { formatDate } from "./trip-screen";
import AnimateLoading from "./animate-loading";

const TripCltDetailScreen = () => {
  const t = useTranslations("lng");
  const { id } = useParams();
  const router = useRouter();
  const { tripDetail, getTripById, isLoading } = useCltTrip();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const locale = useLocale();

  useEffect(() => {
    if (id) {
      getTripById(id.toString());
    }
  }, [id]);

  if (!tripDetail) {
    return (
      <AnimateLoading/>
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

  const title = JSON.parse(tripDetail.title);
  const description = JSON.parse(tripDetail.description);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Images Gallery */}
        {images.length > 0 && (
          <div className="bg-background rounded-lg mb-6">
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`Circuit ${title.fr}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary rounded-full p-2 shadow-lg transition-all"
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
                          ? "bg-primary"
                          : "bg-white"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Circuit Information Card */}
        <div className="bg-white/50 rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary mb-2">
                {locale === "fr" ? title.fr : title.en}
              </h2>
              <p className="text-slate-700 text-base leading-relaxed">
                {locale === "fr" ? description.fr : description.en}
              </p>
            </div>
            <div className="ml-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
                Actif
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span className="text-xl">{Number(tripDetail.duration)} {t("ourTrip.day")} / {Number(tripDetail.duration) - 1} {t("ourTrip.night")}</span>
              </div>
              <div className="hidden lg:flex bg-primary text-primary-foreground p-6 rounded-xl items-center gap-2">
                <EuroIcon className="w-6 h-6" />
                <span className="text-xl font-semibold">
                  {tripDetail.price}
                </span>
              </div>
            </div>
            <div className="flex justify-center mb-4 text-primary-foreground lg:hidden bg-primary p-6 rounded-xl items-center gap-2">
                <EuroIcon className="w-8 h-8" />
                <span className="text-3xl font-bold">
                  {tripDetail.price}
                </span>
              </div>
          </div>

          {/* Stats Grid */}
          <div className="flex flex-col items-start">
            <p className="text-xl font-bold  text-slate-700">
              Dates
            </p>

            <div className="grid grid-cols-1 mt-4 w-full md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripDetail.travelDates.map((date) => (
                <div
                  key={date.id}
                  className="bg-primary-foreground rounded-lg p-4"
                >
                  <div className="flex flex-col gap-4 items-center space-x-3">
                    <Star className="w-5 h-5 text-slate-700" />
                    <div>
                      <div className="font-semibold text-slate-700">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-700" />
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
                        <Users className="w-4 h-4 text-slate-700" />
                        <p className="text-sm text-slate-700 font-semibold">
                          {date.maxPeople} max
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Armchair className="w-4 h-4 text-slate-700" />
                        <p className="text-sm text-slate-700 font-semibold">
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
            <div className="bg-white/50 rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4 text-primary flex items-center">
                <Star className="w-5 h-5 mr-2" />
                {t("ourTrip.highlights")}
              </h3>
              <ul className="lg:flex flex-wrap items-center gap-4">
                {tripDetail.highlights.map((highlight: any) => {
                  const text = JSON.parse(highlight.text);
                  return (
                    <li
                      key={highlight.id}
                      className="flex items-start space-x-3"
                    >
                      <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">
                        {locale === "fr" ? text.fr : text.en}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-6 mb-6">
          {/* Included */}
          {tripDetail.included && tripDetail.included.length > 0 && (
            <div className="bg-white/50 rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4 text-primary flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                {t("ourTrip.included")}
              </h3>
              <ul className="space-y-3">
                {tripDetail.included.map((item: any) => {
                  const text = JSON.parse(item.text);
                  return (
                    <li key={item.id} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">
                        {locale === "fr" ? text.fr : text.en}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Not Included */}
          {tripDetail.notIncluded && tripDetail.notIncluded.length > 0 && (
            <div className="bg-white/50 rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4 text-red-600 dark:text-red-400 flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                {t("ourTrip.notIncluded")}
              </h3>
              <ul className="space-y-3">
                {tripDetail.notIncluded.map((item: any) => {
                  const text = JSON.parse(item.text);
                  return (
                    <li key={item.id} className="flex items-start space-x-3">
                      <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">
                        {locale === "fr" ? text.fr : text.en}
                      </span>
                    </li>
                  );
                })}
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
          <div className="bg-white/50 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-6 text-primary flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {t("ourTrip.programDay")} ({tripDetail.program.length} {t("ourTrip.day")})
            </h3>
            <div className="space-y-6">
              {tripDetail.program.map((itinerary: any, index: number) => {
                const title = JSON.parse(itinerary.title);
                const description = JSON.parse(itinerary.description);
                const imgDescription = JSON.parse(itinerary.imageDescription);
                return (
                  <div
                    key={itinerary.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="lg:flex">
                      {/* Image */}
                      {itinerary.image && (
                        <div className="lg:w-1/3">
                          <img
                            src={itinerary.image}
                            alt={imgDescription.fr || `Jour ${itinerary.day}`}
                            className="w-full h-48 lg:h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div
                        className={`p-6 ${
                          itinerary.image ? "lg:w-2/3" : "w-full"
                        } bg-primary-foreground`}
                      >
                        <div className="flex items-center mb-4">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-4">
                            {itinerary.day}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-primary">
                              {locale === "fr" ? title.fr : title.en}
                            </h4>
                            {imgDescription && (
                              <p className="text-sm text-primary/70">
                                {locale === "fr"
                                  ? imgDescription.fr
                                  : imgDescription.en}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="prose max-w-none">
                          {locale === "fr" ? (
                            <>
                              {description.fr
                                .split("\n\n")
                                .map((paragraph: any, pIndex: any) => (
                                  <p
                                    key={pIndex}
                                    className="mb-3 text-slate-700 leading-relaxed text-sm"
                                  >
                                    {paragraph}
                                  </p>
                                ))}
                            </>
                          ) : (
                            <>
                              {description.en
                                .split("\n\n")
                                .map((paragraph: any, pIndex: any) => (
                                  <p
                                    key={pIndex}
                                    className="mb-3 text-slate-700 leading-relaxed text-sm"
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
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCltDetailScreen;
