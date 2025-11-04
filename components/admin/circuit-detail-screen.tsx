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
  Route,
  Save,
  X as CloseIcon,
  Menu,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useToast } from "@/hooks/shared/use-toast";

const CircuitDetailScreen = () => {
  const locale = useLocale();
  const { id } = useParams();
  const router = useRouter();
  const { circuitDetail, getCircuitById, handleDelete } = useCircuit();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingDistances, setEditingDistances] = useState<{
    [key: string]: boolean;
  }>({});
  const [distanceValues, setDistanceValues] = useState<{
    [key: string]: string;
  }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      getCircuitById(id.toString());
    }
  }, [id]);

  // Pré-remplir les distances existantes quand circuitDetail est chargé
  useEffect(() => {
    if (circuitDetail?.itineraries) {
      const initialDistanceValues: { [key: string]: string } = {};

      circuitDetail.itineraries.forEach((itinerary: any) => {
        if (
          itinerary.itineraryDistanceRel &&
          itinerary.itineraryDistanceRel.length > 0
        ) {
          itinerary.itineraryDistanceRel.forEach((distance: any) => {
            const distanceKey = `${itinerary.id}-${distance.departPoint}-${distance.arrivalPoint}`;
            initialDistanceValues[distanceKey] =
              distance.distance?.toString() || "";
          });
        }
      });

      setDistanceValues(initialDistanceValues);
    }
  }, [circuitDetail]);

  // Fonction pour extraire les points d'un titre
  const extractPoints = (title: string) => {
    if (!title) return null;

    // Nettoyer le titre en supprimant les préfixes J1, J2, J.x, etc.
    const cleanTitle = title.replace(/^J\d+[\s:–\-_]*/i, "").trim();

    // Séparer par différents délimiteurs possibles : –, -, _, :
    const points = cleanTitle
      .split(/[–\-_:]/)
      .map((point) => point.trim())
      .filter((point) => point.length > 0);

    return points.length > 1 ? points : null;
  };

  // Fonction pour créer les paires de points
  const createPointPairs = (points: string[]) => {
    const pairs = [];
    for (let i = 0; i < points.length - 1; i++) {
      pairs.push({
        depart: points[i],
        arrival: points[i + 1],
        key: `${points[i]}-${points[i + 1]}`,
      });
    }
    return pairs;
  };

  // Fonction pour trouver la distance existante
  const findExistingDistance = (
    itinerary: any,
    depart: string,
    arrival: string
  ) => {
    if (
      !itinerary.itineraryDistanceRel ||
      itinerary.itineraryDistanceRel.length === 0
    )
      return null;

    return itinerary.itineraryDistanceRel.find(
      (d: any) => d.departPoint === depart && d.arrivalPoint === arrival
    );
  };

  // Fonction pour sauvegarder toutes les distances d'un itinéraire
  const handleSaveAllDistances = async (
    itineraryId: string,
    pointPairs: any[]
  ) => {
    try {
      const distancesData = pointPairs.map((pair) => {
        const distanceKey = `${itineraryId}-${pair.depart}-${pair.arrival}`;
        const existingDistance = findExistingDistance(
          circuitDetail.itineraries.find((it: any) => it.id === itineraryId),
          pair.depart,
          pair.arrival
        );

        return {
          departPoint: pair.depart,
          arrivalPoint: pair.arrival,
          distance:
            distanceValues[distanceKey] ||
            existingDistance?.distance?.toString() ||
            "0",
        };
      });

      const validDistances = distancesData.filter(
        (distance) => distance.distance && parseInt(distance.distance) > 0
      );

      if (validDistances.length === 0) {
        toast({
          title: "Attention",
          description: "Aucune distance valide à sauvegarder",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/circuit/distance/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itineraryId,
          distances: validDistances,
        }),
      });

      if (response.ok) {
        await getCircuitById(id.toString());
        toast({
          title: "Succès !",
          description: "Toutes les distances ont été sauvegardées avec succès",
        });

        setEditingDistances({});
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde des distances",
        variant: "destructive",
      });
    }
  };

  // Fonction pour supprimer une distance
  const handleDeleteDistance = async (
    distanceId: string,
    distanceKey: string
  ) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette distance ?")) return;

    try {
      const response = await fetch(`/api/itinerary-distance/${distanceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await getCircuitById(id.toString());
        setDistanceValues((prev) => {
          const newValues = { ...prev };
          delete newValues[distanceKey];
          return newValues;
        });
        toast({
          title: "Succès",
          description: "Distance supprimée avec succès",
        });
      } else {
        alert("Erreur lors de la suppression de la distance");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression de la distance");
    }
  };

  // Fonction pour activer/désactiver l'édition de toutes les distances
  const toggleEditAllDistances = (itineraryId: string, pointPairs: any[]) => {
    const anyEditing = pointPairs.some(
      (pair) =>
        editingDistances[`${itineraryId}-${pair.depart}-${pair.arrival}`]
    );

    if (anyEditing) {
      const newEditingDistances = { ...editingDistances };
      pointPairs.forEach((pair) => {
        delete newEditingDistances[
          `${itineraryId}-${pair.depart}-${pair.arrival}`
        ];
      });
      setEditingDistances(newEditingDistances);
    } else {
      const newEditingDistances = { ...editingDistances };
      pointPairs.forEach((pair) => {
        const distanceKey = `${itineraryId}-${pair.depart}-${pair.arrival}`;
        newEditingDistances[distanceKey] = true;
      });
      setEditingDistances(newEditingDistances);
    }
  };

  // Fonction pour mettre à jour une valeur de distance
  const updateDistanceValue = (distanceKey: string, value: string) => {
    setDistanceValues((prev) => ({
      ...prev,
      [distanceKey]: value,
    }));
  };

  if (!circuitDetail) {
    return (
      <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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

  const title = circuitDetail.title ? JSON.parse(circuitDetail.title) : "";
  const description = circuitDetail.description
    ? JSON.parse(circuitDetail.description)
    : "";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Backoffice - Responsive */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="mx-auto px-3 sm:px-6 py-3 sm:py-4">
          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => router.push("/admin/circuits")}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="text-sm">Retour</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Actions Menu */}
            {mobileMenuOpen && (
              <div className="flex flex-col space-y-2 pb-2">
                <button
                  onClick={() => {
                    router.push("/admin/circuits/add");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </button>
                <button
                  onClick={() => {
                    router.push(`/admin/circuits/add?update=true&id=${id}`);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center px-4 py-2 text-sm bg-primary text-white rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </button>
                <button
                  onClick={() => {
                    handleDelete(id.toString());
                    router.push("/admin/circuits");
                  }}
                  className="flex items-center justify-center px-4 py-2 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </button>
              </div>
            )}
          </div>

          {/* Desktop Header */}
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

      <div className="p-3 sm:p-6">
        {/* Images Gallery - Responsive */}
        {images.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-3 sm:p-6 mb-4 sm:mb-6">
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
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-1.5 sm:p-2 shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-1.5 sm:p-2 shadow-lg transition-all"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </>
              )}

              {images.length > 1 && (
                <div className="flex justify-center mt-3 sm:mt-4 space-x-2">
                  {images.map((_: any, index: any) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
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

        {/* Circuit Information Card - Responsive */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
            <div className="flex-1 mb-3 sm:mb-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {locale === "fr" ? title.fr : title.en}
              </h2>
              <div
                className="text-sm text-gray-500"
                dangerouslySetInnerHTML={{
                  __html:
                    locale === "fr"
                      ? description?.fr || ""
                      : description?.en || "",
                }}
              />
            </div>
            <div className="sm:ml-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                Actif
              </span>
            </div>
          </div>

          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Durée
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                    {Number(circuitDetail.duration)} jour(s) /{" "}
                    {Number(circuitDetail.duration) - 1} nuit(s)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-3">
                <Armchair className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Réservations
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                    {circuitDetail.reservationCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Personnes
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                    {circuitDetail.totalPersonnesReservees}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    (E: {circuitDetail.nbrChild ?? 0} / A:{" "}
                    {circuitDetail.nbrAdult ?? 0})
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-3">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Difficulté
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                    {circuitDetail.difficulty}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-3">
                <span className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 font-bold flex-shrink-0">
                  €
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Prix
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                    {circuitDetail.price}€/pers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights, Included, Not Included - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Highlights */}
          {circuitDetail.highlights && circuitDetail.highlights.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-blue-600 dark:text-blue-400 flex items-center">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Points forts
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {circuitDetail.highlights.map((highlight: any) => {
                  const highlightText = highlight.text
                    ? JSON.parse(highlight.text)
                    : "";
                  return (
                    <li
                      key={highlight.id}
                      className="flex items-start space-x-2 sm:space-x-3"
                    >
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-green-600 dark:text-green-400 flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Inclus
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {circuitDetail.included.map((item: any) => {
                  const itemText = item.text ? JSON.parse(item.text) : "";
                  return (
                    <li
                      key={item.id}
                      className="flex items-start space-x-2 sm:space-x-3"
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-red-600 dark:text-red-400 flex items-center">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Non inclus
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {circuitDetail.notIncluded.map((item: any) => {
                    const itemText = item.text ? JSON.parse(item.text) : "";
                    return (
                      <li
                        key={item.id}
                        className="flex items-start space-x-2 sm:space-x-3"
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          {locale === "fr" ? itemText.fr : itemText.en}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
        </div>

        {/* Image du circuit - Responsive */}
        {circuitDetail.itinereryImage && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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

        {/* Daily Itinerary - Responsive */}
        {circuitDetail.itineraries && circuitDetail.itineraries.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6 text-gray-900 dark:text-white flex items-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Itinéraire jour par jour ({circuitDetail.itineraries.length}{" "}
              jours)
            </h3>
            <div className="space-y-4 sm:space-y-6">
              {circuitDetail.itineraries.map(
                (itinerary: any, index: number) => {
                  const itineraryTitle = itinerary.title
                    ? JSON.parse(itinerary.title)
                    : "";
                  const itineraryDescription = itinerary.description
                    ? JSON.parse(itinerary.description)
                    : "";
                  const itineraryImageDescription = itinerary.imageDescription
                    ? JSON.parse(itinerary.imageDescription)
                    : null;

                  // Extraire les points du titre
                  const titleText =
                    locale === "fr" ? itineraryTitle.fr : itineraryTitle.en;
                  const points = extractPoints(titleText);
                  const pointPairs = points ? createPointPairs(points) : [];
                  const hasDistances = pointPairs.length > 0;

                  return (
                    <div
                      key={itinerary.id}
                      className="border dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Image - Responsive */}
                        {itinerary.image && (
                          <div className="w-full lg:w-1/3 lg:min-h-[400px]">
                            <img
                              src={itinerary.image}
                              alt={
                                itineraryImageDescription?.fr ||
                                `Jour ${itinerary.day}`
                              }
                              className="w-full h-48 sm:h-64 lg:h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Content - Responsive */}
                        <div
                          className={`p-4 sm:p-6 ${
                            itinerary.image ? "lg:w-2/3" : "w-full"
                          } bg-gray-50 dark:bg-gray-700 flex flex-col`}
                        >
                          <div className="flex items-start mb-3 sm:mb-4">
                            <div className="bg-blue-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-semibold text-sm mr-3 sm:mr-4 flex-shrink-0">
                              {itinerary.day}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words">
                                {titleText}
                              </h4>
                              {itineraryImageDescription && (
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {locale === "fr"
                                    ? itineraryImageDescription.fr
                                    : itineraryImageDescription.en}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Distances Section - Responsive */}
                          {hasDistances && (
                            <div className="mb-3 sm:mb-4 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                                <div className="flex items-center">
                                  <Route className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                                  <h5 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                    Distances du trajet
                                  </h5>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() =>
                                      toggleEditAllDistances(
                                        itinerary.id,
                                        pointPairs
                                      )
                                    }
                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors whitespace-nowrap"
                                  >
                                    <Edit className="w-3 h-3" />
                                    {pointPairs.some(
                                      (pair) =>
                                        editingDistances[
                                          `${itinerary.id}-${pair.depart}-${pair.arrival}`
                                        ]
                                    )
                                      ? "Annuler"
                                      : "Modifier"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleSaveAllDistances(
                                        itinerary.id,
                                        pointPairs
                                      )
                                    }
                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors whitespace-nowrap"
                                  >
                                    <Save className="w-3 h-3" />
                                    Sauvegarder
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2 sm:space-y-3">
                                {pointPairs.map((pair, pairIndex) => {
                                  const distanceKey = `${itinerary.id}-${pair.depart}-${pair.arrival}`;
                                  const existingDistance = findExistingDistance(
                                    itinerary,
                                    pair.depart,
                                    pair.arrival
                                  );
                                  const isEditing =
                                    editingDistances[distanceKey];
                                  const currentValue =
                                    distanceValues[distanceKey] ||
                                    existingDistance?.distance?.toString() ||
                                    "";

                                  return (
                                    <div
                                      key={pairIndex}
                                      className="bg-gray-50 dark:bg-gray-700 rounded p-2 sm:p-3"
                                    >
                                      {/* Points - Responsive */}
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex items-center flex-wrap gap-1 sm:gap-2 flex-1 min-w-0">
                                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                            {pair.depart}
                                          </span>
                                          <span className="text-gray-400 flex-shrink-0">
                                            →
                                          </span>
                                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                            {pair.arrival}
                                          </span>
                                        </div>

                                        {/* Distance Actions - Responsive */}
                                        {existingDistance && !isEditing ? (
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                              {existingDistance.distance} km
                                            </span>
                                            <button
                                              onClick={() =>
                                                setEditingDistances((prev) => ({
                                                  ...prev,
                                                  [distanceKey]: true,
                                                }))
                                              }
                                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                            >
                                              <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300" />
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleDeleteDistance(
                                                  existingDistance.id,
                                                  distanceKey
                                                )
                                              }
                                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                            >
                                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="number"
                                              placeholder="Distance (km)"
                                              value={currentValue}
                                              onChange={(e) =>
                                                updateDistanceValue(
                                                  distanceKey,
                                                  e.target.value
                                                )
                                              }
                                              className="w-20 sm:w-24 px-2 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            />
                                            {isEditing && existingDistance && (
                                              <button
                                                onClick={() =>
                                                  setEditingDistances(
                                                    (prev) => ({
                                                      ...prev,
                                                      [distanceKey]: false,
                                                    })
                                                  )
                                                }
                                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                              >
                                                <CloseIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300" />
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Description - Responsive */}
                          <div className="prose max-w-none flex-grow">
                            {locale === "fr" ? (
                              <>
                                {itineraryDescription.fr
                                  .split("\n\n")
                                  .map((paragraph: any, pIndex: any) => (
                                    <p
                                      key={pIndex}
                                      className="mb-2 sm:mb-3 text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm"
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
                                      className="mb-2 sm:mb-3 text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm"
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
