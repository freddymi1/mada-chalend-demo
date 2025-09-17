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

// Circuit data with images linked to itinerary days
const circuitsData = {
  "tana-andasibe-palmarium": {
    title: "Circuit Tana – Andasibe – Palmarium",
    duration: "5 jours / 4 nuits",
    price: "€850",
    maxPeople: 8,
    difficulty: "Facile",
    description:
      "Découverte des parcs naturels, observation des lémuriens, et nuitée au Palmarium. Un voyage inoubliable au cœur de la biodiversité malgache.",
    highlights: ["Parcs naturels", "Observation des lémuriens", "Palmarium", "Forêt primaire", "Biodiversité unique"],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Antananarivo",
        description: "Accueil à l'aéroport et transfert à l'hôtel. Visite de la ville haute.",
        image: "/madagascar-adventure-climbing.jpg?height=600&width=800&query=Antananarivo city high town Madagascar",
        imageDescription: "Vue panoramique sur la ville haute d'Antananarivo avec ses maisons traditionnelles colorées"
      },
      {
        day: 2,
        title: "Route vers Andasibe",
        description: "Départ matinal vers Andasibe. Installation et première visite du parc.",
        image: "/madagascar-lemurs-in-andasibe-national-park.jpg?height=600&width=800&query=misty morning forest Andasibe Madagascar",
        imageDescription: "Forêt matinale brumeuse d'Andasibe, habitat naturel des lémuriens Indri-Indri"
      },
      {
        day: 3,
        title: "Parc National d'Andasibe",
        description: "Journée complète d'observation des lémuriens Indri-Indri.",
        image: "/madagascar-avenue-of-baobabs-sunset.jpg?height=600&width=800&query=Indri lemur close up Madagascar wildlife",
        imageDescription: "Lémurien Indri-Indri dans son habitat naturel, le plus grand lémurien de Madagascar"
      },
      {
        day: 4,
        title: "Palmarium",
        description: "Transfert vers Palmarium. Nuitée dans un cadre exceptionnel.",
        image: "/madagascar-family-travel-children-beach.jpg?height=600&width=800&query=Palmarium lodge lakeside Madagascar",
        imageDescription: "Lodge du Palmarium au bord du lac, refuge paisible au cœur de la nature"
      },
      {
        day: 5,
        title: "Retour Antananarivo",
        description: "Matinée libre au Palmarium puis retour vers la capitale.",
        image: "/madagascar-rice-terraces.jpg?height=600&width=800&query=exotic orchid flowers Andasibe Madagascar",
        imageDescription: "Orchidées exotiques endémiques de Madagascar dans la région d'Andasibe"
      }
    ],
    included: [
      "Transport en véhicule 4x4",
      "Hébergement en pension complète",
      "Guide francophone",
      "Entrées des parcs",
      "Activités mentionnées",
    ],
    notIncluded: ["Vols internationaux", "Boissons alcoolisées", "Pourboires", "Assurance voyage"],
  },
  "descente-tsiribihina": {
    title: "Descente de la Tsiribihina",
    duration: "3-4 jours",
    price: "€650",
    maxPeople: 12,
    difficulty: "Modéré",
    description:
      "Une aventure en bateau au cœur de paysages spectaculaires et de villages authentiques. Découvrez Madagascar au fil de l'eau.",
    highlights: [
      "Aventure en bateau",
      "Paysages spectaculaires",
      "Villages authentiques",
      "Camping sous les étoiles",
      "Faune aquatique",
    ],
    itinerary: [
      {
        day: 1,
        title: "Départ Miandrivazo",
        description: "Embarquement et début de la descente. Premier campement.",
        image: "/madagascar-avenue-of-baobabs-sunset.jpg?height=600&width=800&query=boat adventure Tsiribihina river Madagascar",
        imageDescription: "Embarquement sur la rivière Tsiribihina avec l'équipage local pour l'aventure fluviale"
      },
      {
        day: 2,
        title: "Navigation et villages",
        description: "Visite de villages traditionnels. Nuit en camping.",
        image: "/madagascar-baobab-tree-legend-ancient.jpg?height=600&width=800&query=authentic village along Tsiribihina river Madagascar",
        imageDescription: "Village traditionnel sakalava au bord de la Tsiribihina, mode de vie authentique"
      },
      {
        day: 3,
        title: "Paysages sauvages",
        description: "Observation de la faune. Dernière nuit au bord de l'eau.",
        image: "/madagascar-ifaty-beach-paradise-palm-trees.jpg?height=600&width=800&query=camping by riverside Tsiribihina Madagascar",
        imageDescription: "Campement nocturne au bord de la Tsiribihina sous un ciel étoilé exceptionnel"
      },
      {
        day: 4,
        title: "Arrivée Belo-sur-Tsiribihina",
        description: "Fin de la descente et transfert vers Morondava.",
        image: "/madagascar-limestone-pinnacles.jpg?height=600&width=800&query=sunset over Tsiribihina river Madagascar",
        imageDescription: "Coucher de soleil spectaculaire sur la rivière Tsiribihina en fin de parcours"
      }
    ],
    included: ["Bateau et équipage", "Matériel de camping", "Repas pendant la descente", "Guide local", "Transferts"],
    notIncluded: ["Transport vers Miandrivazo", "Hébergement avant/après", "Boissons", "Équipement personnel"],
  },
  "sud-madagascar": {
    title: "Sud de Madagascar : Ifaty – Tulear – Ambatomilo",
    duration: "7 jours",
    price: "€1200",
    maxPeople: 10,
    difficulty: "Facile",
    description:
      "Plages paradisiaques, immersion dans la culture locale et découverte des marchés traditionnels. Le sud authentique de Madagascar.",
    highlights: [
      "Plages paradisiaques",
      "Culture locale",
      "Marchés traditionnels",
      "Forêt épineuse",
      "Villages de pêcheurs",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée Tulear",
        description: "Accueil et installation. Visite du marché local.",
        image: "/madagascar-adventure-climbing.jpg?height=600&width=800&query=Tulear market Madagascar local culture",
        imageDescription: "Marché coloré de Tuléar avec ses épices, artisanat et produits locaux typiques du sud"
      },
      {
        day: 2,
        title: "Route vers Ifaty",
        description: "Installation en bord de mer. Détente sur la plage.",
        image: "/madagascar-ifaty-beach-paradise-palm-trees.jpg?height=600&width=800&query=Ifaty beach paradise Madagascar",
        imageDescription: "Plage paradisiaque d'Ifaty avec ses eaux turquoise et cocotiers, parfaite pour la détente"
      },
      {
        day: 3,
        title: "Forêt épineuse",
        description: "Découverte de la forêt épineuse unique au monde.",
        image: "/madagascar-rice-terraces.jpg?height=600&width=800&query=spiny forest Madagascar endemic plants",
        imageDescription: "Forêt épineuse endémique du sud avec ses plantes succulentes et baobabs bottle"
      },
      {
        day: 4,
        title: "Village d'Ambatomilo",
        description: "Immersion dans un village de pêcheurs traditionnel.",
        image: "/madagascar-lemurs-in-andasibe-national-park.jpg?height=600&width=800&query=fishing village Ambatomilo Madagascar",
        imageDescription: "Village de pêcheurs vezo d'Ambatomilo avec ses pirogues traditionnelles sur la plage"
      },
      {
        day: 5,
        title: "Plages et détente",
        description: "Journée libre sur les plus belles plages.",
        image: "/madagascar-family-travel-children-beach.jpg?height=600&width=800&query=family relaxing beach Madagascar",
        imageDescription: "Famille profitant des magnifiques plages de sable blanc du sud de Madagascar"
      },
      {
        day: 6,
        title: "Artisanat local",
        description: "Rencontre avec les artisans locaux. Shopping.",
        image: "/madagascar-avenue-of-baobabs-sunset.jpg?height=600&width=800&query=local crafts artisans Madagascar south",
        imageDescription: "Artisans locaux travaillant le bois, les fibres et créant l'artisanat traditionnel du sud"
      },
      {
        day: 7,
        title: "Retour Tulear",
        description: "Derniers achats et transfert aéroport.",
        image: "/madagascar-baobab-tree-legend-ancient.jpg?height=600&width=800&query=departure airport Tulear Madagascar",
        imageDescription: "Derniers moments à Tuléar avant le départ, souvenirs d'un voyage inoubliable dans le sud"
      }
    ],
    included: [
      "Hébergement bord de mer",
      "Tous les repas",
      "Transport 4x4",
      "Guide francophone",
      "Activités culturelles",
    ],
    notIncluded: ["Vols", "Boissons alcoolisées", "Activités nautiques optionnelles", "Souvenirs"],
  },
  "morondava-baobabs": {
    title: "Morondava et Allée des Baobabs",
    duration: "4-5 jours",
    price: "€750",
    maxPeople: 8,
    difficulty: "Facile",
    description:
      "Exploration des baobabs, mangroves et villages côtiers. Découvrez les géants de Madagascar dans leur environnement naturel.",
    highlights: ["Allée des Baobabs", "Mangroves", "Villages côtiers", "Couchers de soleil", "Écosystème unique"],
    itinerary: [
      {
        day: 1,
        title: "Arrivée Morondava",
        description: "Installation et première découverte de la ville côtière.",
        image: "/madagascar-rice-terraces.jpg?height=600&width=800&query=Morondava coastal town Madagascar arrival",
        imageDescription: "Arrivée à Morondava, ville côtière animée, porte d'entrée vers l'allée des baobabs"
      },
      {
        day: 2,
        title: "Allée des Baobabs",
        description: "Journée complète avec les géants. Coucher de soleil magique.",
        image: "/madagascar-avenue-of-baobabs-sunset.jpg?height=600&width=800&query=Avenue of Baobabs sunset Madagascar iconic",
        imageDescription: "Coucher de soleil légendaire sur l'Allée des Baobabs, moment magique et emblématique"
      },
      {
        day: 3,
        title: "Baobabs amoureux",
        description: "Visite des baobabs enlacés et exploration des mangroves.",
        image: "/madagascar-lemurs-in-andasibe-national-park.jpg?height=600&width=800&query=baobabs in love intertwined Madagascar",
        imageDescription: "Les baobabs amoureux, arbres millénaires enlacés symbole d'amour éternel"
      },
      {
        day: 4,
        title: "Villages côtiers",
        description: "Rencontre avec les communautés locales de pêcheurs.",
        image: "/madagascar-family-travel-children-beach.jpg?height=600&width=800&query=coastal fishing village Madagascar Morondava",
        imageDescription: "Village de pêcheurs sakalava près de Morondava, mode de vie traditionnel préservé"
      },
      {
        day: 5,
        title: "Dernière matinée",
        description: "Temps libre et transfert vers l'aéroport.",
        image: "/madagascar-adventure-climbing.jpg?height=600&width=800&query=mangroves ecosystem Madagascar Morondava",
        imageDescription: "Écosystème unique des mangroves près de Morondava, biodiversité exceptionnelle"
      }
    ],
    included: ["Hébergement confortable", "Repas locaux", "Transport local", "Guide spécialisé", "Entrées sites"],
    notIncluded: ["Vol vers Morondava", "Boissons", "Pourboires guide", "Activités optionnelles"],
  },
}

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
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              {t('navigation.home')}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/circuits" className="hover:text-primary">
              {t('navigation.tours')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{circuit.title}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and basic info */}
              <div className="animate-slide-up">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">{circuit.title}</h1>
                <div className="flex flex-wrap gap-4 mb-6">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {circuit.duration}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Max {circuit.maxPeople} personnes
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {circuit.difficulty}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground text-pretty">{circuit.description}</p>
              </div>

              {/* Image slider */}
              <div className="animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
                <ImageSlider images={circuitImages} title={circuit.title} />
              </div>

              {/* Highlights */}
              <Card className="animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Points forts du circuit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {circuit.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-primary/20 hover:scale-105"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Itinerary with images */}
              <Card className="animate-slide-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Itinéraire détaillé
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {circuit.itinerary.map((day, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        {/* Day number and content */}
                        <div className="flex gap-4 flex-1">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                            J-{day.day}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{day.title}</h4>
                            <p className="text-muted-foreground text-sm mb-2">{day.description}</p>
                            <p className="text-xs text-muted-foreground italic">{day.imageDescription}</p>
                          </div>
                        </div>
                        
                        {/* Day image */}
                        <div 
                          className="flex-shrink-0 w-full md:w-32 h-24 md:h-20 rounded-lg overflow-hidden cursor-pointer group relative"
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
            <div className="space-y-6">
              {/* Booking card */}
              <Card
                className="sticky top-24 animate-slide-up"
                style={{ animationDelay: "0.5s", animationFillMode: "both" }}
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{circuit.price}</CardTitle>
                  <p className="text-muted-foreground">par personne</p>
                </CardHeader>
                <CardContent className="space-y-4">
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
              <Card className="animate-fade-in" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
                <CardHeader>
                  <CardTitle className="text-lg">Inclus dans le prix</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {circuit.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{ animationDelay: "0.7s", animationFillMode: "both" }}>
                <CardHeader>
                  <CardTitle className="text-lg">Non inclus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {circuit.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        {item}
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
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.image} 
              alt={selectedImage.description}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            <div className="p-4 bg-white">
              <h3 className="font-bold text-lg mb-2">
                Jour {selectedImage.day} : {selectedImage.title}
              </h3>
              <p className="text-gray-600 text-sm">{selectedImage.description}</p>
            </div>
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
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