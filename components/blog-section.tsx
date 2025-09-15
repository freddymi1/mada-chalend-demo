"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { useTranslations } from "use-intl";

export function BlogSection() {
  const t = useTranslations("lng");
  
  const articles = [
    {
      title: "La légende du premier baobab",
      excerpt: "Découvrez l'histoire fascinante et les légendes qui entourent ces arbres majestueux de Madagascar.",
      image: "/madagascar-baobab-tree-legend-ancient.jpg",
      date: "15 Mars 2024",
    },
    {
      title: "Les falaises de la Tsiribihina : contes et légendes",
      excerpt: "Plongez dans les récits traditionnels qui donnent vie aux paysages spectaculaires de la Tsiribihina.",
      image: "/madagascar-tsiribihina-cliffs-river-landscape.jpg",
      date: "8 Mars 2024",
    },
    {
      title: "Top 5 des expériences insolites à Madagascar",
      excerpt: "Des aventures uniques que vous ne trouverez nulle part ailleurs dans le monde.",
      image: "/madagascar-unique-experiences-wildlife-adventure.jpg",
      date: "1 Mars 2024",
    },
    {
      title: "Voyager en famille à Madagascar : conseils pratiques",
      excerpt: "Tous nos conseils pour organiser un voyage inoubliable avec vos enfants à Madagascar.",
      image: "/madagascar-family-travel-children-beach.jpg",
      date: "22 Février 2024",
    },
  ]

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">{t('blog.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t('blog.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <Card
              key={index}
              className="overflow-hidden group cursor-pointer hover-lift animate-fade-in"
              style={{
                animationDelay: `${0.2 + index * 0.1}s`,
                animationFillMode: "both",
              }}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{article.date}</span>
                </div>
                <CardTitle className="text-lg leading-tight text-balance">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 text-pretty">{article.excerpt}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto font-medium group hover:text-primary transition-colors"
                >
                  {t('blog.viewMore')}
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
