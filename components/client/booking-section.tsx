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
import { useToast } from "@/hooks/shared/use-toast";
import { useTranslations } from "use-intl";
import { useSearchParams } from "next/navigation";
import { useClientCircuit } from "../providers/client/ClientCircuitProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useBooking } from "../providers/client/ClientBookingProvider";

export function BookingSection() {
  const t = useTranslations("lng");

  const params = useSearchParams();
  const circuit = params.get("circuit");
  console.log("CR", circuit);
  const { createReservation, loading, success } = useBooking();

  const {
    circuitDetail,
    getCircuitById,
    addedCircuits,
    fetchCircuits,
    isLoading,
  } = useClientCircuit();

  useEffect(() => {
    const loadCircuits = async () => {
      await fetchCircuits();
    };
    loadCircuits();
  }, []);

  useEffect(() => {
    if (circuit) {
      getCircuitById(circuit.toString());
    }
  }, [circuit]);

  console.log("CR D", circuitDetail);

  const [formData, setFormData] = useState({
    circuit: circuit ? circuit : "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    address: "",
    personnes: "",
    startDate: "",
    endDate: "",
    duration: "",
    preferences: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      circuit: formData.circuit,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      address: formData.address,
      personnes: formData.personnes,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: formData.duration,
      preferences: formData.preferences,
    };
    const res = await createReservation(data);

    console.log("RESS", res);
    if (success) {
      setFormData({
        circuit: circuit ? circuit : "",
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        address: "",
        personnes: "",
        startDate: "",
        endDate: "",
        duration: "",
        preferences: "",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCircuitChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      circuit: value,
    }));
    // Charger les détails du circuit sélectionné
    getCircuitById(value);
  };

  // Duration = difference entre formdata.endDate et startDate
  const duration = (() => {
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      // Calculate difference in milliseconds
      const diffTime = endDate.getTime() - startDate.getTime();

      // Convert to days
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Return 0 if end date is before start date
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  })();

  console.log("DURATION", duration);

  // If you want to update the formData with the calculated duration
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setFormData((prev) => ({
        ...prev,
        duration: diffDays > 0 ? diffDays.toString() : "0",
      }));
    }
  }, [formData.startDate, formData.endDate]);

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <section id="reservation" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
              {t("book.title")}
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              {t("book.subtitle")}
            </p>
          </div>

          <Card
            className="animate-scale-in hover-lift"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <CardHeader>
              <CardTitle>{t("book.form.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Circuit */}
                <div
                  className="space-y-2 animate-fade-in"
                  style={{
                    animationDelay: "0.4s",
                    animationFillMode: "both",
                  }}
                >
                  <Label htmlFor="circuit">{t("book.form.circuit")} *</Label>
                  <Select
                    value={formData.circuit}
                    onValueChange={handleCircuitChange}
                    disabled={isLoading || !!circuit} // Désactivé si circuit en paramètre
                  >
                    <SelectTrigger className="w-full transition-all duration-300 focus:scale-105">
                      <SelectValue
                        placeholder={
                          isLoading
                            ? "Chargement des circuits..."
                            : "Sélectionnez un circuit"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {addedCircuits?.map((circuitItem) => (
                        <SelectItem
                          key={circuitItem.id || circuitItem._id}
                          value={circuitItem.id || circuitItem._id}
                        >
                          {circuitItem.title ||
                            circuitItem.nom ||
                            `Circuit ${circuitItem.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {circuit && circuitDetail && (
                    <p className="text-sm text-muted-foreground">
                      Circuit sélectionné :{" "}
                      {circuitDetail.title || circuitDetail.nom}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className="space-y-2 animate-fade-in"
                    style={{
                      animationDelay: "0.5s",
                      animationFillMode: "both",
                    }}
                  >
                    <Label htmlFor="nom">{t("book.form.name")} *</Label>
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
                    style={{
                      animationDelay: "0.6s",
                      animationFillMode: "both",
                    }}
                  >
                    <Label htmlFor="prenom">{t("book.form.firstname")} *</Label>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div
                    className="space-y-2 animate-fade-in"
                    style={{
                      animationDelay: "0.7s",
                      animationFillMode: "both",
                    }}
                  >
                    <Label htmlFor="email">{t("book.form.email")} *</Label>
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
                    style={{
                      animationDelay: "0.8s",
                      animationFillMode: "both",
                    }}
                  >
                    <Label htmlFor="telephone">{t("book.form.phone")}</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="transition-all duration-300 focus:scale-105"
                    />
                  </div>
                </div>

                <div
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: "0.9s", animationFillMode: "both" }}
                >
                  <Label htmlFor="address">
                    {t("book.form.address")} *
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ex. Lot IIA xxx"
                    required
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: "0.9s", animationFillMode: "both" }}
                >
                  <Label htmlFor="personnes">
                    {t("book.form.personNumber")} *
                  </Label>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div
                    className="space-y-2 animate-fade-in"
                    style={{ animationDelay: "1s", animationFillMode: "both" }}
                  >
                    <Label htmlFor="startDate">
                      {t("book.form.startDate")}
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      min={getTodayString()}
                      value={formData.startDate}
                      onChange={handleChange}
                      className="transition-all duration-300 focus:scale-105 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </div>
                  <div
                    className="space-y-2 animate-fade-in"
                    style={{ animationDelay: "1s", animationFillMode: "both" }}
                  >
                    <Label htmlFor="dates">{t("book.form.endDate")}</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      min={formData.startDate}
                      value={formData.endDate}
                      onChange={handleChange}
                      className="transition-all duration-300 focus:scale-105 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </div>
                </div>

                <div
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: "1.1s", animationFillMode: "both" }}
                >
                  <Label htmlFor="preferences">{t("book.form.duration")}</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={duration}
                    disabled
                    onChange={handleChange}
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: "1.1s", animationFillMode: "both" }}
                >
                  <Label htmlFor="preferences">{t("book.form.nb")}</Label>
                  <Textarea
                    id="preferences"
                    name="preferences"
                    placeholder={t("book.form.nbPL")}
                    value={formData.preferences}
                    onChange={handleChange}
                    rows={4}
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div
                  className="animate-bounce-in"
                  style={{ animationDelay: "1.2s", animationFillMode: "both" }}
                >
                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full hover-glow"
                    size="lg"
                  >
                    {loading ? (
                      <span>Loading...</span>
                    ) : (
                      <span>{t("book.form.cta")}</span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
