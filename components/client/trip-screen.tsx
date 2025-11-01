"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  MapPin,
  Users,
  Clock,
  DollarSign,
  ChevronRight,
  Check,
  X,
  Calendar,
  Armchair,
  EuroIcon,
} from "lucide-react";
import { TripTravel } from "@/src/domain/entities/trip";
import { useCltTrip } from "../providers/client/TripCltProvider";
import { useRouter } from "next/navigation";
import AnimateLoading from "./animate-loading";
export const formatDate = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TripScreen = () => {
  const t = useTranslations("lng");
  const [selectedTrip, setSelectedTrip] = useState<TripTravel | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();

  const { addedTrips: trips, fetchTrips, isLoading } = useCltTrip();

  useEffect(() => {
    const loadTrip = () => {
      fetchTrips();
    };
    loadTrip();
  }, []);

  const calculateOccupancyRate = (trip: TripTravel): number => {
    if (!trip.travelDates || trip.travelDates.length === 0) return 0;

    // Somme des capacités totales et des places disponibles de toutes les dates
    const totalCapacity = trip.travelDates.reduce(
      (sum, date) => sum + (Number(date.maxPeople) ?? 0),
      0
    );

    const totalAvailable = trip.travelDates.reduce(
      (sum, date) => sum + (Number(date.placesDisponibles) ?? 0),
      0
    );

    if (totalCapacity === 0) return 0;

    // Nombre total de places réservées
    const totalBooked = totalCapacity - totalAvailable;

    // Calcul du taux d’occupation global
    return Math.round((totalBooked / totalCapacity) * 100);
  };

  const getText = (item: any): string => {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null) {
      return item.text || item.title || item.description || "";
    }
    return "";
  };

  const getId = (item: any, index: number): string => {
    if (typeof item === "object" && item !== null && item.id) {
      return item.id.toString();
    }
    return index.toString();
  };

  const handleTripSelect = (trip: TripTravel): void => {
    // setSelectedTrip(trip);
    router.push(`/trip/${trip.id}`);
  };

  if (isLoading) {
    return <AnimateLoading />;
  }

  return (
    <section id="circuits" className="py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 border border-blue-500/20 rounded-full text-primary text-sm font-semibold backdrop-blur-sm">
              ✨ {t("ourTrip.badge") || "Discover Our Adventures"}
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text">
            {t("ourTrip.title") || "Explore Unforgettable Journeys"}
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            {t("ourTrip.description") ||
              "Curated travel experiences designed for adventurers seeking authentic connections and breathtaking moments"}
          </p>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {trips.map((trip, idx) => {
            const title = JSON.parse(trip.title);
            const description = JSON.parse(trip.description);
            return (
              <div
                key={trip.id}
                onMouseEnter={() => setHoveredCard(trip.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group cursor-pointer animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-full bg-white/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    {trip.program[0]?.image ? (
                      <img
                        src={trip.program[0].image}
                        alt={trip.program[0].imageDescription}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-slate-600" />
                      </div>
                    )}

                    {/* Overlay Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                        {calculateOccupancyRate(trip)}%{" "}
                        {t("ourTrip.booked") || "Booked"}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">
                      {locale === "fr" ? title.fr : title.en}
                    </h3>
                    <p className="text-slate-900 text-sm mb-4 line-clamp-2">
                      {locale === "fr" ? description.fr : description.en}
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          {Number(trip.duration)} {t("ourTrip.day")} /{" "}
                          {Number(trip.duration) - 1} {t("ourTrip.night")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col mb-3 items-center justify-center gap-2 text-primary">
                      <p className="text-muted-foreground text-lg">
                        {t("detailCircuit.booking.from")}
                      </p>
                      <div className="flex items-center gap-2">
                        <EuroIcon className="w-8 h-8 font-bold text-primary" />
                        <span className="text-3xl font-bold">{trip.price}</span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="w-full mb-6">
                      <p className="text-xl text-primary mb-1">
                        {t("ourTrip.travelDates") || "Travel Dates"}
                      </p>
                      {trip.travelDates.map((date) => (
                        <div
                          key={date.id}
                          className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30 flex flex-col items-start  mb-4"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-700" />
                            <p className="text-sm font-semibold text-slate-700">
                              {formatDate(date.startDate)} →{" "}
                              {formatDate(date.endDate)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-slate-700" />
                              <p className="text-sm font-semibold text-slate-700">
                                {date.placesDisponibles} / {date.maxPeople}
                              </p>
                            </div>

                            {/* <div className="flex items-center gap-2">
                            <EuroIcon className="w-4 h-4 text-blue-400" />
                            <p className="text-sm font-semibold text-white">
                              {date.price}€
                            </p>
                          </div> */}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Highlights */}
                    {trip.highlights && trip.highlights.length > 0 && (
                      <div className="mb-6">
                        <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                          {t("ourTrip.highlights") || "Highlights"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {trip.highlights.slice(0, 2).map((highlight, idx) => {
                            const item = JSON.parse(getText(highlight));
                            return (
                              <span
                                key={getId(highlight, idx)}
                                className="text-xs bg-white text-primary px-2 py-1 rounded-full"
                              >
                                {locale === "fr" ? item.fr : item.en}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex flex-col gap-6">
                      {/* Book Button */}
                      <button
                        onClick={() =>
                          router.push(`/reservation/trip?trip=${trip?.id}`)
                        }
                        className="w-full group/btn relative px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>{t("ourTrip.booking")}</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleTripSelect(trip)}
                        className="w-full group/btn relative px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>
                          {t("ourTrip.viewDetails") || "View Details"}
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  {hoveredCard === trip.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 pointer-events-none animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {trips.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              {t("ourTrip.noTrips") || "No trips available at the moment"}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default TripScreen;
