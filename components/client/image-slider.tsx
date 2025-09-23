"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/client/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/client/ui/dialog"
import { ChevronLeft, ChevronRight, ZoomIn, X, Play, Pause, RotateCcw } from "lucide-react"

interface ImageSliderProps {
  images: string[]
  title: string
  autoSlide?: boolean
  interval?: number // en ms, par défaut 5000
  transitionDuration?: number // en ms, par défaut 500
  showThumbnails?: boolean
  showCounter?: boolean
  showControls?: boolean
  pauseOnHover?: boolean
}

export function ImageSlider({ 
  images = [], 
  title, 
  autoSlide = true, 
  interval = 5000,
  transitionDuration = 500,
  showThumbnails = true,
  showCounter = true,
  showControls = true,
  pauseOnHover = true
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isAutoSliding, setIsAutoSliding] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  
  // Sécurité pour les images
  const safeImages = images || []
  const hasMultipleImages = safeImages.length > 1

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Aller à l'image suivante avec transition
  const nextImage = useCallback(() => {
    if (isAnimating || !hasMultipleImages) return
    
    setIsAnimating(true)
    setSwipeDirection('left')
    setCurrentIndex((prev) => (prev + 1) % safeImages.length)
  }, [isAnimating, hasMultipleImages, safeImages.length])

  // Aller à l'image précédente avec transition
  const prevImage = useCallback(() => {
    if (isAnimating || !hasMultipleImages) return
    
    setIsAnimating(true)
    setSwipeDirection('right')
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
  }, [isAnimating, hasMultipleImages, safeImages.length])

  // Aller directement à une image donnée
  const goToImage = useCallback((index: number) => {
    if (index === currentIndex || isAnimating || !hasMultipleImages) return
    
    setIsAnimating(true)
    setSwipeDirection(index > currentIndex ? 'left' : 'right')
    setCurrentIndex(index)
    stopAutoSlide()
  }, [currentIndex, isAnimating, hasMultipleImages])

  // Démarrer le slideshow automatique
  const startAutoSlide = useCallback(() => {
    if (!hasMultipleImages || isZoomed) return
    
    setIsAutoSliding(true)
    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeImages.length)
    }, interval)
  }, [hasMultipleImages, isZoomed, interval, safeImages.length])

  // Arrêter le slideshow automatique
  const stopAutoSlide = useCallback(() => {
    setIsAutoSliding(false)
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current)
      autoSlideRef.current = null
    }
  }, [])

  // Toggle du slideshow automatique
  const toggleAutoSlide = useCallback(() => {
    if (isAutoSliding) {
      stopAutoSlide()
    } else {
      startAutoSlide()
    }
  }, [isAutoSliding, stopAutoSlide, startAutoSlide])

  // Reset à la première image
  const resetSlider = () => {
    stopAutoSlide()
    goToImage(0)
  }

  // Initialiser le slideshow si autoSlide est true
  useEffect(() => {
    if (autoSlide && hasMultipleImages && !isZoomed) {
      setIsAutoSliding(true)
    }
  }, [autoSlide, hasMultipleImages, isZoomed])

  // Auto-slide avec gestion des pauses
  useEffect(() => {
    if (!isAutoSliding || isPaused || isZoomed || !hasMultipleImages) {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current)
        autoSlideRef.current = null
      }
      return
    }
    
    // Créer un nouvel interval
    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeImages.length)
    }, interval)
    
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current)
        autoSlideRef.current = null
      }
    }
  }, [isAutoSliding, isPaused, isZoomed, hasMultipleImages, interval, safeImages.length])

  // Cleanup à la déstruction du composant
  useEffect(() => {
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current)
      }
    }
  }, [])

  // Reset animation flag après la transition
  useEffect(() => {
    if (!isAnimating) return
    
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setSwipeDirection(null)
    }, transitionDuration)
    
    return () => clearTimeout(timer)
  }, [currentIndex, transitionDuration, isAnimating])

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) return // Les contrôles clavier sont gérés dans la modal zoom
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          stopAutoSlide()
          prevImage()
          break
        case 'ArrowRight':
          e.preventDefault()
          stopAutoSlide()
          nextImage()
          break
        case ' ':
          e.preventDefault()
          toggleAutoSlide()
          break
        case 'Home':
          e.preventDefault()
          goToImage(0)
          break
        case 'End':
          e.preventDefault()
          goToImage(safeImages.length - 1)
          break
        case 'r':
        case 'R':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            resetSlider()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isZoomed, nextImage, prevImage, goToImage, safeImages.length, toggleAutoSlide])

  // Gestion du swipe tactile améliorée
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
    if (pauseOnHover) setIsPaused(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchEndX.current === null) return
    
    const swipeThreshold = 50
    const diff = touchStartX.current - touchEndX.current
    const absDiff = Math.abs(diff)
    
    if (absDiff > swipeThreshold) {
      if (diff > 0) {
        nextImage()
      } else {
        prevImage()
      }
      stopAutoSlide()
    }
    
    touchStartX.current = null
    touchEndX.current = null
    if (pauseOnHover) setIsPaused(false)
  }

  // Pause sur hover
  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true)
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false)
  }

  return (
    <div className="space-y-4">
      {/* Main image display */}
      <div
        ref={containerRef}
        className="relative aspect-video overflow-hidden rounded-lg bg-muted group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image avec transitions améliorées */}
        <div className="relative w-full h-full">
          <img
            src={safeImages?.[currentIndex] || "/placeholder.svg"}
            alt={`${title} - Image ${currentIndex + 1}`}
            className={`w-full h-full object-cover transition-all duration-${transitionDuration} ${
              isAnimating 
                ? swipeDirection === 'left' 
                  ? 'transform translate-x-full opacity-0 scale-95' 
                  : 'transform -translate-x-full opacity-0 scale-95'
                : 'transform translate-x-0 opacity-100 scale-100'
            }`}
            style={{
              transitionDuration: `${transitionDuration}ms`
            }}
          />
        </div>

        {/* Progress bar pour auto-slide */}
        {isAutoSliding && !isPaused && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
            <div 
              ref={progressRef}
              className="h-full bg-primary transition-all linear"
              style={{
                width: '100%',
                animation: `slideProgress ${interval}ms linear infinite`
              }}
            />
          </div>
        )}

        {/* Navigation arrows */}
        {hasMultipleImages && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => {
                stopAutoSlide()
                prevImage()
              }}
              disabled={isAnimating}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => {
                stopAutoSlide()
                nextImage()
              }}
              disabled={isAnimating}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Contrôles du slideshow */}
        {showControls && hasMultipleImages && (
          <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="secondary"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-0 h-8 px-2"
              onClick={toggleAutoSlide}
            >
              {isAutoSliding ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-0 h-8 px-2"
              onClick={resetSlider}
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Zoom button */}
        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl w-full h-full max-h-screen p-0 bg-black/95">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={safeImages?.[currentIndex] || "/placeholder.svg"}
                alt={`${title} - Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setIsZoomed(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation en mode zoom */}
              {hasMultipleImages && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-16 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>

                  {/* Compteur en mode zoom */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentIndex + 1} / {safeImages.length}
                  </div>

                  {/* Indicateurs en mode zoom */}
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                    {safeImages?.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Image counter */}
        {showCounter && hasMultipleImages && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {safeImages.length}
          </div>
        )}

        {/* Indicateurs de slides */}
        {hasMultipleImages && safeImages.length <= 8 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {safeImages?.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                disabled={isAnimating}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                } disabled:cursor-not-allowed`}
              />
            ))}
          </div>
        )}

        {/* État de pause */}
        {isPaused && isAutoSliding && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            Pausé
          </div>
        )}
      </div>

      {/* Thumbnail navigation */}
      {showThumbnails && hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {safeImages?.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              disabled={isAnimating}
              className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex 
                  ? "border-primary scale-105 shadow-lg" 
                  : "border-transparent hover:border-primary/50 hover:scale-102"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${title} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Contrôles textuels */}
      {/* {showControls && hasMultipleImages && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              {isAutoSliding ? '▶️' : '⏸️'} Slideshow: {isAutoSliding ? 'Actif' : 'Arrêté'}
            </span>
            {isPaused && <span className="text-orange-500">⏳ En pause</span>}
          </div>
          <div className="text-xs">
            Espace: play/pause • Flèches: naviguer • R: reset
          </div>
        </div>
      )} */}

      {/* CSS pour les animations */}
      <style jsx>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}