import React from "react";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Vehicle } from "@/src/domain/entities/car";

interface CarBookingProps {
  vehicle?: string | null; // Circuit ID passé en paramètre (optionnel)
  vehicles?: Vehicle[]; // Liste des véhicules disponibles
  vehicleDetail?: Vehicle | null; // Détail du véhicule sélectionné
  isLoading?: boolean; // Indicateur de chargement des véhicules
  formData: {
    vehicle: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    address: string;
    personnes: string;
    nbrAdult: string;
    nbrChild: string;
    startDate: string;
    endDate: string;
    duration: string;
    preferences: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCarChange: (value: string) => void;
  handlePersonnesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNbrAdultChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNbrChildChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean; // Indicateur de soumission du formulaire
  getTodayString: () => string; // Fonction pour obtenir la date d'aujourd'hui au format YYYY-MM-DD
}
const CarBooking = ({
  vehicle,
  vehicles,
  vehicleDetail,
  isLoading,
  formData,
  handleChange,
  handleCarChange,
  handlePersonnesChange,
  handleNbrAdultChange,
  handleNbrChildChange,
  handleSubmit,
  loading,
  getTodayString,
}: CarBookingProps) => {
  const t = useTranslations("lng");
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Circuit */}
        <div
          className="space-y-2 animate-fade-in"
          style={{
            animationDelay: "0.4s",
            animationFillMode: "both",
          }}
        >
          <Label htmlFor="circuit">{t("book.form.car")} *</Label>
          <Select
            value={formData.vehicle}
            onValueChange={handleCarChange}
            disabled={isLoading || !!vehicle} // Désactivé si circuit en paramètre
          >
            <SelectTrigger className="w-full transition-all duration-300 focus:scale-105">
              <SelectValue
                placeholder={
                  isLoading
                    ? "Chargement des véhicules..."
                    : "Sélectionnez un véhicule"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {vehicles?.map((vehicle) => (
                <SelectItem
                  key={vehicle.id || vehicle.id}
                  value={vehicle.id || vehicle.id}
                >
                  {vehicle.name || vehicle.name || vehicle.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {vehicle && vehicleDetail && (
            <p className="text-sm text-muted-foreground">
              Véhicule sélectionné : {vehicleDetail.name}
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
          <Label htmlFor="address">{t("book.form.address")} *</Label>
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
          <Label htmlFor="personnes">{t("book.form.personNumber")} *</Label>
          <Input
            id="personnes"
            name="personnes"
            type="number"
            min="1"
            value={formData.personnes}
            onChange={handlePersonnesChange}
            required
            className="transition-all duration-300 focus:scale-105"
          />
        </div>

        {/* Champs nbrAdult et nbrChild qui s'affichent seulement si personnes > 0 */}
        {formData.personnes && parseInt(formData.personnes) > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              className="space-y-2 animate-fade-in"
              style={{
                animationDelay: "1s",
                animationFillMode: "both",
              }}
            >
              <Label htmlFor="nbrAdult">Nombre d'adultes *</Label>
              <Input
                id="nbrAdult"
                name="nbrAdult"
                type="number"
                min="0"
                max={formData.personnes}
                value={formData.nbrAdult}
                onChange={handleNbrAdultChange}
                required
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
            <div
              className="space-y-2 animate-fade-in"
              style={{
                animationDelay: "1.1s",
                animationFillMode: "both",
              }}
            >
              <Label htmlFor="nbrChild">Nombre d'enfants</Label>
              <Input
                id="nbrChild"
                name="nbrChild"
                type="number"
                min="0"
                max={Math.max(
                  0,
                  parseInt(formData.personnes) -
                    parseInt(formData.nbrAdult || "0")
                )}
                value={formData.nbrChild}
                onChange={handleNbrChildChange}
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            className="space-y-2 animate-fade-in"
            style={{
              animationDelay: "1.2s",
              animationFillMode: "both",
            }}
          >
            <Label htmlFor="startDate">{t("book.form.startDate")}</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              min={getTodayString()}
              value={formData.startDate}
              onChange={handleChange}
              className="transition-all duration-300 focus:scale-105"
            />
          </div>
          <div
            className="space-y-2 animate-fade-in"
            style={{
              animationDelay: "1.2s",
              animationFillMode: "both",
            }}
          >
            <Label htmlFor="endDate">{t("book.form.endDate")}</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              min={formData.startDate || getTodayString()}
              value={formData.endDate}
              onChange={handleChange}
              className="transition-all duration-300 focus:scale-105 bg-muted"
            />
          </div>
        </div>

        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "1.3s", animationFillMode: "both" }}
        >
          <Label htmlFor="duration">{t("book.form.duration")}</Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="transition-all duration-300 focus:scale-105 bg-muted"
          />
        </div>

        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "1.4s", animationFillMode: "both" }}
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
          style={{ animationDelay: "1.5s", animationFillMode: "both" }}
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
    </div>
  );
};

export default CarBooking;
