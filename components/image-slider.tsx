"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react"

interface ImageSliderProps {
  images: string[]
  title: string
}

export function ImageSlider({ images, title }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="space-y-4">
      {/* Main image display */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom button */}
        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl w-full h-full max-h-screen p-0 bg-black/95">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={images[currentIndex] || "/placeholder.svg"}
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

              {/* Navigation in zoom mode */}
              {images.length > 1 && (
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
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex ? "border-primary scale-105" : "border-transparent hover:border-primary/50"
              }`}
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
    </div>
  )
}
