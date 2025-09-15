"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Eye } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "use-intl"

export function ToursSection() {
  const t = useTranslations("lng");
  const tours = [
    {
      id: "tana-andasibe-palmarium",
      title: "Circuit Tana – Andasibe – Palmarium",
      duration: "5 jours / 4 nuits",
      description: "Découverte des parcs naturels, observation des lémuriens, et nuitée au Palmarium.",
      image: "/madagascar-lemurs-in-andasibe-national-park.jpg",
      highlights: ["Parcs naturels", "Observation des lémuriens", "Palmarium"],
    },
    {
      id: "descente-tsiribihina",
      title: "Descente de la Tsiribihina",
      duration: "3-4 jours",
      description: "Une aventure en bateau au cœur de paysages spectaculaires et de villages authentiques.",
      image: "/madagascar-tsiribihina-river-boat-adventure.jpg",
      highlights: ["Aventure en bateau", "Paysages spectaculaires", "Villages authentiques"],
    },
    {
      id: "sud-madagascar",
      title: "Sud de Madagascar : Ifaty – Tulear – Ambatomilo",
      duration: "7 jours",
      description: "Plages paradisiaques, immersion dans la culture locale et découverte des marchés traditionnels.",
      image: "/madagascar-ifaty-beach-paradise-palm-trees.jpg",
      highlights: ["Plages paradisiaques", "Culture locale", "Marchés traditionnels"],
    },
    {
      id: "morondava-baobabs",
      title: "Morondava et Allée des Baobabs",
      duration: "4-5 jours",
      description: "Exploration des baobabs, mangroves et villages côtiers.",
      image: "/madagascar-avenue-of-baobabs-sunset.jpg",
      highlights: ["Allée des Baobabs", "Mangroves", "Villages côtiers"],
    },
  ]

  return (
    <section id="circuits" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">{t('tours.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t('tours.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {tours.map((tour, index) => (
            <Card
              key={index}
              className="overflow-hidden hover-lift animate-fade-in"
              style={{
                animationDelay: `${0.2 + index * 0.1}s`,
                animationFillMode: "both",
              }}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-balance">{tour.title}</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{tour.duration}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-pretty">{tour.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-primary/20 hover:scale-105"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Link href={`/circuits/${tour.id}`} className="flex-1">
                    <Button variant="outline" className="w-full hover-lift bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      {t('tours.viewDetails')}
                    </Button>
                  </Link>
                  <Link href="/reservation" className="flex-1">
                    <Button className="w-full hover-glow">{t('tours.book')}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-bounce-in" style={{ animationDelay: "0.8s", animationFillMode: "both" }}>
          <Link href="/reservation">
            <Button size="lg" className="hover-lift hover-glow">
              {t('tours.customTour')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
