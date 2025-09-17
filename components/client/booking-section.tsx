"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/client/ui/card"
import { Button } from "@/components/client/ui/button"
import { Input } from "@/components/client/ui/input"
import { Label } from "@/components/client/ui/label"
import { Textarea } from "@/components/client/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "use-intl"

export function BookingSection() {
  const t = useTranslations("lng");
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    personnes: "",
    dates: "",
    preferences: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Demande envoyée !",
      description: "Nous vous contacterons dans les plus brefs délais pour finaliser votre circuit.",
    })
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      personnes: "",
      dates: "",
      preferences: "",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="reservation" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">{t('book.title')}</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              {t('book.subtitle')}
            </p>
          </div>

          <Card className="animate-scale-in hover-lift" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <CardHeader>
              <CardTitle>{t('book.form.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className="space-y-2 animate-fade-in"
                    style={{ animationDelay: "0.5s", animationFillMode: "both" }}
                  >
                    <Label htmlFor="nom">{t('book.form.name')} *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="transition-all duration-300 focus:scale-105"
                    />
                  </div>
                  <div
                    className="space-y-2 animate-fade-in"
                    style={{ animationDelay: "0.6s", animationFillMode: "both" }}
                  >
                    <Label htmlFor="prenom">{t('book.form.firstname')} *</Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      className="transition-all duration-300 focus:scale-105"
                    />
                  </div>
                </div>

                <div
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: "0.7s", animationFillMode: "both" }}
                >
                  <Label htmlFor="email">{t('book.form.email')} *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: "0.8s", animationFillMode: "both" }}
                >
                  <Label htmlFor="telephone">{t('book.form.phone')}</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: "0.9s", animationFillMode: "both" }}
                >
                  <Label htmlFor="personnes">{t('book.form.personNumber')} *</Label>
                  <Input
                    id="personnes"
                    name="personnes"
                    type="number"
                    min="1"
                    value={formData.personnes}
                    onChange={handleChange}
                    required
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div className="space-y-2 animate-fade-in" style={{ animationDelay: "1s", animationFillMode: "both" }}>
                  <Label htmlFor="dates">{t('book.form.date')}</Label>
                  <Input
                    id="dates"
                    name="dates"
                    placeholder={t('book.form.datePL')}
                    value={formData.dates}
                    onChange={handleChange}
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: "1.1s", animationFillMode: "both" }}
                >
                  <Label htmlFor="preferences">{t('book.form.nb')}</Label>
                  <Textarea
                    id="preferences"
                    name="preferences"
                    placeholder={t('book.form.nbPL')}
                    value={formData.preferences}
                    onChange={handleChange}
                    rows={4}
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div className="animate-bounce-in" style={{ animationDelay: "1.2s", animationFillMode: "both" }}>
                  <Button type="submit" className="w-full hover-glow" size="lg">
                    {t('book.form.cta')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
