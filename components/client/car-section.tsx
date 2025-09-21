"use client"

import React, { useState } from "react";
import { Car, Users, Mountain, Camera, MapPin, Shield, Star, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "use-intl";
import { vehicles } from "@/src/infrastructure/repositories/mock-car-repository";
import { Category, Vehicle } from "@/src/domain/entities/car";
interface CarSectionProps {
  className?: string;
}

const CarSection: React.FC<CarSectionProps> = ({ className = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const t = useTranslations("lng");
  

const categories: Category[] = [
  { 
    id: "all", 
    name: "Tous", 
    icon: Car 
  },
  { 
    id: "4x4", 
    name: "4x4 Premium", 
    icon: Mountain 
  },
  { 
    id: "pickup", 
    name: "Pick-up", 
    icon: Car 
  },
  { 
    id: "minibus", 
    name: "Minibus", 
    icon: Users 
  },
  { 
    id: "bus", 
    name: "Bus", 
    icon: Users 
  },
  { 
    id: "compact4x4", 
    name: "4x4 Compact", 
    icon: Mountain 
  }
];

  const filteredVehicles: Vehicle[] =  vehicles.filter(vehicle => vehicle.categoryId === selectedCategory);

  const handleVehicleSelect = (vehicle: Vehicle): void => {
    setSelectedVehicle(vehicle);
    setCurrentImageIndex(0);
  };

  const handleCloseModal = (): void => {
    setSelectedVehicle(null);
    setCurrentImageIndex(0);
  };

  const nextImage = (): void => {
    if (selectedVehicle) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedVehicle.detailImages.length
      );
    }
  };

  const prevImage = (): void => {
    if (selectedVehicle) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedVehicle.detailImages.length - 1 : prev - 1
      );
    }
  };

  const handleImageIndicatorClick = (index: number): void => {
    setCurrentImageIndex(index);
  };

  const handleCategorySelect = (categoryId: string): void => {
    setSelectedCategory(categoryId);
  };

  return (
    <section id="car" className={`py-20 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">{t('car.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t('car.description')}
          </p>
        </div>
        

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-8 py-2 rounded-full transition-all duration-300 flex items-center gap-3 font-semibold ${
                  selectedCategory === category.id
                    ? "bg-primary text-secondary shadow-xl transform scale-105"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-secondary border-2 border-gray-200 hover:border-blue-300 shadow-md"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-3xl shadow-lg overflow-hidden border hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => handleVehicleSelect(vehicle)}
            >
              {/* Main Image */}
              <div className="relative overflow-hidden">
                <img
                  src={vehicle.mainImage}
                  alt={vehicle.name}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-secondary text-sm">{vehicle.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-primary text-black px-4 py-2 rounded-full font-bold text-lg">
                  {vehicle.pricePerDay}€/{t('car.day')}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{vehicle.name}</h3>
                    <p className="text-primary font-semibold">{vehicle.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">{vehicle.passengers} {t('car.seat')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-medium">{vehicle.detailImages.length} {t('car.photo')}</span>
                  </div>
                </div>

                <p className="opacity-80 text-sm mb-4 line-clamp-2">
                  {vehicle.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {vehicle.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="bg-primary/50 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                  {vehicle.features.length > 3 && (
                    <span className="bg-secondary px-3 py-1 rounded-full text-xs font-medium">
                      +{vehicle.features.length - 3} {t('car.other')}
                    </span>
                  )}
                </div>

                <button className="w-full bg-primary text-secondary font-bold py-3 px-6 rounded-xl transition-colors duration-300">
                  {t('car.viewDetail')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Vehicle Details */}
        {selectedVehicle && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-secondary rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {/* Close button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-10 bg-white/90 text-primary cursor-pointer backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Image Gallery */}
                <div className="relative">
                  <img
                    src={selectedVehicle.detailImages[currentImageIndex]}
                    alt={`${selectedVehicle.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover"
                  />
                  
                  {/* Navigation buttons */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 text-secondary transform -translate-y-1/2 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 text-secondary transform -translate-y-1/2 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {selectedVehicle.detailImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageIndicatorClick(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentImageIndex === index ? "bg-white" : "bg-white/50"
                        }`}
                        aria-label={`Aller à l'image ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Price badge */}
                  <div className="absolute bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-full font-bold text-xl">
                    {selectedVehicle.pricePerDay}€/{t('car.details.day')}
                  </div>
                </div>

                {/* Details */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{selectedVehicle.name}</h3>
                      <p className="text-primary font-semibold text-lg">{selectedVehicle.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-semibold text-lg">{selectedVehicle.rating}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-bold mb-4">{t('car.details.book')}</h4>
                      <p className="mb-6">{selectedVehicle.description}</p>

                      <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">{selectedVehicle.passengers} {t('car.seat')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-green-600" />
                          <span className="font-medium">{t('car.details.assurence')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold mb-4">{t('car.details.equipment')}</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedVehicle.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            <span className="opacity-80">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row  gap-4 mt-8">
                    <button className="flex-1 bg-primary hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-300">
                      {t('car.details.booknow')}
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-8 rounded-xl transition-colors duration-300">
                      {t('car.details.requestDevis')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CarSection;