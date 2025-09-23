"use client";

import { ChevronLeft, ChevronRight, X, Star, Users, Tag, Play, Pause } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef, useCallback } from "react";

// Interface Vehicle
interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface Vehicle {
  id: string;
  name: string;
  categoryId: string;
  type: string;
  passengers: number;
  pricePerDay: number;
  rating: number;
  mainImage: string;
  detailImages: string[];
  features: string[];
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  categoryRel?: Category;
}

export const ImageModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  vehicle: Vehicle;
  isDark: boolean;
  autoSlideInterval?: number; // Durée en millisecondes (défaut: 5000ms)
}> = ({ isOpen, onClose, images, vehicle, isDark, autoSlideInterval = 5000 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(false);
  const [slideDuration, setSlideDuration] = useState(300); // Durée de la transition en ms
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  const t = useTranslations('lng');

  // Fonction pour aller à l'image suivante avec transition
  const goToNext = useCallback(() => {
    if (isTransitioning || images.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, slideDuration);
  }, [images.length, isTransitioning, slideDuration]);

  // Fonction pour aller à l'image précédente avec transition
  const goToPrevious = useCallback(() => {
    if (isTransitioning || images.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, slideDuration);
  }, [images.length, isTransitioning, slideDuration]);

  // Démarrer le slideshow automatique
  const startAutoSlide = useCallback(() => {
    if (images.length <= 1) return;
    
    setIsAutoSliding(true);
    autoSlideRef.current = setInterval(() => {
      goToNext();
    }, autoSlideInterval);
  }, [goToNext, autoSlideInterval, images.length]);

  // Arrêter le slideshow automatique
  const stopAutoSlide = useCallback(() => {
    setIsAutoSliding(false);
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  }, []);

  // Toggle du slideshow automatique
  const toggleAutoSlide = () => {
    if (isAutoSliding) {
      stopAutoSlide();
    } else {
      startAutoSlide();
    }
  };

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        stopAutoSlide();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        stopAutoSlide();
        goToNext();
      } else if (e.key === " ") {
        e.preventDefault();
        toggleAutoSlide();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToPrevious, goToNext, stopAutoSlide]);

  // Gestion du scroll du body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Nettoyage à la fermeture
  useEffect(() => {
    if (!isOpen) {
      stopAutoSlide();
      setCurrentImageIndex(0);
    }
  }, [isOpen, stopAutoSlide]);

  // Gestion du swipe tactile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    stopAutoSlide(); // Arrêter le slideshow lors du toucher
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50; // Distance minimale pour déclencher un swipe
    const swipeDistance = touchStartX.current - touchEndX.current;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swipe vers la gauche - image suivante
        goToNext();
      } else {
        // Swipe vers la droite - image précédente
        goToPrevious();
      }
    }
  };

  // Aller à une image spécifique
  const goToSlide = (index: number) => {
    if (index === currentImageIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    stopAutoSlide();
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, slideDuration);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative z-10 w-full max-w-4xl mx-2 sm:mx-4 rounded-2xl overflow-hidden max-h-[95vh] overflow-y-auto ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* Image Container */}
        <div 
          ref={imageContainerRef}
          className="relative aspect-video bg-gray-100"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`p-1.5 sm:p-2 absolute top-2 right-2 bg-white/90 rounded-lg transition-colors z-20 ${
              isDark
                ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Auto Slide Control */}
          {images.length > 1 && (
            <button
              onClick={toggleAutoSlide}
              className={`p-2 absolute top-2 left-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors z-20`}
            >
              {isAutoSliding ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Main Image */}
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={`${vehicle.name} - Image ${currentImageIndex + 1}`}
              className={`w-full h-full object-cover transition-all duration-${slideDuration} ${
                isTransitioning ? 'opacity-75 scale-105' : 'opacity-100 scale-100'
              }`}
              style={{
                transitionDuration: `${slideDuration}ms`
              }}
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => {
                  stopAutoSlide();
                  goToPrevious();
                }}
                disabled={isTransitioning}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => {
                  stopAutoSlide();
                  goToNext();
                }}
                disabled={isTransitioning}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full z-10">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Slide Indicators */}
          {images.length > 1 && images.length <= 10 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  } disabled:cursor-not-allowed`}
                />
              ))}
            </div>
          )}

          {/* Progress Bar for Auto Slide */}
          {isAutoSliding && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-10">
              <div 
                className="h-full bg-blue-500 transition-all linear"
                style={{
                  width: '100%',
                  animation: `slideProgress ${autoSlideInterval}ms linear infinite`
                }}
              />
            </div>
          )}
        </div>

        {/* Header - Section modifiée avec informations détaillées */}
        <div
          className={`flex bg-secondary items-center justify-between p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex-1 space-y-4">
            {/* Titre et rating */}
            <div className="flex items-center justify-between">
              {vehicle.categoryRel && (
                <div className="flex items-center gap-2">
                  <Tag
                    className={`w-5 h-5 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <h1
                    className={`text-xl font-bold ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {vehicle.categoryRel.name}
                  </h1>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {vehicle.rating}
                </span>
              </div>
            </div>

            {/* Prix et type */}
            <div className="flex items-center justify-between">
              <div>
                <span
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  €{vehicle.pricePerDay}
                </span>
                <span
                  className={`text-lg ml-2 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  /{t("car.day")}
                </span>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isDark ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
                }`}
              >
                {vehicle.type}
              </span>
            </div>

            {/* Informations de base */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {vehicle.passengers} {t("car.seat")}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p
                className={`text-base leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {vehicle.description}
              </p>
            </div>

            {/* Équipements */}
            <div>
              <h4
                className={`text-sm font-semibold mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {t("car.details.equipment")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full ${
                      isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-2">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                {t("car.details.booknow")}
              </button>
              <button 
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t("car.details.requestDevis")}
              </button>
            </div>

            {/* Contrôles du slideshow (section supplémentaire) */}
            {images.length > 1 && (
              <div className={`flex items-center gap-4 pt-4 border-t ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}>
                <span className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Slideshow:
                </span>
                <button
                  onClick={toggleAutoSlide}
                  className={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-colors ${
                    isAutoSliding
                      ? "bg-blue-600 text-white"
                      : isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isAutoSliding ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isAutoSliding ? 'Pause' : 'Play'}
                </button>
                <span className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>
                  Space pour play/pause, flèches pour naviguer
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS pour l'animation de la barre de progression */}
      <style jsx>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};