"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/client/ui/card";
import { useLocale, useTranslations } from "use-intl";
import { useSearchParams } from "next/navigation";
import { useClientCircuit } from "../providers/client/ClientCircuitProvider";

import { useBooking } from "../providers/client/ClientBookingProvider";
import { extraireJours } from "../helpers/extract-text";
import { useClVehicle } from "../providers/client/ClVehicleProvider";
import CircuitBooking from "./circuit-booking";
import BookingOk from "./booking-ok";
import CarBooking from "./car-booking";
import { useCltTrip } from "../providers/client/TripCltProvider";
import TripBooking from "./trip-booking";
import BookingTripOk from "./booking-trip-ok";

export function TripBookingScreen() {
  const t = useTranslations("lng");
  const locale = useLocale();

  const params = useSearchParams();
  const tripTravel = params.get("trip");

  const { createReservation, loading, success } = useBooking();

  const { addedTrips, tripDetail, fetchTrips, getTripById, isLoading } =
    useCltTrip();

  // État pour le popup de confirmation
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const loadTrips = async () => {
      await fetchTrips();
    };
    loadTrips();
  }, []);

  useEffect(() => {
    if (tripTravel) {
      getTripById(tripTravel.toString());
    }
  }, [tripTravel]);

  const [formData, setFormData] = useState({
    tripTravel: tripTravel ? tripTravel : "",
    travelDate: selectedDate || "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    address: "",
    personnes: "",
    nbrChild: "",
    nbrAdult: "",
    nbrAge2_3: "0",
    nbrAge4_7: "0",
    nbrAge8_10: "0",
    nbrAge11: "0",
    preferences: "",
    startDate: "",
    endDate: "",
    duration: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Vérifier la disponibilité avec votre structure de données
  if (tripDetail?.travelDates) {
    const selectedDate = tripDetail.travelDates.find(
      (date) => date.id === formData.travelDate // ou le champ que vous utilisez pour stocker la date sélectionnée
    );
    
    if (selectedDate && Number(selectedDate.placesDisponibles!) < Number(formData.personnes)) {
      alert(`Désolé, il ne reste que ${selectedDate.placesDisponibles} place(s) disponible(s) pour cette date.`);
      return;
    }
  }

  const data = {
    resType: "trip",
    tripTravel: formData.tripTravel,
    travelDate: formData.travelDate,
    nom: formData.nom,
    prenom: formData.prenom,
    email: formData.email,
    telephone: formData.telephone,
    address: formData.address,
    personnes: formData.personnes,
    nbrChild: formData.nbrChild,
    nbrAdult: formData.nbrAdult,
    nbrAge2_3: formData.nbrAge2_3 || 0,
    nbrAge4_7: formData.nbrAge4_7 || 0,
    nbrAge8_10: formData.nbrAge8_10 || 0,
    nbrAge11: formData.nbrAge11 || 0,
    preferences: formData.preferences,
    startDate: null,
    endDate: null,
    duration: null,
  };

  setPendingFormData(data);
  setShowConfirmDialog(true);
};

  console.log("DATE", formData.travelDate);

  const handleConfirmReservation = async () => {
    if (!pendingFormData) return;

    const res = await createReservation(pendingFormData);

    // if (success) {
    setFormData({
      tripTravel: tripTravel ? tripTravel : "",
      travelDate: selectedDate || "",
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      address: "",
      personnes: "",
      nbrChild: "",
      nbrAdult: "",
      nbrAge2_3: "",
      nbrAge4_7: "",
      nbrAge8_10: "",
      nbrAge11: "",
      preferences: "",
      startDate: "",
      endDate: "",
      duration: "",
    });
    // }

    // Fermer le popup
    setShowConfirmDialog(false);
    setPendingFormData(null);
  };

  const handleCancelReservation = () => {
    setShowConfirmDialog(false);
    setPendingFormData(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Gestion spécifique du changement du nombre de personnes
  const handlePersonnesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPersonnes = e.target.value;
    const personnesNum = parseInt(newPersonnes) || 0;

    setFormData((prev) => ({
      ...prev,
      personnes: newPersonnes,
      nbrAdult: personnesNum > 0 ? personnesNum.toString() : "",
      nbrChild: "0",
    }));
  };

  // Gestion du changement du nombre d'adultes
  const handleNbrAdultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNbrAdult = e.target.value;
    const adultsNum = parseInt(newNbrAdult) || 0;
    const personnesNum = parseInt(formData.personnes) || 0;
    

    // Limiter le nombre d'adultes au nombre total de personnes
    const maxAdults = Math.min(adultsNum, personnesNum);
    const remainingChildren = personnesNum - maxAdults;

    setFormData((prev) => ({
      ...prev,
      nbrAdult: maxAdults.toString(),
      nbrChild: remainingChildren.toString(),
    }));
  };

  // Gestion du changement du nombre d'enfants
  const handleNbrChildChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNbrChild = e.target.value;
    const childrenNum = parseInt(newNbrChild) || 0;
    const personnesNum = parseInt(formData.personnes) || 0;
    const adultsNum = parseInt(formData.nbrAdult) || 0;

    // Limiter le nombre d'enfants pour que le total ne dépasse pas le nombre de personnes
    const maxChildren = Math.min(childrenNum, personnesNum - adultsNum);

    setFormData((prev) => ({
      ...prev,
      nbrChild: Math.max(0, maxChildren).toString(),
    }));
  };

  const handleTripChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      tripTravel: value,
    }));
    // Charger les détails du trip sélectionné
    getTripById(value);
  };

  // Fonction pour calculer la date de fin
  const calculateEndDate = (
    startDate: string,
    durationInDays: number
  ): string => {
    if (!startDate || !durationInDays) return "";

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + durationInDays - 1); // -1 car si c'est 3 jours, ça finit le 3ème jour

    const year = end.getFullYear();
    const month = String(end.getMonth() + 1).padStart(2, "0");
    const day = String(end.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fonction pour formater les dates pour l'affichage
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Trouver le nom du circuit sélectionné
  const getTripName = (tripId: string) => {
    const selectedTrip = addedTrips?.find((c) => (c.id || c.id) === tripId);
    const tripname = JSON.parse(selectedTrip?.title || "{}");
    return locale === "fr" ? tripname.fr : tripname.en || "Trip sélectionné";
  };

  const handleTravelDatesChange = (date: string) => {
    setFormData((prev) => ({
      ...prev,
      travelDate: date,
    }));
  };

  return (
    <section id="reservation" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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
              <TripBooking
                trip={tripTravel}
                tripDetail={tripDetail}
                addedTrips={addedTrips}
                isLoading={isLoading}
                formData={formData}
                handleChange={handleChange}
                handleTripChange={handleTripChange}
                handlePersonnesChange={handlePersonnesChange}
                handleNbrAdultChange={handleNbrAdultChange}
                handleNbrChildChange={handleNbrChildChange}
                handleSubmit={handleSubmit}
                loading={loading}
                getTodayString={getTodayString}
                handleTravelDatesChange={handleTravelDatesChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popup de confirmation */}

      <BookingTripOk
        resType={"trip"}
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
        pendingFormData={pendingFormData}
        loading={loading}
        handleCancelReservation={handleCancelReservation}
        handleConfirmReservation={handleConfirmReservation}
        getTripName={getTripName}
        formatDate={formatDate}
      />
    </section>
  );
}
