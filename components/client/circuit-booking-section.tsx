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

export function CircuitBookingSection() {
  const t = useTranslations("lng");
  const locale = useLocale();

  const params = useSearchParams();
  const circuit = params.get("circuit");

  const { createReservation, loading, success } = useBooking();

  const {
    circuitDetail,
    getCircuitById,
    addedCircuits,
    fetchCircuits,
    isLoading,
  } = useClientCircuit();

  // État pour le popup de confirmation
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

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

  const [formData, setFormData] = useState({
    circuit: circuit ? circuit : "",
    langue: "",
    autreLangue: "",
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
    startDate: "",
    endDate: "",
    duration: "",
    preferences: "",
  });

  const [showAutreLangue, setShowAutreLangue] = useState(false);

  // Handler pour les checkboxes de langue
  const handleLangueChange = (langue: string) => {
    if (langue === "autre") {
      setShowAutreLangue(true);
      setFormData({ ...formData, langue: "autre", autreLangue: "" });
    } else {
      setShowAutreLangue(false);
      setFormData({ ...formData, langue, autreLangue: "" });
    }
  };

  // Handler pour l'input de langue personnalisée
  const handleAutreLangueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, autreLangue: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      resType: "circuit",
      circuit: formData.circuit,
      langue: formData.langue === "autre" ? formData.autreLangue : formData.langue,
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
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: formData.duration,
      preferences: formData.preferences,
    };

    // Stocker les données et afficher le popup de confirmation
    setPendingFormData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmReservation = async () => {
    if (!pendingFormData) return;

    const res = await createReservation(pendingFormData);

    // if (success) {
    setFormData({
      circuit: circuit ? circuit : "",
      langue: "",
      autreLangue: "",
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
      startDate: "",
      endDate: "",
      duration: "",
      preferences: "",
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

  const handleCircuitChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      circuit: value,
    }));
    // Charger les détails du circuit sélectionné
    getCircuitById(value);
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

  // Mettre à jour la durée quand le détail du circuit change
  useEffect(() => {
    if (circuitDetail?.duration) {
      const jours = circuitDetail.duration;
      setFormData((prev) => ({
        ...prev,
        duration: jours !== null ? jours.toString() : "",
      }));
    }
  }, [circuitDetail?.duration]);

  // Calcul duratio for reervation vehicle,  a partir de startDate et endDate
  useEffect(() => {
    if (formData?.startDate && formData?.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const durationInDays =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
      setFormData((prev) => ({
        ...prev,
        duration: durationInDays.toString(),
      }));
    }
  }, [formData?.startDate, formData?.endDate]);

  // Calculer automatiquement la date de fin quand startDate ou duration change
  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const durationInDays = parseInt(formData.duration);
      if (!isNaN(durationInDays)) {
        const calculatedEndDate = calculateEndDate(
          formData.startDate,
          durationInDays
        );
        setFormData((prev) => ({
          ...prev,
          endDate: calculatedEndDate,
        }));
      }
    }
  }, [formData.startDate, formData.duration]);

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
  const getCircuitName = (circuitId: string) => {
    const selectedCircuit = addedCircuits?.find(
      (c) => (c.id || c._id) === circuitId
    );

    const circuitTitle = selectedCircuit?.title
      ? JSON.parse(selectedCircuit.title as any)
      : { fr: "", en: "" };

    return locale === "fr" ? circuitTitle.fr : circuitTitle.en;
  };

  return (
    <section id="reservation" className="py-20">
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
            className="animate-scale-in bg-white/50 hover-lift"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <CardHeader>
              <CardTitle>{t("book.form.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CircuitBooking
                circuit={circuit}
                circuitDetail={circuitDetail}
                addedCircuits={addedCircuits}
                isLoading={isLoading}
                formData={formData}
                handleChange={handleChange}
                handleCircuitChange={handleCircuitChange}
                handlePersonnesChange={handlePersonnesChange}
                handleNbrAdultChange={handleNbrAdultChange}
                handleNbrChildChange={handleNbrChildChange}
                handleSubmit={handleSubmit}
                loading={loading}
                getTodayString={getTodayString}
                showAutreLangue={showAutreLangue}
                handleLangueChange={handleLangueChange}
                handleAutreLangueChange={handleAutreLangueChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popup de confirmation */}

      <BookingOk
        restType={"circuit"}
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
        pendingFormData={pendingFormData}
        loading={loading}
        handleCancelReservation={handleCancelReservation}
        handleConfirmReservation={handleConfirmReservation}
        getCircuitName={getCircuitName}
        formatDate={formatDate}
      />
    </section>
  );
}
