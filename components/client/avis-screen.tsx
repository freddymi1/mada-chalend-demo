"use client";

import React, { useState, useEffect } from "react";
import { Star, User, ThumbsUp, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useReview } from "../providers/client/ReviewProvider";
import { Review } from "@/src/domain/entities/review";
import { useTranslations } from "next-intl";

interface IUser {
  id: string;
  username: string;
  email: string;
  // Ajoutez d'autres champs si nécessaire
}

interface FormattedAvis {
  id: string;
  titre: string;
  description: string;
  author: string;
  note: number;
  date: string;
  avatar?: string;
  likes: number;
  verified: boolean;
  status: string;
  userId: string;
}

const AvisScreen = () => {
  const [filter, setFilter] = useState<number | "all">("all");
  const router = useRouter();
  const { state, actions } = useReview();
  const t = useTranslations('lng')

  // Charger les reviews au montage du composant
  useEffect(() => {
    actions.fetchReviews();
  }, []);

  // Formatage des données depuis l'API vers le format attendu par le composant
  const formatAvisData = (): FormattedAvis[] => {
    if (!state.reviews || state.reviews.length === 0) {
      return [];
    }

    return state.reviews.map((review: Review) => {
      // Formater la date
      const date = new Date(review.createdAt);
      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      // Générer des données pour les champs manquants
      // Vous pouvez adapter cela selon vos besoins réels
      const authorName =
        review.user?.username || `Utilisateur ${review.userId.slice(0, 8)}`;
      const likes = Math.floor(Math.random() * 50); // Donnée simulée
      const verified = Math.random() > 0.3; // 70% de chance d'être vérifié

      return {
        id: review.id,
        titre: review.titre,
        description: review.description,
        author: authorName,
        note: review.note,
        date: formattedDate,
        likes: likes,
        verified: verified,
        status: review.status,
        userId: review.userId,
      };
    });
  };

  const avisData = formatAvisData();

  // Filtrer les reviews par statut (seulement les approuvés)
  const approvedAvis = avisData.filter((avis) => avis.status === "approved");

  const renderStars = (note: number, size: string = "w-5 h-5") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= note ? "fill-amber-400 text-amber-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const calculateStats = () => {
    const total = avisData.length;
    if (total === 0) {
      return { total: 0, average: "0.0", distribution: [] };
    }

    const sum = avisData.reduce((acc, avis) => acc + avis.note, 0);
    const average = (sum / total).toFixed(1);

    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = avisData.filter((avis) => avis.note === star).length;
      const percentage = (count / total) * 100;
      return { star, count, percentage };
    });

    return { total, average, distribution };
  };

  const stats = calculateStats();

  const filteredAvis =
    filter === "all"
      ? avisData
      : avisData.filter((avis) => avis.note === filter);

  // Afficher un état de chargement
  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("review.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t("review.title")}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {t("review.subtitle")}
          </p>
          <button
            onClick={() => router.push("/avis/add")}
            className="inline-flex cursor-pointer items-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5" />
            {t("review.cta")}
          </button>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="text-center md:border-r border-gray-200">
              <div className="text-6xl font-bold text-gray-900 mb-2">
                {stats.average}
              </div>
              <div className="flex justify-center mb-3">
                {stats.total > 0 &&
                  renderStars(Math.round(parseFloat(stats.average)), "w-8 h-8")}
              </div>
              <p className="text-gray-600 text-lg">
                {t("review.to")} {stats.total} {t("review.reviews")}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {stats.distribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {star}
                    </span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              filter === "all"
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-200"
            }`}
          >
            {t("review.allReviews")} ({avisData.length})
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setFilter(star)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                filter === star
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-200"
              }`}
            >
              {star} <Star className="w-4 h-4 fill-current" />(
              {avisData.filter((avis) => avis.note === star).length})
            </button>
          ))}
        </div>

        {/* Affichage des erreurs */}
        {state.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-600 font-medium">
              {t("review.errorDisplay")} {state.error}
            </p>
            <button
              onClick={() => actions.fetchReviews()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t("review.retry")}
            </button>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredAvis.map((avis) => (
            <div
              key={avis.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-[1.02]"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                    {avis.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {avis.author}
                      </h3>
                      {avis.verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          {t("review.verified")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{avis.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {renderStars(avis.note, "w-4 h-4")}
                  <span className="text-sm font-bold text-gray-700 mt-1">
                    {avis.note}/5
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h4 className="font-bold text-lg text-gray-900 mb-2">
                  {avis.titre}
                </h4>

                <div
                  className="text-md text-gray-600  leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: avis.description,
                  }}
                />
              </div>

              {/* Footer */}
              {/* <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Utile ({avis.likes})</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Répondre</span>
                </button>
              </div> */}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAvis.length === 0 && !state.loading && (
          <div className="text-center py-16">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {approvedAvis.length === 0
                ? t("review.noReviews")
                : t("review.noReviewsFound")}
            </h3>
            <p className="text-gray-500 mb-6">
              {approvedAvis.length === 0
                ? t("review.text1")
                : t("review.text2")}
            </p>
            {approvedAvis.length === 0 && (
              <button
                onClick={() => router.push("/avis/add")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {t("review.write")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvisScreen;
