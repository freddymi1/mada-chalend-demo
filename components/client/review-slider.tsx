"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Pause, Play, X, ThumbsUp } from "lucide-react";
import { useReview } from "../providers/client/ReviewProvider";
import { Review } from "@/src/domain/entities/review";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";

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

const ReviewSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedReview, setSelectedReview] = useState<FormattedAvis | null>(null);
  const { state, actions } = useReview();
  const t = useTranslations('lng');
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

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

  // Défilement automatique
  useEffect(() => {
    if (!isAutoPlaying || avisData.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, 4000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, maxIndex, avisData.length]);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  const openModal = (avis: FormattedAvis) => {
    setSelectedReview(avis);
    setIsAutoPlaying(false);
  };

  const closeModal = () => {
    setSelectedReview(null);
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
    <>
      <div className="relative w-full max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            {t("review.title")}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={toggleAutoPlay}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all"
              aria-label={isAutoPlaying ? "Mettre en pause" : "Lecture automatique"}
            >
              {isAutoPlaying ? (
                <Pause className="w-6 h-6 text-gray-700" />
              ) : (
                <Play className="w-6 h-6 text-gray-700" />
              )}
            </button>
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
              transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * 24}px))` 
            }}
          >
            {avisData.map((avis) => (
              <div
                key={avis.id}
                onClick={() => openModal(avis)}
                className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                      {avis.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
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
                    <span className="text-sm font-bold mt-1">
                      {avis.note}/5
                    </span>
                  </div>
                </div>

                {/* Content - Texte limité */}
                <div className="mb-4">
                  <h4 className="font-bold text-lg mb-2 line-clamp-1">
                    {avis.titre}
                  </h4>
                  <div
                    className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: avis.description,
                    }}
                  />
                </div>

                {/* View more button */}
                <div className="mt-4 w-full flex justify-center">
                  <Button onClick={() => openModal(avis)}>
                    {t("footer.viewMore")}
                  </Button>
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
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
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

      {/* Modale */}
      {selectedReview && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header de la modale */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-start justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {selectedReview.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-xl">
                      {selectedReview.author}
                    </h3>
                    {selectedReview.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        {t("review.verified")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{selectedReview.date}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {renderStars(selectedReview.note, "w-5 h-5")}
                    <span className="text-lg font-bold">
                      {selectedReview.note}/5
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenu de la modale */}
            <div className="p-6">
              <h2 className="font-bold text-2xl mb-4">
                {selectedReview.titre}
              </h2>
              <div
                className="text-base text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: selectedReview.description,
                }}
              />

              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewSlider;