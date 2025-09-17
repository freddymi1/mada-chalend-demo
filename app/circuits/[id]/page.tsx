"use client"

import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { ImageSlider } from "@/components/client/image-slider"
import { Button } from "@/components/client/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/client/ui/card"
import { Badge } from "@/components/client/ui/badge"
import { Toaster } from "@/components/client/ui/toaster"
import { Calendar, MapPin, Users, Star, Camera } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useState } from "react"
import { useTranslations } from "use-intl"
import { circuitsData } from "@/src/infrastructure/repositories/circuit"

// Circuit data with images linked to itinerary days


// Helper function to get all images from itinerary
function getCircuitImages(circuit: any) {
  return circuit.itinerary.map((day: any) => day.image);
}

interface CircuitDetailPageProps {
  params: {
    id: string
  }
}

export default function CircuitDetailPage({ params }: CircuitDetailPageProps) {
  const t = useTranslations("lng");
  const circuit = circuitsData[params.id as keyof typeof circuitsData]
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    title: string;
    description: string;
    day: number;
  } | null>(null)

  if (!circuit) {
    notFound()
  }

  const circuitImages = getCircuitImages(circuit);

  const handleImageClick = (day: any) => {
    setSelectedImage({
      image: day.image,
      title: day.title,
      description: day.imageDescription,
      day: day.day
    })
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <div className="animate-fade-in w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-full">
          {/* Breadcrumb */}
          <nav className="mb-6 sm:mb-8 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              {t('navigation.home')}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/circuits" className="hover:text-primary">
              {t('navigation.tours')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground truncate">{circuit.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8 w-full min-w-0">
              {/* Title and basic info */}
              <div className="animate-slide-up w-full">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-balance break-words">{circuit.title}</h1>
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">{circuit.duration}</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">Max {circuit.maxPeople} personnes</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">{circuit.difficulty}</span>
                  </Badge>
                </div>
                <p className="text-base sm:text-lg text-muted-foreground text-pretty break-words">{circuit.description}</p>
              </div>

              {/* Image slider */}
              <div className="animate-fade-in w-full" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
                <ImageSlider images={circuitImages} title={circuit.title} />
              </div>

              {/* Highlights */}
              <Card className="animate-slide-up w-full" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Camera className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span>Points forts du circuit</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {circuit.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-all duration-300 hover:bg-primary/20 hover:scale-105 break-words max-w-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Itinerary with images */}
              <Card className="animate-slide-up w-full" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span>Itinéraire détaillé</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                  <div className="space-y-4 sm:space-y-6">
                    {circuit.itinerary.map((day, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-3 p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors w-full"
                      >
                        {/* Day content */}
                        <div className="flex gap-3 sm:gap-4 w-full min-w-0">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                            J-{day.day}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold mb-1 text-sm sm:text-base break-words">{day.title}</h4>
                            <p className="text-muted-foreground text-xs sm:text-sm mb-2 break-words">{day.description}</p>
                            <p className="text-xs text-muted-foreground italic break-words">{day.imageDescription}</p>
                          </div>
                        </div>
                        
                        {/* Day image */}
                        <div 
                          className="w-full max-w-sm mx-auto sm:mx-0 h-32 sm:h-24 rounded-lg overflow-hidden cursor-pointer group relative"
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
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6 w-full">
              {/* Booking card */}
              <Card
                className="lg:sticky lg:top-24 animate-slide-up w-full"
                style={{ animationDelay: "0.5s", animationFillMode: "both" }}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-xl sm:text-2xl text-primary break-words">{circuit.price}</CardTitle>
                  <p className="text-muted-foreground text-sm sm:text-base">par personne</p>
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
              <Card className="animate-fade-in w-full" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Inclus dans le prix</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    {circuit.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                        <span className="break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="animate-fade-in w-full" style={{ animationDelay: "0.7s", animationFillMode: "both" }}>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Non inclus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    {circuit.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                        <span className="break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
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
              <p className="text-gray-600 text-xs sm:text-sm break-words">{selectedImage.description}</p>
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
  )
}