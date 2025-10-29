"use client";

import { setUserLocale } from "@/lib/lngService";
import { Locale } from "@/src/i18n/routing";
import { useLocale } from "next-intl";
import React, { useState, useTransition, useRef, useEffect } from "react";
import { useTranslations } from "use-intl";
import { ChevronDown } from "lucide-react";

// Configuration des langues avec leurs drapeaux
const languages = {
  fr: {
    code: "fr",
    flag: "🇫🇷",
    name: "home.language.french"
  },
  en: {
    code: "en", 
    flag: "🇺🇸",
    name: "home.language.english"
  }
};

/**
 * Component for switching between languages
 */
export const LanguageSwitcher: React.FC = () => {
  const t = useTranslations("lng");
  const locale = useLocale();
  const [lang, setLang] = useState(locale || "fr");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChangeLng = async (lng: Locale) => {
    setLang(lng);
    setIsOpen(false);
    startTransition(() => {
      setUserLocale(lng);
    });
  };

  const currentLanguage = languages[lang as keyof typeof languages];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center space-x-2 bg-background border text-slate-600 hover:text-slate-700 border-background rounded-md px-3 py-2 text-sm hover:bg-background transition-colors duration-200 min-w-[120px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{currentLanguage?.flag}</span>
          <span>{currentLanguage ? t(currentLanguage.name) : ""}</span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${isPending ? "opacity-50" : ""}`}
        />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-background rounded-md shadow-lg z-50 overflow-hidden">
          {Object.values(languages).map((language) => (
            <button
              key={language.code}
              onClick={() => handleChangeLng(language.code as Locale)}
              disabled={isPending}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-indigo-50 transition-colors duration-200 ${
                lang === language.code ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-lg text-slate-800">{t(language.name)}</span>
              {lang === language.code && (
                <span className="ml-auto text-indigo-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Indicateur de chargement */}
      {isPending && (
        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-md flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};