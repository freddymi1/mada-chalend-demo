"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { useToast } from "@/hooks/shared/use-toast";
import { useLocale, useTranslations } from "use-intl";
import { useClientCircuit } from "../providers/client/ClientCircuitProvider";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useCiContact } from "../providers/client/ClContactProvider";
import AnimateLoading from "./animate-loading";

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
  const t = useTranslations("lng.contact");
  const locale = useLocale();

  const [activeForm, setActiveForm] = useState<FormType>("circuit");
  const [loading, setLoading] = useState(false);

  const { addedCircuits, fetchCircuits, isLoading } = useClientCircuit();

  const { contacts, loading: pageLoading, fetchContacts } = useCiContact();
  const currentLang = locale.toUpperCase() as "FR" | "EN";

  useEffect(() => {
    const loadContacts = async () => {
      await fetchContacts();
    };
    loadContacts();
  }, []);

  const profile = contacts[0];

  useEffect(() => {
    const loadCircuits = async () => {
      await fetchCircuits();
    };
    loadCircuits();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let successMessage = "";
    let payload: any = null;

    switch (activeForm) {
      case "circuit":
        payload = { ...circuitData, type: "circuit" };
        successMessage = t("success.circuit");
        break;

      case "partenariat":
        payload = { ...partenariatData, type: "partenariat" };
        successMessage = t("success.partenariat");
        break;

      case "autre":
        payload = { ...autreData, type: "autre" };
        successMessage = t("success.autre");
        break;
    }

    if (!payload) return;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        toast({
          title: t("toast.successTitle"),
          description: successMessage,
        });

        setLoading(false);

        // Reset des formulaires
        if (activeForm === "circuit") {
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
        } else if (activeForm === "partenariat") {
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
        } else if (activeForm === "autre") {
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
        }
      } else {
        toast({
          title: t("toast.errorTitle"),
          description: t("toast.errorMessage"),
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur handleSubmit:", error);
      toast({
        title: t("toast.serverErrorTitle"),
        description: t("toast.serverErrorMessage"),
        variant: "destructive",
      });
    }
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
          <Label htmlFor="nom">{t("circuitForm.fields.lastName")}</Label>
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
          <Label htmlFor="prenom">{t("circuitForm.fields.firstName")}</Label>
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
          <Label htmlFor="email">{t("circuitForm.fields.email")}</Label>
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
          <Label htmlFor="telephone">{t("circuitForm.fields.phone")}</Label>
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
        <Label htmlFor="adresse">{t("circuitForm.fields.address")}</Label>
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
          <Label htmlFor="nbPersonnes">
            {t("circuitForm.fields.peopleCount")}
          </Label>
          <Select
            value={circuitData.nbPersonnes}
            onValueChange={(value) =>
              setCircuitData((prev) => ({ ...prev, nbPersonnes: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("circuitForm.placeholders.selectPeople")}
              />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                (num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}{" "}
                    {num === 1
                      ? t("circuitForm.options.people.single")
                      : t("circuitForm.options.people.plural")}
                  </SelectItem>
                )
              )}
              <SelectItem value="15+">
                {t("circuitForm.options.people.moreThan15")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "1.0s", animationFillMode: "both" }}
        >
          <Label htmlFor="dateDepart">
            {t("circuitForm.fields.departureDate")}
          </Label>
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
          <Label htmlFor="duree">{t("circuitForm.fields.duration")}</Label>
          <Select
            value={circuitData.duree}
            onValueChange={(value) =>
              setCircuitData((prev) => ({ ...prev, duree: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("circuitForm.placeholders.selectDuration")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3">
                {t("circuitForm.options.duration.1-3")}
              </SelectItem>
              <SelectItem value="4-7">
                {t("circuitForm.options.duration.4-7")}
              </SelectItem>
              <SelectItem value="8-14">
                {t("circuitForm.options.duration.8-14")}
              </SelectItem>
              <SelectItem value="15-21">
                {t("circuitForm.options.duration.15-21")}
              </SelectItem>
              <SelectItem value="22+">
                {t("circuitForm.options.duration.22+")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "1.2s", animationFillMode: "both" }}
        >
          <Label htmlFor="circuitDemande">
            {t("circuitForm.fields.circuitRequest")}
          </Label>
          <Select
            value={circuitData.circuitDemande}
            onValueChange={(value) =>
              setCircuitData((prev) => ({ ...prev, circuitDemande: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("circuitForm.placeholders.selectCircuit")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("circuitForm.placeholders.selectCircuit")}
              </SelectItem>
              {addedCircuits.map((cr) => {
                const crTitle = cr.title ? JSON.parse(cr.title as any) : "";
                return (
                  <SelectItem key={cr.id} value={cr.id}>
                    {locale === "fr" ? crTitle.fr : crTitle.en}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "1.3s", animationFillMode: "both" }}
        >
          <Label htmlFor="budget">{t("circuitForm.fields.budget")}</Label>
          <Select
            value={circuitData.budget}
            onValueChange={(value) =>
              setCircuitData((prev) => ({ ...prev, budget: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("circuitForm.placeholders.selectBudget")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500-1000">
                {t("circuitForm.options.budget.500-1000")}
              </SelectItem>
              <SelectItem value="1000-2000">
                {t("circuitForm.options.budget.1000-2000")}
              </SelectItem>
              <SelectItem value="2000-3000">
                {t("circuitForm.options.budget.2000-3000")}
              </SelectItem>
              <SelectItem value="3000+">
                {t("circuitForm.options.budget.3000+")}
              </SelectItem>
              <SelectItem value="flexible">
                {t("circuitForm.options.budget.flexible")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "1.4s", animationFillMode: "both" }}
      >
        <Label htmlFor="message">{t("circuitForm.fields.message")}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t("circuitForm.placeholders.message")}
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
          {t("circuitForm.submit")}
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
          <Label htmlFor="nom">{t("partnershipForm.fields.lastName")}</Label>
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
          <Label htmlFor="prenom">
            {t("partnershipForm.fields.firstName")}
          </Label>
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
          <Label htmlFor="email">{t("partnershipForm.fields.email")}</Label>
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
          <Label htmlFor="telephone">{t("partnershipForm.fields.phone")}</Label>
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
        <Label htmlFor="nomEntreprise">
          {t("partnershipForm.fields.companyName")}
        </Label>
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
        <Label htmlFor="typePartenariat">
          {t("partnershipForm.fields.partnershipType")}
        </Label>
        <Select
          value={partenariatData.typePartenariat}
          onValueChange={(value) =>
            setPartenariatData((prev) => ({ ...prev, typePartenariat: value }))
          }
        >
          <SelectTrigger>
            <SelectValue
              placeholder={t(
                "partnershipForm.placeholders.selectPartnershipType"
              )}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vehicule">
              {t("partnershipForm.partnershipTypes.vehicle")}
            </SelectItem>
            <SelectItem value="agence">
              {t("partnershipForm.partnershipTypes.agency")}
            </SelectItem>
            <SelectItem value="hotel">
              {t("partnershipForm.partnershipTypes.hotel")}
            </SelectItem>
            <SelectItem value="restaurant">
              {t("partnershipForm.partnershipTypes.restaurant")}
            </SelectItem>
            <SelectItem value="guide">
              {t("partnershipForm.partnershipTypes.guide")}
            </SelectItem>
            <SelectItem value="transport">
              {t("partnershipForm.partnershipTypes.transport")}
            </SelectItem>
            <SelectItem value="activite">
              {t("partnershipForm.partnershipTypes.activity")}
            </SelectItem>
            <SelectItem value="autre">
              {t("partnershipForm.partnershipTypes.other")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "1.0s", animationFillMode: "both" }}
      >
        <Label htmlFor="objet">
          {t("partnershipForm.fields.collaborationSubject")}
        </Label>
        <Input
          id="objet"
          name="objet"
          placeholder={t("partnershipForm.placeholders.collaborationSubject")}
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
        <Label htmlFor="description">
          {t("partnershipForm.fields.companyDescription")}
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder={t("partnershipForm.placeholders.companyDescription")}
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
        <Label htmlFor="message">
          {t("partnershipForm.fields.collaborationProposal")}
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t("partnershipForm.placeholders.collaborationProposal")}
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
        <Button
          disabled={loading}
          type="submit"
          className="w-full hover-glow"
          size="lg"
        >
          <Building className="w-5 h-5 mr-2" />
          {t("partnershipForm.submit")}
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
          <Label htmlFor="nom">{t("otherForm.fields.lastName")}</Label>
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
          <Label htmlFor="prenom">{t("otherForm.fields.firstName")}</Label>
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
          <Label htmlFor="email">{t("otherForm.fields.email")}</Label>
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
          <Label htmlFor="telephone">{t("otherForm.fields.phone")}</Label>
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
        <Label htmlFor="adresse">{t("otherForm.fields.address")}</Label>
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
        <Label htmlFor="typeService">{t("otherForm.fields.serviceType")}</Label>
        <Select
          value={autreData.typeService}
          onValueChange={(value) =>
            setAutreData((prev) => ({ ...prev, typeService: value }))
          }
        >
          <SelectTrigger>
            <SelectValue
              placeholder={t("otherForm.placeholders.selectService")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="circuit-personnalise">
              {t("otherForm.serviceTypes.custom-circuit")}
            </SelectItem>
            <SelectItem value="transfert-aeroport">
              {t("otherForm.serviceTypes.airport-transfer")}
            </SelectItem>
            <SelectItem value="location-vehicule">
              {t("otherForm.serviceTypes.vehicle-rental")}
            </SelectItem>
            <SelectItem value="guide-prive">
              {t("otherForm.serviceTypes.private-guide")}
            </SelectItem>
            <SelectItem value="hebergement">
              {t("otherForm.serviceTypes.accommodation")}
            </SelectItem>
            <SelectItem value="activite-specifique">
              {t("otherForm.serviceTypes.specific-activity")}
            </SelectItem>
            <SelectItem value="organisation-evenement">
              {t("otherForm.serviceTypes.event-organization")}
            </SelectItem>
            <SelectItem value="autre">
              {t("otherForm.serviceTypes.other")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className="space-y-2 animate-fade-in"
        style={{ animationDelay: "1.0s", animationFillMode: "both" }}
      >
        <Label htmlFor="objet">{t("otherForm.fields.requestSubject")}</Label>
        <Input
          id="objet"
          name="objet"
          placeholder={t("otherForm.placeholders.requestSubject")}
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
        <Label htmlFor="message">{t("otherForm.fields.requestDetails")}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t("otherForm.placeholders.requestDetails")}
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
          {t("otherForm.submit")}
        </Button>
      </div>
    </form>
  );

  if (pageLoading) {
    return <AnimateLoading />;
  }

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t("subtitle")}
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
                {t("contactInfo.title")}
              </h3>
              <div className="space-y-4">
                <div
                  className="flex items-center gap-4 animate-fade-in hover-lift"
                  style={{ animationDelay: "0.4s", animationFillMode: "both" }}
                >
                  <FaWhatsapp className="h-6 w-6 text-primary animate-float" />
                  <div>
                    <p className="font-medium">{t("contactInfo.whatsapp")}</p>
                    <p className="text-muted-foreground">{profile?.whatsapp}</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-4 animate-fade-in hover-lift"
                  style={{ animationDelay: "0.4s", animationFillMode: "both" }}
                >
                  <Phone className="h-6 w-6 text-primary animate-float" />
                  <div>
                    <p className="font-medium">{t("contactInfo.phone")}</p>
                    <p className="text-muted-foreground">{profile?.phone}</p>
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
                    <p className="font-medium">{t("contactInfo.email")}</p>
                    <p className="text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                </div>
                <div>
                  <a
                    href={profile?.fbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 transition-all duration-300"
                  >
                    <FaFacebook className="h-6 w-6 text-primary animate-float" />
                    <div>
                      <p className="font-medium">{t("contactInfo.followUs")}</p>
                      <p className="text-muted-foreground hover:text-foreground">
                        {t("contactInfo.facebook")}
                      </p>
                    </div>
                  </a>
                </div>
                <div>
                  <a
                    href={profile?.instaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 transition-all duration-300"
                  >
                    <FaInstagram className="h-6 w-6 text-primary animate-float" />
                    <div>
                      <p className="font-medium">{t("contactInfo.followUs")}</p>
                      <p className="text-muted-foreground hover:text-foreground">
                        {t("contactInfo.instagram")}
                      </p>
                    </div>
                  </a>
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
                    <p className="font-medium">{t("contactInfo.address")}</p>
                    <p className="text-muted-foreground">
                      {profile?.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card
            className="animate-scale-in bg-white/50 hover-lift"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <CardHeader>
              <CardTitle>{t("form.title")}</CardTitle>

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
                  {t("form.circuitButton.text")}
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
                  {t("form.partnershipButton.text")}
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
                  {t("form.otherButton.text")}
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
