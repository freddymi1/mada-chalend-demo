"use client"

import { Facebook, Instagram } from "lucide-react"
import { useTranslations } from "use-intl";

export function Footer() {
  const t = useTranslations("lng");
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            <h3 className="text-2xl font-bold mb-4">Mada Chaland</h3>
            <p className="text-primary-foreground/80 text-pretty">
              {t('footer.text')}
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <h4 className="text-lg font-semibold mb-4">{t('footer.followOur')}</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
                Instagram
              </a>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <h4 className="text-lg font-semibold mb-4">{t('footer.legalInfos.title')}</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:translate-x-2"
              >
                {t('footer.legalInfos.legalMention')}
              </a>
              <a
                href="#"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:translate-x-2"
              >
                {t('footer.legalInfos.politic')}
              </a>
            </div>
          </div>
        </div>

        <div
          className="border-t border-primary-foreground/20 mt-8 pt-8 text-center animate-fade-in"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >
          <p className="text-primary-foreground/80">{t('footer.legalInfos.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
