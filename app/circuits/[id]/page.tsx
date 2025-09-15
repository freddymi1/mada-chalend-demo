import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ImageSlider } from "@/components/image-slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/toaster"
import { Calendar, MapPin, Users, Star, Camera } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Circuit data with multiple images
const circuitsData = {
  "tana-andasibe-palmarium": {
    title: "Circuit Tana – Andasibe – Palmarium",
    duration: "5 jours / 4 nuits",
    price: "€850",
    maxPeople: 8,
    difficulty: "Facile",
    description:
      "Découverte des parcs naturels, observation des lémuriens, et nuitée au Palmarium. Un voyage inoubliable au cœur de la biodiversité malgache.",
    images: [
      "/madagascar-adventure-climbing.jpg?height=600&width=800&query=lemurs in Andasibe national park Madagascar",
      "/madagascar-lemurs-in-andasibe-national-park.jpg?height=600&width=800&query=misty morning forest Andasibe Madagascar",
      "/madagascar-avenue-of-baobabs-sunset.jpg?height=600&width=800&query=Palmarium lodge lakeside Madagascar",
      "/madagascar-family-travel-children-beach.jpg?height=600&width=800&query=Indri lemur close up Madagascar wildlife",
      "/madagascar-rice-terraces.jpg?height=600&width=800&query=exotic orchid flowers Andasibe Madagascar",
    ],
    highlights: ["Parcs naturels", "Observation des lémuriens", "Palmarium", "Forêt primaire", "Biodiversité unique"],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Antananarivo",
        description: "Accueil à l'aéroport et transfert à l'hôtel. Visite de la ville haute.",
      },
      {
        day: 2,
        title: "Route vers Andasibe",
        description: "Départ matinal vers Andasibe. Installation et première visite du parc.",
      },
      {
        day: 3,
        title: "Parc National d'Andasibe",
        description: "Journée complète d'observation des lémuriens Indri-Indri.",
      },
      { day: 4, title: "Palmarium", description: "Transfert vers Palmarium. Nuitée dans un cadre exceptionnel." },
      { day: 5, title: "Retour Antananarivo", description: "Matinée libre au Palmarium puis retour vers la capitale." },
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
    images: [
      "/madagascar-avenue-of-baobabs-sunset.jpg?height=600&width=800&query=boat adventure Tsiribihina river Madagascar",
      "/madagascar-baobab-tree-legend-ancient.jpg?height=600&width=800&query=sunset over Tsiribihina river Madagascar",
      "/madagascar-ifaty-beach-paradise-palm-trees.jpg?height=600&width=800&query=authentic village along Tsiribihina river Madagascar",
      "/madagascar-lemurs-in-andasibe-national-park.jpg?height=600&width=800&query=camping by riverside Tsiribihina Madagascar",
      "/madagascar-limestone-pinnacles.jpg?height=600&width=800&query=birds wildlife Tsiribihina river Madagascar",
    ],
    highlights: [
      "Aventure en bateau",
      "Paysages spectaculaires",
      "Villages authentiques",
      "Camping sous les étoiles",
      "Faune aquatique",
    ],
    itinerary: [
      { day: 1, title: "Départ Miandrivazo", description: "Embarquement et début de la descente. Premier campement." },
      { day: 2, title: "Navigation et villages", description: "Visite de villages traditionnels. Nuit en camping." },
      { day: 3, title: "Paysages sauvages", description: "Observation de la faune. Dernière nuit au bord de l'eau." },
      { day: 4, title: "Arrivée Belo-sur-Tsiribihina", description: "Fin de la descente et transfert vers Morondava." },
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
    images: [
      "/madagascar-ifaty-beach-paradise-palm-trees.jpg?height=600&width=800&query=paradise beach palm trees Ifaty Madagascar",
      "/madagascar-tulear-traditional-market.jpg?height=600&width=800&query=traditional colorful market Tulear Madagascar",
      "/madagascar-ambatomilo-fishing-village.jpg?height=600&width=800&query=fishing village Ambatomilo Madagascar coast",
      "/madagascar-ifaty-spiny-forest.jpg?height=600&width=800&query=spiny forest unique vegetation Ifaty Madagascar",
      "/madagascar-tulear-sunset-beach.jpg?height=600&width=800&query=sunset beach Tulear Madagascar golden hour",
    ],
    highlights: [
      "Plages paradisiaques",
      "Culture locale",
      "Marchés traditionnels",
      "Forêt épineuse",
      "Villages de pêcheurs",
    ],
    itinerary: [
      { day: 1, title: "Arrivée Tulear", description: "Accueil et installation. Visite du marché local." },
      { day: 2, title: "Route vers Ifaty", description: "Installation en bord de mer. Détente sur la plage." },
      { day: 3, title: "Forêt épineuse", description: "Découverte de la forêt épineuse unique au monde." },
      { day: 4, title: "Village d'Ambatomilo", description: "Immersion dans un village de pêcheurs traditionnel." },
      { day: 5, title: "Plages et détente", description: "Journée libre sur les plus belles plages." },
      { day: 6, title: "Artisanat local", description: "Rencontre avec les artisans locaux. Shopping." },
      { day: 7, title: "Retour Tulear", description: "Derniers achats et transfert aéroport." },
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
    images: [
      "/madagascar-rice-terraces.jpg?height=600&width=800&query=exotic orchid flowers Andasibe Madagascar",
      "/madagascar-avenue-of-baobabs-sunset.jpg?height=600&width=800&query=Palmarium lodge lakeside Madagascar",
      "/madagascar-lemurs-in-andasibe-national-park.jpg?height=600&width=800&query=misty morning forest Andasibe Madagascar",
      "/madagascar-family-travel-children-beach.jpg?height=600&width=800&query=Indri lemur close up Madagascar wildlife",
      "/madagascar-adventure-climbing.jpg?height=600&width=800&query=lemurs in Andasibe national park Madagascar",
    ],
    highlights: ["Allée des Baobabs", "Mangroves", "Villages côtiers", "Couchers de soleil", "Écosystème unique"],
    itinerary: [
      { day: 1, title: "Arrivée Morondava", description: "Installation et première découverte de la ville côtière." },
      {
        day: 2,
        title: "Allée des Baobabs",
        description: "Journée complète avec les géants. Coucher de soleil magique.",
      },
      { day: 3, title: "Baobabs amoureux", description: "Visite des baobabs enlacés et exploration des mangroves." },
      { day: 4, title: "Villages côtiers", description: "Rencontre avec les communautés locales de pêcheurs." },
      { day: 5, title: "Dernière matinée", description: "Temps libre et transfert vers l'aéroport." },
    ],
    included: ["Hébergement confortable", "Repas locaux", "Transport local", "Guide spécialisé", "Entrées sites"],
    notIncluded: ["Vol vers Morondava", "Boissons", "Pourboires guide", "Activités optionnelles"],
  },
}

interface CircuitDetailPageProps {
  params: {
    id: string
  }
}

export default function CircuitDetailPage({ params }: CircuitDetailPageProps) {
  const circuit = circuitsData[params.id as keyof typeof circuitsData]

  if (!circuit) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <Link href="/circuits" className="hover:text-primary">
              Circuits
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
                <ImageSlider images={circuit.images} title={circuit.title} />
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

              {/* Itinerary */}
              <Card className="animate-slide-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Itinéraire détaillé
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {circuit.itinerary.map((day, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                          {day.day}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{day.title}</h4>
                          <p className="text-muted-foreground text-sm">{day.description}</p>
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
      <Footer />
      <Toaster />
    </main>
  )
}
