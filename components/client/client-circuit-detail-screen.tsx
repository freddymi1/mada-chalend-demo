"use client";

import { Header } from "@/components/client/header";
import { Footer } from "@/components/client/footer";
import { ImageSlider } from "@/components/client/image-slider";
import { Button } from "@/components/client/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/client/ui/card";
import { Badge } from "@/components/client/ui/badge";
import { Toaster } from "@/components/client/ui/toaster";
import { Calendar, MapPin, Star, Camera, Clock } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "use-intl";
import { useClientCircuit } from "@/components/providers/client/ClientCircuitProvider";
import { LoadingSpinner } from "./loading";
import AnimateLoading from "./animate-loading";

function getCircuitImages(circuit: any) {
  return circuit?.itineraries?.map((day: any) => day.image);
}

const ClientCircuitDetailScreen = () => {
  const t = useTranslations("lng");
  const locale = useLocale();
  const { id } = useParams();
  const router = useRouter();
  const { circuitDetail, getCircuitById, isLoading } = useClientCircuit();

  useEffect(() => {
    if (id) {
      getCircuitById(id.toString());
    }
  }, [id]);
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    title: string;
    description: string;
    day: number;
  } | null>(null);

  const circuitImages = getCircuitImages(circuitDetail);
  console.log("IMAGES", circuitImages);

  const handleImageClick = (day: any) => {
    setSelectedImage({
      image: day.image,
      title: day.title,
      description: day.imageDescription,
      day: day.day,
    });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };
  const title = circuitDetail?.title ? JSON.parse(circuitDetail?.title) : "";
  const description = circuitDetail?.description
    ? JSON.parse(circuitDetail?.description)
    : "";

  const createStepList = (distances: any[]) => {
    const steps: {
      point: string;
      type: "depart" | "etape" | "arrivee";
      distance?: number;
      duration?: string;
    }[] = [];

    distances.forEach((distance, idx) => {
      // Ajouter le point de départ seulement pour le premier
      if (idx === 0) {
        steps.push({
          point: distance.departPoint,
          type: "depart",
        });
      }

      // Ajouter la distance et durée
      steps.push({
        point: "",
        type: "etape",
        distance: distance.distance,
        duration: `~${Math.round(distance.distance / 80)} h`,
      });

      // Ajouter le point d'arrivée
      const isLast = idx === distances.length - 1;
      steps.push({
        point: distance.arrivalPoint,
        type: isLast ? "arrivee" : "etape",
      });
    });

    return steps;
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Header />

      {isLoading ? (
        <AnimateLoading />
      ) : (
        <>
          <div className="animate-fade-in w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
              {/* Breadcrumb */}
              <nav className="mb-6 sm:mb-8 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">
                  {t("navigation.home")}
                </Link>
                <span className="mx-2">/</span>
                <Link href="/circuits" className="hover:text-primary">
                  {t("navigation.tours")}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-foreground truncate">
                  {locale === "fr" ? title?.fr : title?.en}
                </span>
              </nav>

              <div className="grid grid-cols-1 w-full">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 w-full min-w-0">
                  {/* Title and basic info */}
                  <div className="animate-slide-up w-full">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-balance break-words">
                      {locale === "fr" ? title?.fr : title?.en}
                    </h1>
                    <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 text-xs sm:text-sm"
                      >
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate">
                          {Number(circuitDetail?.duration)} {t("ourTrip.day")} /{" "}
                          {Number(circuitDetail?.duration) - 1}{" "}
                          {t("ourTrip.night")}
                        </span>
                      </Badge>

                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 text-xs sm:text-sm"
                      >
                        <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate">
                          {circuitDetail?.difficulty}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-base sm:text-lg text-muted-foreground text-pretty break-words">
                      {locale === "fr" ? description?.fr : description?.en}
                    </p>
                  </div>

                  {/* Image slider */}
                  {circuitImages &&
                    circuitImages.length > 0 &&
                    circuitImages.some(
                      (img: string) => img && img.trim() !== ""
                    ) && (
                      <div
                        className="animate-fade-in w-full"
                        style={{
                          animationDelay: "0.2s",
                          animationFillMode: "both",
                        }}
                      >
                        <ImageSlider
                          images={circuitImages.filter(
                            (img: string) => img && img.trim() !== ""
                          )}
                          title={locale === "fr" ? title?.fr : title?.en}
                        />
                      </div>
                    )}
                </div>

                {/* Sidebar */}
              </div>
              <div className="w-full my-6 flex flex-col gap-4">
                {/* Highlights */}

                {/* Itinerary with images */}
                <Card
                  className="animate-slide-up w-full"
                  style={{ animationDelay: "0.4s", animationFillMode: "both" }}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span>{t("detailCircuit.itinerary.detailed")}</span>
                    </CardTitle>
                    {circuitDetail?.itinereryImage ? (
                      <div className="h-auto">
                        <img
                          src={circuitDetail.itinereryImage}
                          alt="map"
                          className="w-full h-full mt-6 object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="h-auto">
                        <img
                          src="/map.png"
                          alt="map"
                          className="w-full h-full mt-6 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="px-2 sm:px-6">
                    <div className="space-y-4 sm:space-y-6">
                      {circuitDetail?.itineraries?.sort((a: any, b: any) => a.day - b.day).map(
                        (day: any, index: number) => {
                          const imgTitle = day.title
                            ? JSON.parse(day.title)
                            : "";
                          const imgDescription = day.imageDescription
                            ? JSON.parse(day.imageDescription)
                            : "";
                          const dayDescription = day.description
                            ? JSON.parse(day.description)
                            : "";
                          const steps = day.itineraryDistanceRel
                            ? createStepList(day.itineraryDistanceRel)
                            : [];
                          const totalDistance =
                            day.itineraryDistanceRel?.reduce(
                              (sum: any, d: any) => sum + d.distance,
                              0
                            ) || 0;
                          return (
                            <div
                              key={day.id}
                              className="flex flex-col gap-3 p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors w-full"
                            >
                              {/* Day content */}
                              <div className="flex flex-col gap-3 sm:gap-4 w-full min-w-0">
                                <div className="flex items-center gap-6">
                                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                                    {day.day}
                                  </div>
                                  <h4 className="font-semibold mb-1 text-sm sm:text-base break-words">
                                    {locale === "fr"
                                      ? imgTitle.fr
                                      : imgTitle.en}
                                  </h4>
                                </div>

                                <div className="grid lg:h-[400px] grid-cols-1 lg:grid-cols-2 gap-10">
                                  {day.image !== "" && (
                                    <div
                                      className="!w-full max-h-96 flex flex-col items-start justify-end rounded-lg overflow-hidden cursor-pointer group relative"
                                      onClick={() => handleImageClick(day)}
                                    >
                                      <img
                                        src={day.image}
                                        alt={
                                          locale === "fr"
                                            ? imgDescription.fr
                                            : imgDescription.en
                                        }
                                        className="w-full max-h-82 lg:h-full object-cover hover:scale-110 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                                          <Camera className="h-4 w-4 text-gray-700" />
                                        </div>
                                      </div>
                                      <h4 className="font-semibold mt-1 text-left text-sm sm:text-base lg:text-lg break-words">
                                        {locale === "fr"
                                          ? imgDescription.fr
                                          : imgDescription.en}
                                      </h4>
                                    </div>
                                  )}

                                  <div className="!w-full flex flex-col items-start justify-start gap-4 rounded-lg overflow-hidden cursor-pointer group relative">
                                    {/* Affichage de itineraryDistanceRel */}
                                    {steps.length > 0 && (
                                      <div className="bg-slate-800/10 backdrop-blur rounded-2xl shadow-2xl border border-slate-700/10 p-3">
                                        <div className="relative">
                                          {/* Ligne verticale principale */}
                                          <div className="absolute left-[10px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-orange-500"></div>

                                          {steps.map((step, idx) => (
                                            <div key={idx} className="relative">
                                              {step.point ? (
                                                // Point de passage (départ, étape, arrivée)
                                                <div className="flex items-start gap-2">
                                                  <div className="relative z-10 flex-shrink-0">
                                                    <div
                                                      className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                                                        step.type === "depart"
                                                          ? "text-green-500 border-2"
                                                          : step.type ===
                                                            "arrivee"
                                                          ? "text-orange-500"
                                                          : "text-blue-500"
                                                      }`}
                                                    >
                                                      <MapPin className="w-5 h-5" />
                                                    </div>
                                                  </div>
                                                  <div className="flex-1 pt-1">
                                                    {/* <div
                                                      className={`text-xs font-semibold mb-0.5 ${
                                                        step.type === "depart"
                                                          ? "text-green-400"
                                                          : step.type ===
                                                            "arrivee"
                                                          ? "text-orange-400"
                                                          : "text-blue-400"
                                                      }`}
                                                    >
                                                      {step.type === "depart"
                                                        ? "Départ"
                                                        : step.type ===
                                                          "arrivee"
                                                        ? "Arrivée"
                                                        : "Étape"}
                                                    </div> */}
                                                    <div className="text-[10px] font-bold">
                                                      {step.point}
                                                    </div>
                                                  </div>
                                                </div>
                                              ) : (
                                                // Distance
                                                <div className="flex items-center gap-2 my-2">
                                                  <div className="relative z-10 flex-shrink-0">
                                                    <div className="w-6 h-6 backdrop-blur rounded-full flex items-center justify-center">
                                                      <Clock className="w-5 h-5 text-blue-400" />
                                                    </div>
                                                  </div>
                                                  <span className="text-[10px] font-bold text-blue-300">
                                                      {step.distance} km
                                                    </span>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>

                                        {/* Résumé total */}
                                        {/* <div className="mt-6 pt-6 border-t border-slate-700">
                                          <div className="flex items-center justify-between">
                                            <span className="text-slate-400 font-medium">
                                              Distance totale
                                            </span>
                                            <span className="text-xl font-bold text-blue-400">
                                              {totalDistance} km
                                            </span>
                                          </div>
                                        </div> */}
                                      </div>
                                    )}

                                    <p className="text-muted-foreground text-xs sm:text-sm mb-2 break-words">
                                      {locale === "fr"
                                        ? dayDescription.fr
                                        : dayDescription.en}
                                    </p>
                                    <p className="text-xs text-muted-foreground italic break-words">
                                      {locale === "fr"
                                        ? imgDescription.fr
                                        : imgDescription.en}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Day image */}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card
                className="lg:sticky lg:top-24 animate-slide-up w-full"
                style={{
                  animationDelay: "0.5s",
                  animationFillMode: "both",
                }}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-xl sm:text-2xl text-primary break-words flex items-center gap-4">
                    <span>{circuitDetail?.price} €</span>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {t("detailCircuit.booking.pricePerPerson")}
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols 1 lg:grid-cols-2 gap-6">
                  <Link
                    href={`/reservation/circuit?circuit=${circuitDetail?.id}`}
                  >
                    <Button className="w-full hover-glow" size="lg">
                      {t("detailCircuit.booking.reserveNow")}
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full bg-transparent">
                      {t("detailCircuit.booking.askInfo")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <div className="space-y-4 sm:space-y-6 w-full">
                {/* Booking card */}

                <Card
                  className="animate-slide-up w-full"
                  style={{
                    animationDelay: "0.3s",
                    animationFillMode: "both",
                  }}
                >
                  <CardHeader className="">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span>{t("detailCircuit.highlights.title")}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2 mb-4">
                      {circuitDetail?.highlights?.map((highlight: any) => {
                        const highlightText = highlight.text
                          ? JSON.parse(highlight.text)
                          : "";
                        return (
                          <div
                            key={highlight.id}
                            className="flex flex-col items-start gap-2"
                          >
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-primary/20 hover:scale-105">
                              {locale === "fr"
                                ? highlightText.fr
                                : highlightText.en}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Included/Not included */}
                <Card
                  className="animate-fade-in w-full"
                  style={{
                    animationDelay: "0.6s",
                    animationFillMode: "both",
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      {t("detailCircuit.included.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {circuitDetail?.included?.map((item: any) => {
                        const itemText = item.text ? JSON.parse(item.text) : "";
                        return (
                          <>
                            {itemText.fr === "" || itemText.en === "" ? null : (
                              <li
                                key={item.id}
                                className="flex items-start gap-2"
                              >
                                <span className="text-green-500 mt-1 flex-shrink-0">
                                  ✓
                                </span>
                                <span className="break-words">
                                  {locale === "fr" ? itemText.fr : itemText.en}
                                </span>
                              </li>
                            )}
                          </>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>

                <Card
                  className="animate-fade-in w-full"
                  style={{
                    animationDelay: "0.7s",
                    animationFillMode: "both",
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      {t("detailCircuit.notIncluded.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {circuitDetail?.notIncluded?.map((item: any) => {
                        const itemText = item.text ? JSON.parse(item.text) : "";
                        return (
                          <>
                            {itemText.fr === "" || itemText.en === "" ? null : (
                              <li
                                key={item.id}
                                className="flex items-start gap-2"
                              >
                                <span className="text-red-500 mt-1 flex-shrink-0">
                                  ✗
                                </span>
                                <span className="break-words">
                                  {locale === "fr" ? itemText.fr : itemText.en}
                                </span>
                              </li>
                            )}
                          </>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in"
              onClick={closeModal}
            >
              <div
                className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl animate-scale-in mx-2"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.image}
                  alt={selectedImage.description}
                  className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] object-contain"
                />
                <div className="p-3 sm:p-4 bg-white">
                  <h3 className="font-bold text-base sm:text-lg mb-2 break-words text-black">
                    Jour {selectedImage.day} : {selectedImage.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm break-words">
                    {selectedImage.description}
                  </p>
                </div>
                <button
                  className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors text-xl font-bold"
                  onClick={closeModal}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <Footer />
          <Toaster />
        </>
      )}
    </main>
  );
};

export default ClientCircuitDetailScreen;
