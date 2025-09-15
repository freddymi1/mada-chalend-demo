"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "use-intl"

export function ContactSection() {
  const { toast } = useToast();
  const t = useTranslations("lng");
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    })
    setFormData({ nom: "", email: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">{t('contact.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <div>
              <h3 className="text-2xl font-semibold mb-6">{t('contact.infoTitle')}</h3>
              <div className="space-y-4">
                <div
                  className="flex items-center gap-4 animate-fade-in hover-lift"
                  style={{ animationDelay: "0.4s", animationFillMode: "both" }}
                >
                  <Phone className="h-6 w-6 text-primary animate-float" />
                  <div>
                    <p className="font-medium">{t('contact.phoneLabel')}</p>
                    <p className="text-muted-foreground">+261 34 12 345 67</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-4 animate-fade-in hover-lift"
                  style={{ animationDelay: "0.5s", animationFillMode: "both" }}
                >
                  <Mail className="h-6 w-6 text-primary animate-float" style={{ animationDelay: "1s" }} />
                  <div>
                    <p className="font-medium">{t('contact.emailLabel')}</p>
                    <p className="text-muted-foreground">contact@madachaland.mg</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-4 animate-fade-in hover-lift"
                  style={{ animationDelay: "0.6s", animationFillMode: "both" }}
                >
                  <MapPin className="h-6 w-6 text-primary animate-float" style={{ animationDelay: "2s" }} />
                  <div>
                    <p className="font-medium">{t('contact.addressLabel')}</p>
                    <p className="text-muted-foreground">
                      123 Avenue de l'Indépendance
                      <br />
                      Antananarivo 101, Madagascar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="aspect-video rounded-lg overflow-hidden animate-scale-in"
              style={{ animationDelay: "0.7s", animationFillMode: "both" }}
            >
              <img
                src="/madagascar-antananarivo-city-view-office-location.jpg"
                alt="Notre bureau à Antananarivo"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>

          {/* Contact Form */}
          <Card className="animate-scale-in hover-lift" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <CardHeader>
              <CardTitle>{t('contact.formTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: "0.5s", animationFillMode: "both" }}
                >
                  <Label htmlFor="nom">{t('contact.form.name')} *</Label>
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
                  <Label htmlFor="email">{t('contact.form.email')} *</Label>
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
                  style={{ animationDelay: "0.7s", animationFillMode: "both" }}
                >
                  <Label htmlFor="message">{t('contact.form.message')} *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t('contact.form.messagePlaceholder')}
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div className="animate-bounce-in" style={{ animationDelay: "0.8s", animationFillMode: "both" }}>
                  <Button type="submit" className="w-full hover-glow" size="lg">
                    {t('contact.form.submit')}
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
