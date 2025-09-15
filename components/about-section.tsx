
"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Users } from "lucide-react"
import { useTranslations } from "use-intl";

export function AboutSection() {
  const t = useTranslations("lng");
  return (
    <section id="a-propos" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">{t('about.title')}</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card
            className="text-center hover-lift animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            <CardContent className="pt-8 pb-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-3">{t('about.features.authentic.title')}</h3>
              <p className="text-muted-foreground">
                {t('about.features.authentic.description')}
              </p>
            </CardContent>
          </Card>

          <Card
            className="text-center hover-lift animate-fade-in"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <CardContent className="pt-8 pb-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-3">{t('about.features.safe.title')}</h3>
              <p className="text-muted-foreground">
                {t('about.features.safe.description')}
              </p>
            </CardContent>
          </Card>

          <Card
            className="text-center hover-lift animate-fade-in"
            style={{ animationDelay: "0.6s", animationFillMode: "both" }}
          >
            <CardContent className="pt-8 pb-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-3">{t('about.features.responsible.title')}</h3>
              <p className="text-muted-foreground">
                {t('about.features.responsible.description')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: "0.8s", animationFillMode: "both" }}>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t('about.features.conclusion')}
          </p>
        </div>
      </div>
    </section>
  )
}
