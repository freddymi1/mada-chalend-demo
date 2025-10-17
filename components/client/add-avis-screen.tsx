"use client";

import React, { useState, useCallback } from "react";
import { Star, Upload, X, CheckCircle, ArrowLeft } from "lucide-react";
import { useTheme } from "@/src/hooks/useTheme";
import AvisEditor from "./avis-editor";
import { useAuthClient } from "@/src/hooks/useAuthClient";
import { useReview } from "../providers/client/ReviewProvider";
import { useTranslations } from "next-intl";

const AddAvisScreen = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    note: 0,
  });

  const t = useTranslations('lng')

  const { user, logout, isAuthenticated } = useAuthClient();
  const { state, actions } = useReview();

  const [hoverRating, setHoverRating] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use useCallback to prevent unnecessary re-renders of AvisEditor
  const handleTextInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const handleEditorChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
    // Remove error when user starts typing
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  }, [errors.description]);

  const handleRating = useCallback((rating: number) => {
    setFormData((prev) => ({ ...prev, note: rating }));
    if (errors.note) {
      setErrors((prev) => ({ ...prev, note: "" }));
    }
  }, [errors.note]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est requis";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }
    if (formData.description.trim().length < 20) {
      newErrors.description =
        "La description doit contenir au moins 20 caractères";
    }
    
    if (formData.note === 0) {
      newErrors.note = "Veuillez sélectionner une note";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && user?.id) {
      const data = {
        ...formData,
        userId: user.id,
      };

      try {
        console.log("Avis soumis:", data);
        
        // Utilisation du ReviewProvider pour créer la review
        await actions.createReview(data);
        setSubmitted(true);

        // Redirection après succès
        setTimeout(() => {
          window.location.href = '/avis';
        }, 3000);

      } catch (error) {
        console.error("Erreur lors de la création de l'avis:", error);
        // Gestion des erreurs spécifiques
        if (error instanceof Error) {
          setErrors({ 
            submit: error.message || "Une erreur est survenue lors de la soumission de votre avis" 
          });
        } else {
          setErrors({ 
            submit: "Une erreur inconnue est survenue" 
          });
        }
      }
    } else {
      if (!user?.id) {
        setErrors({ 
          submit: "Vous devez être connecté pour soumettre un avis" 
        });
      }
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-all duration-200 hover:scale-110"
          >
            <Star
              className={`w-12 h-12 transition-all duration-200 ${
                star <= (hoverRating || formData.note)
                  ? "fill-amber-400 text-amber-400 scale-110"
                  : "text-gray-300 hover:text-amber-200"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Afficher l'état de loading pendant la soumission
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("review.add.loading")}
          </h2>
          <p className="text-gray-600">
            {t("review.add.text1")}
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("review.add.submited.title")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("review.add.submited.subtitle")}
          </p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 ${
                  star <= formData.note
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6">{t("review.add.submited.pendingRedirect")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t("review.add.backTo")}</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t("review.add.title")}
          </h1>
          <p className="text-xl text-gray-600">
            {t("review.add.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8 pb-8 border-b border-gray-200">
            <label className="block text-center text-lg font-semibold text-gray-900 mb-4">
              {t("review.add.note")}
            </label>
            {renderStars()}
            {formData.note > 0 && (
              <p className="text-center mt-4 text-gray-600 font-medium">
                {formData.note === 5 && "⭐ Excellent !"}
                {formData.note === 4 && "😊 Très bien !"}
                {formData.note === 3 && "👍 Bien"}
                {formData.note === 2 && "😐 Peut mieux faire"}
                {formData.note === 1 && "😞 Décevant"}
              </p>
            )}
            {errors.note && (
              <p className="text-red-500 text-sm text-center mt-2">
                {errors.note}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-2">
              {t("review.add.input.title")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleTextInputChange}
              placeholder={t("review.add.input.placeholderTitle")}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100  text-slate-900 ${
                errors.titre
                  ? "border-red-300"
                  : "border-gray-200 focus:border-blue-500"
              }`}
            />
            {errors.titre && (
              <p className="text-red-500 text-sm mt-1">{errors.titre}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-2">
              {t("review.add.input.description")} <span className="text-red-500">*</span>
            </label>
            <AvisEditor
              avis={formData}
              handleEditorChange={handleEditorChange}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            <div className="flex justify-between items-center mt-1">
              <p className="text-gray-500 text-sm">
                {formData.description.length} {t("review.add.input.characters")}
              </p>
            </div>
          </div>

          {/* Affichage des erreurs de soumission */}
          {errors.submit && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-center font-medium">
                {errors.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={state.loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 ${
              state.loading 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:shadow-xl hover:scale-[1.02]"
            }`}
          >
            {state.loading ? t("review.add.loading") : t("review.add.cta")}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t("review.add.text")}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AddAvisScreen;