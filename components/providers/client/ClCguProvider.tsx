// contexts/PrivacyProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/shared/use-toast";

// Types pour les langues
export type Language = "FR" | "EN";

// Types pour les champs multilangues
export interface MultiLanguageText {
  FR?: string;
  EN?: string;
}

// Types
export interface CGU {
  id: string;
  content?: MultiLanguageText;
  createdAt: Date;
  updatedAt: Date;
}

// Context Type
interface CguContextType {
  // Data
  cguS: CGU[];
  currentCGU: CGU | null;
  loading: boolean;
  error: string | null;

  getCGU: (id: string) => Promise<CGU | null>;
  fetchCguS: () => Promise<void>;
  getText: (text: MultiLanguageText | undefined, language?: Language) => string;
}

// Create Context
const CguContext = createContext<CguContextType | undefined>(undefined);

// Provider Props
interface CguProviderProps {
  children: ReactNode;
}

// Provider Component
export const CiCguProvider: React.FC<CguProviderProps> = ({ children }) => {
  const searchParams = useSearchParams();

  const [cguS, setCguS] = useState<CGU[]>([]);
  const [currentCGU, setCurrentCGU] = useState<CGU | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("FR");

  // Get URL parameters
  const id = searchParams.get("id");
  const isUpdate = searchParams.get("edit");

  // Fetch privacy policy data if in update mode
  useEffect(() => {
    if (id && isUpdate) {
      getCGU(id);
    }
  }, [id, isUpdate]);

  // Clear error
  const clearError = () => setError(null);

  const getText = (
    text: MultiLanguageText | undefined,
    language: Language = currentLanguage
  ): string => {
    if (!text) return "";
    return text[language] || text.FR || text.EN || "";
  };

  // API Functions
  const fetchCguS = async (): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch("/api/cgu/get");

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des CGU");
      }

      const data = await response.json();
      console.log("DATA", data);

      // S'assurer que data est un tableau
      if (Array.isArray(data)) {
        setCguS(data);
      } else if (data && typeof data === "object") {
        // Si c'est un objet unique, le convertir en tableau
        setCguS([data]);
      } else {
        setCguS([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Error fetching privacy policies:", err);
      setCguS([]); // S'assurer qu'on a un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const getCGU = async (id: string): Promise<CGU | null> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/cgu/get/${id}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la CGU");
      }

      const privacyPolicy = await response.json();

      // Fonction helper pour parser les champs multilangues
      const parseMultilingualField = (
        field: string | null | undefined
      ): MultiLanguageText => {
        if (!field) return { FR: "", EN: "" };

        try {
          return JSON.parse(field);
        } catch (error) {
          console.error("Erreur de parsing JSON:", error);
          return { FR: field, EN: "" };
        }
      };

      setCurrentCGU(privacyPolicy);

      console.log("CGU FORM DATA AFTER PARSING:", {
        content: parseMultilingualField(privacyPolicy.content),
      });

      return privacyPolicy;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Error fetching privacy policy:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch privacy policies on component mount
  useEffect(() => {
    fetchCguS();
  }, []);

  // Context value
  const contextValue: CguContextType = {
    cguS,
    currentCGU,
    loading,
    error,

    getCGU,
    fetchCguS,
    getText,
  };

  return (
    <CguContext.Provider value={contextValue}>{children}</CguContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCiCgu = (): CguContextType => {
  const context = useContext(CguContext);

  if (context === undefined) {
    throw new Error("useCiCgu must be used within a CiCguProvider");
  }

  return context;
};
