"use client";

import { Vehicle } from "@/src/domain/entities/car";
import { VehicleDTO } from "@/src/domain/entities/vehicle";
import { Eye, Heart, Star, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const VehicleCard: React.FC<{
  vehicle: VehicleDTO;
  isDark: boolean;
  onShowDetails: (vehicle: VehicleDTO) => void;
}> = ({ vehicle, isDark, onShowDetails }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const t = useTranslations('lng');

  const router = useRouter();

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        isDark
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-100"
      }`}
    >
      <div className="relative">
        <img
          src={vehicle.mainImage}
          alt={vehicle.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite
                ? "bg-red-500 text-white"
                : isDark
                ? "bg-gray-800/50 text-white hover:bg-red-500"
                : "bg-white/50 text-gray-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDark ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
            }`}
          >
            {vehicle.type}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {vehicle.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {vehicle.rating}
            </span>
          </div>
        </div>

        <p
          className={`text-sm mb-4 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {vehicle.description}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Users
              className={`w-4 h-4 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {vehicle.passengers} {t("car.seat")}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {vehicle.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full ${
                isDark
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {feature}
            </span>
          ))}
          {vehicle.features.length > 3 && (
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                isDark
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              +{vehicle.features.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          
          <div>
            <span
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              €{vehicle.pricePerDay}
            </span>
            <span
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              /{t("car.day")}
            </span>
          </div>

          <div>
            <button
              className={`text-md px-2 py-1 rounded-full flex items-center font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } ${!vehicle.isAvailable && "bg-red-500"}`}
            >
              {!vehicle.isAvailable && t("car.bookStatus")}
            </button>
            
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onShowDetails(vehicle)}
            className={`flex justify-center w-full items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors hover:scale-105 ${
              isDark
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Eye className="w-4 h-4" />
            {t("car.viewDetail")}
          </button>
          <button onClick={()=>router.push(`/reservation/car?car=${vehicle.id}`)} className="flex justify-center w-full px-6 py-2 bg-primary text-white rounded-lg font-medium transition-colors hover:scale-105">
            {t("car.details.booknow")}
          </button>
        </div>
      </div>
    </div>
  );
};
