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
import { Vehicle } from "@/src/domain/entities/car";
import { VehicleDTO } from "@/src/domain/entities/vehicle";

interface CarBookingProps {
  vehicle?: string | null;
  vehicles?: VehicleDTO[];
  vehicleDetail?: VehicleDTO | null;
  isLoading?: boolean;
  vehicleAvailability: any;
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
  loading: boolean;
  getTodayString: () => string;
  availabilityError: any;
  isDateAvailable: (date: string) => boolean;
  isPeriodAvailable: (startDate: string, endDate: string) => boolean;
  getUnavailableDates: () => Date[];
}

const CarBooking = ({
  vehicle,
  availabilityError,
  vehicleAvailability,
  isDateAvailable,
  isPeriodAvailable,
  getUnavailableDates,
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
  const locale = useLocale()

  // Fonction pour obtenir la date minimale pour endDate
  const getMinEndDate = () => {
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      const nextDay = new Date(startDate);
      nextDay.setDate(startDate.getDate() + 1);

      const year = nextDay.getFullYear();
      const month = String(nextDay.getMonth() + 1).padStart(2, "0");
      const day = String(nextDay.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return getTodayString();
  };

  // Fonction pour obtenir les props des inputs date
  const getDateInputProps = (dateType: "start" | "end") => {
    const unavailableDates = getUnavailableDates();
    const minDate = dateType === "start" ? getTodayString() : getMinEndDate();

    const baseProps = {
      min: minDate,
    };

    // Ajouter un titre informatif sur les dates indisponibles
    if (unavailableDates.length > 0) {
      const unavailableDateStrings = unavailableDates
        .slice(0, 3)
        .map((date) => date.toLocaleDateString("fr-FR"));
      const title = `Dates indisponibles: ${unavailableDateStrings.join(", ")}${
        unavailableDates.length > 3 ? "..." : ""
      }`;

      return {
        ...baseProps,
        title: title,
      };
    }

    return baseProps;
  };

  // Fonction personnalisée pour gérer le changement de date de début
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;

    // Vérifier si la date est disponible
    if (newStartDate && !isDateAvailable(newStartDate)) {
      alert(
        "Cette date n'est pas disponible. Veuillez choisir une autre date."
      );
      return;
    }

    handleChange(e);
  };

  // Fonction personnalisée pour gérer le changement de date de fin
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;

    // Vérifier si la période est disponible
    if (
      formData.startDate &&
      newEndDate &&
      !isPeriodAvailable(formData.startDate, newEndDate)
    ) {
      alert(
        "La période sélectionnée n'est pas disponible. Veuillez choisir d'autres dates."
      );
      return;
    }

    handleChange(e);
  };

  // Fonction pour obtenir les classes CSS en fonction de la disponibilité
  const getDateInputClass = (dateType: "start" | "end") => {
    const baseClass = "transition-all duration-300 focus:scale-105 ";

    if (
      dateType === "start" &&
      formData.startDate &&
      !isDateAvailable(formData.startDate)
    ) {
      return baseClass + "border-red-500 bg-red-50";
    }

    if (
      dateType === "end" &&
      formData.endDate &&
      formData.startDate &&
      !isPeriodAvailable(formData.startDate, formData.endDate)
    ) {
      return baseClass + "border-red-500 bg-red-50";
    }

    return baseClass;
  };

  const vehicleName = vehicleDetail?.name ? JSON.parse(vehicleDetail.name) : { fr: "", en: "" };

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
            disabled={isLoading || !!vehicle}
          >
            <SelectTrigger className="w-full transition-all duration-300 focus:scale-105">
              <SelectValue
                placeholder={
                  isLoading
                    ? `${locale === "fr" ? "Chargement des véhicules..." : "Loading vehicles..."}`
                    : `${locale === "fr" ? "Sélectionnez un véhicule" : "Select a vehicle"}`
                }
              />
            </SelectTrigger>
            <SelectContent>
              {vehicles?.map((vehicle) => {
                const carName = vehicle.name ? JSON.parse(vehicle.name) : { fr: "", en: "" };
                return(
                  <SelectItem
                  key={vehicle.id || vehicle.id}
                  value={vehicle.id || vehicle.id}
                >
                  {locale === "fr" ? carName.fr : carName.en}
                </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {vehicle && vehicleDetail && (
            <p className="text-sm text-muted-foreground">
              {t("book.form.selectedCar")} : {locale === "fr" ? vehicleName.fr : vehicleName.en}
            </p>
          )}
        </div>

        {/* Affichage des informations de disponibilité */}
        {vehicleAvailability && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
            <h4 className="font-semibold text-blue-800 mb-2">
              {t("book.cardDispo")}
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              {/* <p>
                ✅ Véhicule{" "}
                {vehicleAvailability?.isAvailable
                  ? "disponible"
                  : "non disponible"}
              </p>
              <p>
                📅 Réservations actives :{" "}
                {vehicleAvailability?.activeReservationsCount}
              </p> */}
              {vehicleAvailability?.bookedDates.length > 0 && (
                <div>
                  <p className="font-medium mt-2">🚫 {t("book.resPeriod")} :</p>
                  <ul className="list-disc list-inside ml-2">
                    {vehicleAvailability?.bookedDates?.map(
                      (booked: any, index: number) => (
                        <li key={index}>
                          Du{" "}
                          {new Date(booked.startDate).toLocaleDateString(
                            "fr-FR"
                          )} {" "}
                          {t("book.at")} {" "}
                          {new Date(booked.endDate).toLocaleDateString("fr-FR")}
                          {booked.status && ` (${booked.status})`}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

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
              <Label htmlFor="nbrChild">{t("book.form.nbrChildren")}</Label>
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
            <Label htmlFor="startDate">{t("book.form.startDate")} *</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleStartDateChange}
              className={getDateInputClass("start")}
              {...getDateInputProps("start")}
            />
            {formData.startDate && !isDateAvailable(formData.startDate) && (
              <p className="text-red-500 text-sm">
                {locale === "fr" ? "⚠️ Cette date n'est pas disponible" : "⚠️ This date is not available"}
              </p>
            )}
          </div>
          <div
            className="space-y-2 animate-fade-in"
            style={{
              animationDelay: "1.2s",
              animationFillMode: "both",
            }}
          >
            <Label htmlFor="endDate">{t("book.form.endDate")} *</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleEndDateChange}
              className={getDateInputClass("end")}
              {...getDateInputProps("end")}
            />
            {formData.startDate &&
              formData.endDate &&
              !isPeriodAvailable(formData.startDate, formData.endDate) && (
                <p className="text-red-500 text-sm">
                  {locale === "fr" ? "⚠️ La période sélectionnée n'est pas disponible" : "⚠️ The selected period is not available"}
                </p>
              )}
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
            readOnly
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

        {/* Affichage des erreurs de disponibilité */}
        {availabilityError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
            <p className="text-red-700 text-sm">{availabilityError}</p>
          </div>
        )}

        <div
          className="animate-bounce-in"
          style={{ animationDelay: "1.5s", animationFillMode: "both" }}
        >
          <Button
            disabled={
              loading ||
              (!!formData.startDate && !isDateAvailable(formData.startDate)) ||
              (!!formData.startDate &&
                !!formData.endDate &&
                !isPeriodAvailable(formData.startDate, formData.endDate))
            }
            type="submit"
            className="w-full hover-glow"
            size="lg"
          >
            {loading ? (
              <span>{locale === "fr" ? "Chargement..." : "Loading..."}</span>
            ) : (
              <span>{t("book.form.cta")}</span>
            )}
          </Button>

          {/* Message d'information sur la disponibilité */}
          {(formData.startDate && !isDateAvailable(formData.startDate)) ||
          (formData.startDate &&
            formData.endDate &&
            !isPeriodAvailable(formData.startDate, formData.endDate)) ? (
            <p className="text-red-500 text-sm mt-2 text-center">
              {locale === "fr"
                ? "Veuillez corriger les dates avant de réserver"
                : "Please correct the dates before booking"}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default CarBooking;
