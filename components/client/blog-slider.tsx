"use client";

import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useReview } from "../providers/client/ReviewProvider";
import { Review } from "@/src/domain/entities/review";
import { useTranslations } from "next-intl";

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

const BlogSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const { state, actions } = useReview();
  const t = useTranslations('lng');

  useEffect(() => {
    actions.fetchReviews();
  }, []);

  console.log("STATE", state.reviews)

  // Gérer le nombre d'items visibles selon la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Formatage des données depuis l'API
  const formatAvisData = (): FormattedAvis[] => {
    if (!state.reviews || state.reviews.length === 0) {
      return [];
    }

    return state.reviews
      // .filter((review: Review) => review.status === "approved")
      .map((review: Review) => {
        const date = new Date(review.createdAt);
        const formattedDate = date.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        const authorName =
          review.user?.username || `Utilisateur ${review.userId.slice(0, 8)}`;
        const likes = Math.floor(Math.random() * 50);
        const verified = Math.random() > 0.3;

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
  const maxIndex = Math.max(0, avisData.length - itemsPerView);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

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

  if (state.loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!avisData || avisData.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {t("review.noReviews")}
        </h3>
        <p className="text-gray-500">{t("review.text1")}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          {t("review.title")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Avis précédent"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Avis suivant"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Container des avis */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out gap-6"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView + (itemsPerView > 1 ? 2 : 0))}%)` 
          }}
        >
          {avisData.map((avis) => (
            <div
              key={avis.id}
              className="flex-shrink-0 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
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
                <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {avis.titre}
                </h4>
                <div
                  className="text-sm text-gray-600 leading-relaxed line-clamp-4"
                  dangerouslySetInnerHTML={{
                    __html: avis.description,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateurs */}
      {avisData.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400 w-2'
              }`}
              aria-label={`Aller au groupe ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogSlider;