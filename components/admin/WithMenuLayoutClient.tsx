"use client";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import SideMenu, { menuItems } from "@/components/admin/Menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WithMenuLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fermer le menu quand on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Empêcher le défilement de la page quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="withmenu-layout flex min-h-screen">
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 ease-in-out
          md:hidden
        `}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Menu</h2>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le menu"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        
        <div className="flex flex-col justify-between h-[calc(100%-4rem)]">
          <nav className="mt-4 flex-1 overflow-y-auto">
            {menuItems.map((item) => { 
              const isActive = pathname === item.path;
              return (
                <Link key={item.id} href={item.path} legacyBehavior>
                  <a
                    className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icone}
                      />
                    </svg>
                    {item.nom}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Profil utilisateur en bas */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">
                  admin@madagascartours.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 h-screen fixed top-0 left-0 z-30 bg-white shadow-lg">
        <SideMenu />
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 lg:ml-64 relative">
        {/* Bouton menu burger (mobile only) */}
        <button
          className="lg:hidden absolute top-4 right-4 z-30 p-2 bg-white border rounded-md shadow-sm"
          onClick={() => setIsOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <div className="">
          {children}
        </div>
      </main>
    </div>
  );
}