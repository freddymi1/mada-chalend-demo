"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
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

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => 
      prev >= maxIndex ? 0 : prev + 1
    );
  }, [maxIndex]);

  const goToPrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? maxIndex : prev - 1
    );
  };

  // Auto-play functionality
  useEffect(() => {
    if (avisData.length <= itemsPerView) return;

    const startAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      autoPlayRef.current = setInterval(goToNext, 5000); // Change toutes les 5 secondes
    };

    startAutoPlay();

    // Pause auto-play on hover
    const container = containerRef.current;
    const pauseAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };

    const resumeAutoPlay = () => {
      startAutoPlay();
    };

    if (container) {
      container.addEventListener('mouseenter', pauseAutoPlay);
      container.addEventListener('mouseleave', resumeAutoPlay);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      if (container) {
        container.removeEventListener('mouseenter', pauseAutoPlay);
        container.removeEventListener('mouseleave', resumeAutoPlay);
      }
    };
  }, [avisData.length, itemsPerView, goToNext]);

  // Fonctions pour le swipe
  const getTranslateXValue = useCallback(() => {
    if (!containerRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    const cardWidth = containerWidth / itemsPerView;
    const gap = 24; // 24px gap
    return currentIndex * (cardWidth + gap);
  }, [currentIndex, itemsPerView]);

  const touchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setPrevTranslate(getTranslateXValue());
    setCurrentTranslate(getTranslateXValue());
    
    // Pause auto-play during drag
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
  };

  const touchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diffX = clientX - startX;
    const newTranslate = prevTranslate + diffX;
    
    // Limiter le déplacement
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const maxTranslate = maxIndex * (containerWidth / itemsPerView + 24);
    
    if (newTranslate >= 0 && newTranslate <= maxTranslate) {
      setCurrentTranslate(newTranslate);
      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(-${newTranslate}px)`;
      }
    }
  };

  const touchEnd = () => {
    if (!isDragging || !containerRef.current) return;
    
    setIsDragging(false);
    const containerWidth = containerRef.current.offsetWidth;
    const cardWidth = containerWidth / itemsPerView;
    const gap = 24;
    
    // Déterminer la nouvelle position basée sur le mouvement
    const movedBy = currentTranslate - prevTranslate;
    const threshold = cardWidth * 0.15; // 15% du width d'une carte comme seuil
    
    let newIndex = currentIndex;
    
    if (Math.abs(movedBy) > threshold) {
      if (movedBy > 0) {
        // Swipe vers la droite -> aller à la slide précédente
        newIndex = Math.max(0, currentIndex - 1);
      } else {
        // Swipe vers la gauche -> aller à la slide suivante
        newIndex = Math.min(maxIndex, currentIndex + 1);
      }
    }
    
    // Animer vers la nouvelle position
    setCurrentIndex(newIndex);
    setCurrentTranslate(newIndex * (cardWidth + gap));
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.5s ease-in-out';
      sliderRef.current.style.transform = `translateX(-${newIndex * (cardWidth + gap)}px)`;
    }

    // Restart auto-play after drag
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(goToNext, 5000);
  };

  // Mettre à jour la position quand currentIndex change
  useEffect(() => {
    if (!containerRef.current || !sliderRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const cardWidth = containerWidth / itemsPerView;
    const gap = 24;
    const newTranslate = currentIndex * (cardWidth + gap);
    
    setCurrentTranslate(newTranslate);
    sliderRef.current.style.transition = 'transform 0.5s ease-in-out';
    sliderRef.current.style.transform = `translateX(-${newTranslate}px)`;
  }, [currentIndex, itemsPerView]);

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
    <div 
      className="relative w-full max-w-7xl mx-auto px-4 py-8"
      ref={containerRef}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          {t("review.title")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToPrevious}
            disabled={avisData.length <= itemsPerView}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Avis précédent"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            disabled={avisData.length <= itemsPerView}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Avis suivant"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Container des avis avec support swipe */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing">
        <div 
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-in-out gap-6"
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
          onMouseDown={touchStart}
          onMouseMove={touchMove}
          onMouseUp={touchEnd}
          onMouseLeave={touchEnd}
        >
          {avisData.map((avis) => (
            <div
              key={avis.id}
              className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100"
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
                    <p className="text-sm">{avis.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {renderStars(avis.note, "w-4 h-4")}
                  <span className="text-sm font-bold mt-1">
                    {avis.note}/5
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h4 className="font-bold text-lg mb-2 line-clamp-2">
                  {avis.titre}
                </h4>
                <div
                  className="text-sm leading-relaxed line-clamp-4"
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