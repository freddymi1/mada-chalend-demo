import React from "react";
import { Button } from "./ui/button";
import { useLocale, useTranslations } from "next-intl";
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
import { TripTravel } from "@/src/domain/entities/trip";
import { formatDate } from "./trip-screen";

interface PropsData {
  trip?: string | null; // Trip ID passé en paramètre (optionnel)
  tripDetail?: TripTravel | null; // Détails du trip passé en paramètre (optionnel)
  addedTrips?: any[]; // Liste des trips disponibles
  isLoading?: boolean; // Indicateur de chargement des trips
  formData: {
    tripTravel: string;
    travelDate: string;
    langue: string;
    autreLangue: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    address: string;
    personnes: string;
    nbrAdult: string;
    nbrChild: string;
    nbrAge2_3: string;
    nbrAge4_7: string;
    nbrAge8_10: string;
    nbrAge11: string;
    preferences: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleTripChange: (value: string) => void;
  handlePersonnesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNbrAdultChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNbrChildChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean; // Indicateur de soumission du formulaire
  getTodayString: () => string; // Fonction pour obtenir la date actuelle au format YYYY-MM-DD
  handleTravelDatesChange: (date: string) => void;
  showAutreLangue: boolean;
  handleLangueChange: (langue: string) => void;
  handleAutreLangueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TripBooking = ({
  trip,
  tripDetail,
  addedTrips,
  isLoading = false,
  formData,
  handleChange,
  handleTripChange,
  handlePersonnesChange,
  handleNbrAdultChange,
  handleNbrChildChange,
  handleSubmit,
  loading,
  getTodayString,
  handleTravelDatesChange,
  showAutreLangue,
  handleLangueChange,
  handleAutreLangueChange,
}: PropsData) => {
  const t = useTranslations("lng");
  const locale = useLocale();
  console.log("DATES", tripDetail?.travelDates);
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
          <Label htmlFor="trip">{t("book.form.trip")} *</Label>
          <Select
            value={formData.tripTravel}
            onValueChange={handleTripChange}
            disabled={isLoading || !!trip} // Désactivé si trip en paramètre
          >
            <SelectTrigger className="w-full transition-all duration-300 focus:scale-105">
              <SelectValue
                placeholder={
                  isLoading ? "Chargement des trips..." : "Sélectionnez un trip"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {addedTrips?.map((tripItem) => {
                const title = JSON.parse(tripItem.title);
                return (
                  <SelectItem
                    key={tripItem.id || tripItem._id}
                    value={tripItem.id || tripItem._id}
                  >
                    {locale === "fr" ? title.fr : title.en}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {trip && tripDetail && (
            <p className="text-sm text-muted-foreground">
              {t("book.form.selectedTrip")} : {tripDetail.title || ""}
            </p>
          )}
        </div>

        {/* Select travel dates */}
        <div className="space-y-2 animate-fade-in">
          <Label htmlFor="travelDates">{t("book.form.travelDates")} *</Label>
          <Select
            value={formData.travelDate}
            onValueChange={handleTravelDatesChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full transition-all duration-300 focus:scale-105">
              <SelectValue
                placeholder={
                  isLoading
                    ? "Chargement des dates..."
                    : "Sélectionnez des dates"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {tripDetail?.travelDates.map((date) => (
                <SelectItem key={date.id} value={date.id}>
                  {formatDate(date.startDate)} → {formatDate(date.endDate)} :{" "}
                  <span className="font-semibold">
                    {date.placesDisponibles}/{date.maxPeople} places disponibles
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select langue */}

        <div
          className="space-y-2 animate-fade-in"
          style={{
            animationDelay: "0.5s",
            animationFillMode: "both",
          }}
        >
          <Label>{t("book.form.language")} *</Label>
          <div className="flex my-4 flex-row gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="langue-fr"
                name="langue"
                value="fr"
                checked={formData.langue === "fr"}
                onChange={() => handleLangueChange("fr")}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <Label htmlFor="langue-fr" className="cursor-pointer font-normal">
                {locale === "fr" ? "Français" : "French"}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="langue-en"
                name="langue"
                value="en"
                checked={formData.langue === "en"}
                onChange={() => handleLangueChange("en")}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <Label htmlFor="langue-en" className="cursor-pointer font-normal">
                {locale === "fr" ? "Anglais" : "English"}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="langue-autre"
                name="langue"
                value="autre"
                checked={formData.langue === "autre" || showAutreLangue}
                onChange={() => handleLangueChange("autre")}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <Label
                htmlFor="langue-autre"
                className="cursor-pointer font-normal"
              >
                {locale === "fr" ? "Autre" : "Other"}
              </Label>
            </div>
          </div>
          {showAutreLangue && (
            <div className="mt-2 animate-fade-in">
              <Input
                id="autreLangue"
                name="autreLangue"
                type="text"
                value={formData.autreLangue}
                onChange={handleAutreLangueChange}
                placeholder={
                  locale === "fr" ? "Précisez la langue" : "Specify language"
                }
                required
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
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
              <Label htmlFor="nbrAdult">{t("book.form.nbrAdult")} *</Label>
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
              <Label htmlFor="nbrChild">{t("book.form.nbrChildren")} *</Label>
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

        {formData.nbrChild && parseInt(formData.nbrChild) > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 p-4 rounded-lg bg-white/5 gap-4">
            <div
              className="space-y-2 animate-fade-in"
              style={{
                animationDelay: "1s",
                animationFillMode: "both",
              }}
            >
              <Label htmlFor="nbrAge2_3">
                2 {t("book.form.to")} 3 {t("book.form.yearsOld")} *
              </Label>
              <Input
                id="nbrAge2_3"
                name="nbrAge2_3"
                type="number"
                min="0"
                max={formData.personnes}
                value={formData.nbrAge2_3}
                onChange={handleChange}
                required
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
            <div
              className="space-y-2 animate-fade-in"
              style={{
                animationDelay: "1s",
                animationFillMode: "both",
              }}
            >
              <Label htmlFor="nbrAge4_7">
                4 {t("book.form.to")} 7 {t("book.form.yearsOld")} *
              </Label>
              <Input
                id="nbrAge4_7"
                name="nbrAge4_7"
                type="number"
                min="0"
                max={formData.personnes}
                value={formData.nbrAge4_7}
                onChange={handleChange}
                required
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
            <div
              className="space-y-2 animate-fade-in"
              style={{
                animationDelay: "1s",
                animationFillMode: "both",
              }}
            >
              <Label htmlFor="nbrAge8_10">
                8 {t("book.form.to")} 10 {t("book.form.yearsOld")} *
              </Label>
              <Input
                id="nbrAge8_10"
                name="nbrAge8_10"
                type="number"
                min="0"
                max={formData.personnes}
                value={formData.nbrAge8_10}
                onChange={handleChange}
                required
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
            <div
              className="space-y-2 animate-fade-in"
              style={{
                animationDelay: "1s",
                animationFillMode: "both",
              }}
            >
              <Label htmlFor="nbrAge11">11 {t("book.form.toPlus")} *</Label>
              <Input
                id="nbrAge11"
                name="nbrAge11"
                type="number"
                min="0"
                max={formData.personnes}
                value={formData.nbrAge11}
                onChange={handleChange}
                required
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
          </div>
        )}

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

export default TripBooking;
