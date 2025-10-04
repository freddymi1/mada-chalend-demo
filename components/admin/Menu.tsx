"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MapPin, 
  Home, 
  Car, 
  Bus, 
  Users, 
  Settings, 
  LineChart, 
  BookOpen,
  MessageCircle
} from "lucide-react"; // ajoute ici tous les icônes nécessaires
import { useAuth } from "@/src/hooks/useAuth";

export const menuItems = [
  {
    id: "dashboard",
    nom: "Dashboard",
    path: "/admin/dashboard",
    icon: "Home",
  },
  {
    id: "circuits",
    nom: "Circuits",
    path: "/admin/circuits",
    icon: "LineChart",
  },
  {
    id: "vehicles",
    nom: "Voitures",
    path: "/admin/vehicles",
    icon: "Car",
  },
  {
    id: "reservations",
    nom: "Réservations",
    path: "/admin/booking",
    icon: "Users",
  },
  {
    id: "clients",
    nom: "Clients",
    path: "/admin/clients",
    icon: "Users",
  },
  {
    id: "analytics",
    nom: "Analyses",
    path: "/admin/analytics",
    icon: "LineChart",
  },

  {
    id: "blog",
    nom: "Blogs",
    path: "/admin/blog",
    icon: "BookOpen",
  },
  {
    id: "comment",
    nom: "Commentaires",
    path: "/admin/comments",
    icon: "MessageCircle",
  },
  {
    id: "parametres",
    nom: "Paramètres",
    path: "/admin/parametres",
    icon: "Settings",
  },
];

// mapping nom -> composant lucide-react
const iconMap: Record<string, React.ElementType> = {
  Home,
  Car,
  Bus,
  Users,
  Settings,
  LineChart,
  BookOpen,
  MessageCircle
};

const SideMenu = () => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 bg-blue-900">
            <div className="flex items-center gap-2 text-lg lg:text-xl font-bold text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105">
              <div className="relative">
                <MapPin className="h-8 w-8 text-primary animate-float" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
              <span className="hidden lg:block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mada Chaland
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Menu */}
          <nav className="mt-8 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = iconMap[item.icon];
              return (
                <Link key={item.id} href={item.path}>
                  <span
                    className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5 mr-3" />}
                    {item.nom}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Profil utilisateur en bas */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="py-2 px-4 bg-blue-300 w-full rounded-lg mb-4 cursor-pointer"
            >
              Log out
            </button>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
