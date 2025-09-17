"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/client/ui/card";
import { Button } from "@/components/client/ui/button";
import { Input } from "@/components/client/ui/input";
import { Label } from "@/components/client/ui/label";
import { Textarea } from "@/components/client/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/client/ui/select";
import {
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar,
  Car,
  Building,
  Route,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "use-intl";

// Types pour les différents formulaires
type FormType = "circuit" | "partenariat" | "autre";

interface CircuitFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  nbPersonnes: string;
  dateDepart: string;
  circuitDemande: string;
  budget: string;
  duree: string;
  message: string;
}

interface PartenariatFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  nomEntreprise: string;
  objet: string;
  typePartenariat: string;
  description: string;
  message: string;
}

interface AutreFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  objet: string;
  typeService: string;
  message: string;
}

export function ContactSection() {
  const { toast } = useToast();
  const t = useTranslations("lng");

  const [activeForm, setActiveForm] = useState<FormType>("circuit");

  // État pour formulaire circuit
  const [circuitData, setCircuitData] = useState<CircuitFormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    nbPersonnes: "",
    dateDepart: "",
    circuitDemande: "",
    budget: "",
    duree: "",
    message: "",
  });

  // État pour formulaire partenariat
  const [partenariatData, setPartenariatData] = useState<PartenariatFormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    nomEntreprise: "",
    objet: "",
    typePartenariat: "",
    description: "",
    message: "",
  });

  // État pour formulaire autre
  const [autreData, setAutreData] = useState<AutreFormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    objet: "",
    typeService: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let successMessage = "";
    switch (activeForm) {
      case "circuit":
        successMessage = "Votre demande de circuit a été envoyée !";
        setCircuitData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          adresse: "",
          nbPersonnes: "",
          dateDepart: "",
          circuitDemande: "",
          budget: "",
          duree: "",
          message: "",
        });
        break;
      case "partenariat":
        successMessage = "Votre demande de partenariat a été envoyée !";
        setPartenariatData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          nomEntreprise: "",
          objet: "",
          typePartenariat: "",
          description: "",
          message: "",
        });
        break;
      case "autre":
        successMessage = "Votre demande a été envoyée !";
        setAutreData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          adresse: "",
          objet: "",
          typeService: "",
          message: "",
        });
        break;
    }

    toast({
      title: "Message envoyé !",
      description: successMessage,
    });
  };

  const handleCircuitChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCircuitData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePartenariatChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPartenariatData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAutreChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAutreData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const renderCircuitForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            name="nom"
            value={circuitData.nom}
            onChange={handleCircuitChange}
            required
            className="w-full transition-all duration-300 focus:scale-105"
          />
        </div>
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.5s", animationFillMode: "both" }}
        >
          <Label htmlFor="prenom">Prénom *</Label>
          <Input
            id="prenom"
            name="prenom"
            value={circuitData.prenom}
            onChange={handleCircuitChange}
            required
            className="w-full transition-all duration-300 focus:scale-105"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.6s", animationFillMode: "both" }}
        >
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={circuitData.email}
            onChange={handleCircuitChange}
            required
            className="w-full transition-all duration-300 focus:scale-105"
          />
        </div>
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.7s", animationFillMode: "both" }}
        >
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            name="telephone"
            value={circuitData.telephone}
            onChange={handleCircuitChange}
            className="w-full transition-all duration-300 focus:scale-105"
          />
        </div>
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "0.8s", animationFillMode: "both" }}
      >
        <Label htmlFor="adresse">Adresse *</Label>
        <Input
          id="adresse"
          name="adresse"
          value={circuitData.adresse}
          onChange={handleCircuitChange}
          required
          className="w-full transition-all duration-300 focus:scale-105"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.9s", animationFillMode: "both" }}
        >
          <Label htmlFor="nbPersonnes">Nombre de personnes *</Label>
          <Select
            value={circuitData.nbPersonnes}
            onValueChange={(value) =>
              setCircuitData((prev) => ({ ...prev, nbPersonnes: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                (num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} personne{num > 1 ? "s" : ""}
                  </SelectItem>
                )
              )}
              <SelectItem value="15+">15+ personnes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "1.0s", animationFillMode: "both" }}
        >
          <Label htmlFor="dateDepart">Date de départ *</Label>
          <Input
            id="dateDepart"
            name="dateDepart"
            type="date"
            value={circuitData.dateDepart}
            onChange={handleCircuitChange}
            required
            className="w-full transition-all duration-300 focus:scale-105"
          />
        </div>
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "1.1s", animationFillMode: "both" }}
        >
          <Label htmlFor="duree">Durée du séjour</Label>
          <Select
            value={circuitData.duree}
            onValueChange={(value) =>
              setCircuitData((prev) => ({ ...prev, duree: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3">1-3 jours</SelectItem>
              <SelectItem value="4-7">4-7 jours</SelectItem>
              <SelectItem value="8-14">1-2 semaines</SelectItem>
              <SelectItem value="15-21">2-3 semaines</SelectItem>
              <SelectItem value="22+">Plus de 3 semaines</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "1.2s", animationFillMode: "both" }}
        >
          <Label htmlFor="circuitDemande">Circuit demandé *</Label>
          <Select
            value={circuitData.circuitDemande}
            onValueChange={(value) =>
              setCircuitData((prev) => ({ ...prev, circuitDemande: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un circuit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="andasibe">Andasibe-Mantadia</SelectItem>
              <SelectItem value="ankarana">Ankarana</SelectItem>
              <SelectItem value="isalo">Isalo</SelectItem>
              <SelectItem value="tsingy">Tsingy de Bemaraha</SelectItem>
              <SelectItem value="nosy-be">Nosy Be</SelectItem>
              <SelectItem value="sainte-marie">Sainte-Marie</SelectItem>
              <SelectItem value="circuit-sud">Grand Sud</SelectItem>
              <SelectItem value="circuit-nord">Grand Nord</SelectItem>
              <SelectItem value="circuit-ouest">Côte Ouest</SelectItem>
              <SelectItem value="personnalise">Circuit personnalisé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "1.3s", animationFillMode: "both" }}
        >
          <Label htmlFor="budget">Budget approximatif</Label>
          <Select
            value={circuitData.budget}
            onValueChange={(value) =>
              setCircuitData((prev) => ({ ...prev, budget: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Budget par personne" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500-1000">500€ - 1000€</SelectItem>
              <SelectItem value="1000-2000">1000€ - 2000€</SelectItem>
              <SelectItem value="2000-3000">2000€ - 3000€</SelectItem>
              <SelectItem value="3000+">Plus de 3000€</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "1.4s", animationFillMode: "both" }}
      >
        <Label htmlFor="message">Message complémentaire</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Décrivez vos attentes, préférences, besoins spéciaux..."
          value={circuitData.message}
          onChange={handleCircuitChange}
          rows={4}
          className="w-full transition-all duration-300 focus:scale-105"
        />
      </div>

      <div
        className="animate-bounce-in"
        style={{ animationDelay: "1.5s", animationFillMode: "both" }}
      >
        <Button type="submit" className="w-full hover-glow" size="lg">
          <Route className="w-5 h-5 mr-2" />
          Demander un devis pour ce circuit
        </Button>
      </div>
    </form>
  );

  const renderPartenariatForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            name="nom"
            value={partenariatData.nom}
            onChange={handlePartenariatChange}
            required
            className="transition-all duration-300 focus:scale-105"
          />
        </div>
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.5s", animationFillMode: "both" }}
        >
          <Label htmlFor="prenom">Prénom *</Label>
          <Input
            id="prenom"
            name="prenom"
            value={partenariatData.prenom}
            onChange={handlePartenariatChange}
            required
            className="transition-all duration-300 focus:scale-105"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.6s", animationFillMode: "both" }}
        >
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={partenariatData.email}
            onChange={handlePartenariatChange}
            required
            className="transition-all duration-300 focus:scale-105"
          />
        </div>
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.7s", animationFillMode: "both" }}
        >
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            name="telephone"
            value={partenariatData.telephone}
            onChange={handlePartenariatChange}
            className="transition-all duration-300 focus:scale-105"
          />
        </div>
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "0.8s", animationFillMode: "both" }}
      >
        <Label htmlFor="nomEntreprise">Nom de l'entreprise *</Label>
        <Input
          id="nomEntreprise"
          name="nomEntreprise"
          value={partenariatData.nomEntreprise}
          onChange={handlePartenariatChange}
          required
          className="transition-all duration-300 focus:scale-105"
        />
      </div>

      <div
        className="space-y-2 animate-fade-in w-full"
        style={{ animationDelay: "0.9s", animationFillMode: "both" }}
      >
        <Label htmlFor="typePartenariat">Type de partenariat *</Label>
        <Select
          value={partenariatData.typePartenariat}
          onValueChange={(value) =>
            setPartenariatData((prev) => ({ ...prev, typePartenariat: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vehicule">Partenariat véhicule</SelectItem>
            <SelectItem value="agence">Partenariat agence de voyage</SelectItem>
            <SelectItem value="hotel">Partenariat hôtelier</SelectItem>
            <SelectItem value="restaurant">Partenariat restauration</SelectItem>
            <SelectItem value="guide">Guide touristique</SelectItem>
            <SelectItem value="transport">Compagnie de transport</SelectItem>
            <SelectItem value="activite">Activités touristiques</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "1.0s", animationFillMode: "both" }}
      >
        <Label htmlFor="objet">Objet de la collaboration *</Label>
        <Input
          id="objet"
          name="objet"
          placeholder="Ex: Location de véhicules 4x4, Hébergement touristique..."
          value={partenariatData.objet}
          onChange={handlePartenariatChange}
          required
          className="transition-all duration-300 focus:scale-105"
        />
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "1.1s", animationFillMode: "both" }}
      >
        <Label htmlFor="description">Description de votre entreprise</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Présentez votre entreprise, vos services, votre expérience..."
          value={partenariatData.description}
          onChange={handlePartenariatChange}
          rows={3}
          className="transition-all duration-300 focus:scale-105"
        />
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "1.2s", animationFillMode: "both" }}
      >
        <Label htmlFor="message">Proposition de collaboration</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Décrivez votre proposition de collaboration, conditions, avantages mutuels..."
          value={partenariatData.message}
          onChange={handlePartenariatChange}
          rows={4}
          className="transition-all duration-300 focus:scale-105"
        />
      </div>

      <div
        className="animate-bounce-in"
        style={{ animationDelay: "1.3s", animationFillMode: "both" }}
      >
        <Button type="submit" className="w-full hover-glow" size="lg">
          <Building className="w-5 h-5 mr-2" />
          Envoyer la demande de partenariat
        </Button>
      </div>
    </form>
  );

  const renderAutreForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            name="nom"
            value={autreData.nom}
            onChange={handleAutreChange}
            required
            className="transition-all duration-300 focus:scale-105"
          />
        </div>
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.5s", animationFillMode: "both" }}
        >
          <Label htmlFor="prenom">Prénom *</Label>
          <Input
            id="prenom"
            name="prenom"
            value={autreData.prenom}
            onChange={handleAutreChange}
            required
            className="transition-all duration-300 focus:scale-105"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.6s", animationFillMode: "both" }}
        >
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={autreData.email}
            onChange={handleAutreChange}
            required
            className="transition-all duration-300 focus:scale-105"
          />
        </div>
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.7s", animationFillMode: "both" }}
        >
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            name="telephone"
            value={autreData.telephone}
            onChange={handleAutreChange}
            className="transition-all duration-300 focus:scale-105"
          />
        </div>
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "0.8s", animationFillMode: "both" }}
      >
        <Label htmlFor="adresse">Adresse</Label>
        <Input
          id="adresse"
          name="adresse"
          value={autreData.adresse}
          onChange={handleAutreChange}
          className="transition-all duration-300 focus:scale-105"
        />
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "0.9s", animationFillMode: "both" }}
      >
        <Label htmlFor="typeService">Type de service souhaité</Label>
        <Select
          value={autreData.typeService}
          onValueChange={(value) =>
            setAutreData((prev) => ({ ...prev, typeService: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="circuit-personnalise">
              Circuit personnalisé
            </SelectItem>
            <SelectItem value="transfert-aeroport">
              Transfert aéroport
            </SelectItem>
            <SelectItem value="location-vehicule">
              Location de véhicule seule
            </SelectItem>
            <SelectItem value="guide-prive">Guide privé</SelectItem>
            <SelectItem value="hebergement">Conseil hébergement</SelectItem>
            <SelectItem value="activite-specifique">
              Activité spécifique
            </SelectItem>
            <SelectItem value="organisation-evenement">
              Organisation d'événement
            </SelectItem>
            <SelectItem value="autre">Autre demande</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "1.0s", animationFillMode: "both" }}
      >
        <Label htmlFor="objet">Objet de votre demande *</Label>
        <Input
          id="objet"
          name="objet"
          placeholder="Ex: Organisation mariage à Madagascar, Circuit sur-mesure famille..."
          value={autreData.objet}
          onChange={handleAutreChange}
          required
          className="transition-all duration-300 focus:scale-105"
        />
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "1.1s", animationFillMode: "both" }}
      >
        <Label htmlFor="message">Détails de votre demande *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Décrivez en détail votre demande, vos besoins spécifiques, dates, contraintes particulières..."
          value={autreData.message}
          onChange={handleAutreChange}
          required
          rows={5}
          className="transition-all duration-300 focus:scale-105"
        />
      </div>

      <div
        className="animate-bounce-in"
        style={{ animationDelay: "1.2s", animationFillMode: "both" }}
      >
        <Button type="submit" className="w-full hover-glow" size="lg">
          <Mail className="w-5 h-5 mr-2" />
          Envoyer ma demande
        </Button>
      </div>
    </form>
  );

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
            {t("contact.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Contactez-nous pour organiser votre voyage, devenir partenaire ou
            toute autre demande spécifique
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-8xl mx-auto">
          {/* Contact Information */}
          <div
            className="space-y-8 animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Nos informations de contact
              </h3>
              <div className="space-y-4">
                <div
                  className="flex items-center gap-4 animate-fade-in hover-lift"
                  style={{ animationDelay: "0.4s", animationFillMode: "both" }}
                >
                  <Phone className="h-6 w-6 text-primary animate-float" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-muted-foreground">+261 34 12 345 67</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-4 animate-fade-in hover-lift"
                  style={{ animationDelay: "0.5s", animationFillMode: "both" }}
                >
                  <Mail
                    className="h-6 w-6 text-primary animate-float"
                    style={{ animationDelay: "1s" }}
                  />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      contact@madachaland.mg
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-4 animate-fade-in hover-lift"
                  style={{ animationDelay: "0.6s", animationFillMode: "both" }}
                >
                  <MapPin
                    className="h-6 w-6 text-primary animate-float"
                    style={{ animationDelay: "2s" }}
                  />
                  <div>
                    <p className="font-medium">Adresse</p>
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
          <Card
            className="animate-scale-in hover-lift"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <CardHeader>
              <CardTitle>Contactez-nous</CardTitle>

              {/* Form Type Selector */}
              <div className="flex flex-wrap gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveForm("circuit")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeForm === "circuit"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                  }`}
                >
                  <Route className="w-4 h-4" />
                  Demande de circuit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveForm("partenariat")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeForm === "partenariat"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  Partenariat
                </button>
                <button
                  type="button"
                  onClick={() => setActiveForm("autre")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeForm === "autre"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Autre demande
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Render the appropriate form based on activeForm */}
              {activeForm === "circuit" && renderCircuitForm()}
              {activeForm === "partenariat" && renderPartenariatForm()}
              {activeForm === "autre" && renderAutreForm()}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
