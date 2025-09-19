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
import { Calendar, MapPin, Users, Star, Camera } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import { useClientCircuit } from "@/components/providers/client/ClientCircuitProvider";

function getCircuitImages(circuit: any) {
  return circuit?.itineraries?.map((day: any) => day.image);
}

const ClientCircuitDetailScreen = () => {
  const t = useTranslations("lng");
  const { id } = useParams();
  const router = useRouter();
  const { circuitDetail, getCircuitById } = useClientCircuit();

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

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Header />
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
              {circuitDetail?.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8 w-full min-w-0">
              {/* Title and basic info */}
              <div className="animate-slide-up w-full">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-balance break-words">
                  {circuitDetail?.title}
                </h1>
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">{circuitDetail?.duration}</span>
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">
                      Max {circuitDetail?.maxPeople} personnes
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
                  {circuitDetail?.description}
                </p>
              </div>

              {/* Image slider */}
              <div
                className="animate-fade-in w-full"
                style={{ animationDelay: "0.2s", animationFillMode: "both" }}
              >
                <ImageSlider
                  images={circuitImages}
                  title={circuitDetail?.title}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6 w-full">
              {/* Booking card */}
              <Card
                className="lg:sticky lg:top-24 animate-slide-up w-full"
                style={{ animationDelay: "0.5s", animationFillMode: "both" }}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-xl sm:text-2xl text-primary break-words">
                    {circuitDetail?.price}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    par personne
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <Link href="/reservation">
                    <Button className="w-full hover-glow" size="lg">
                      Réserver maintenant
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full bg-transparent">
                      Demander des infos
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Included/Not included */}
              <Card
                className="animate-fade-in w-full"
                style={{ animationDelay: "0.6s", animationFillMode: "both" }}
              >
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Inclus dans le prix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    {circuitDetail?.included?.map((item: any) => (
                      <li key={item.id} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1 flex-shrink-0">
                          ✓
                        </span>
                        <span className="break-words">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card
                className="animate-fade-in w-full"
                style={{ animationDelay: "0.7s", animationFillMode: "both" }}
              >
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Non inclus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    {circuitDetail?.notIncluded?.map((item: any) => (
                      <li key={item.id} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1 flex-shrink-0">
                          ✗
                        </span>
                        <span className="break-words">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="w-full my-6 flex flex-col gap-4">
            {/* Highlights */}
            <Card
              className="animate-slide-up w-full"
              style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Points forts du circuit</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {circuitDetail?.highlights?.map((highlight: any) => (
                    <span
                      key={highlight.id}
                      className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-primary/20 hover:scale-105"
                    >
                      {highlight.text}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Itinerary with images */}
            <Card
              className="animate-slide-up w-full"
              style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Itinéraire détaillé</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <div className="space-y-4 sm:space-y-6">
                  {circuitDetail?.itineraries?.map((day: any) => (
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
                            {day.title} - {day.imageDescription}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                          <div
                            className="!w-full max-h-96 flex items-center justify-end rounded-lg overflow-hidden cursor-pointer group relative"
                            onClick={() => handleImageClick(day)}
                          >
                            <img
                              src={day.image}
                              alt={day.imageDescription}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                                <Camera className="h-4 w-4 text-gray-700" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs sm:text-sm mb-2 break-words">
                              {day.description}
                            </p>
                            <p className="text-xs text-muted-foreground italic break-words">
                              {day.imageDescription}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Day image */}
                    </div>
                  ))}
                </div>
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
    </main>
  );
};

export default ClientCircuitDetailScreen;
