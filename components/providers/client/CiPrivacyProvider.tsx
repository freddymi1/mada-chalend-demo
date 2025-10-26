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
export interface PrivacyPolicy {
  id: string;
  content?: MultiLanguageText;
  createdAt: Date;
  updatedAt: Date;
}


// Context Type
interface PrivacyContextType {
  // Data
  privacyPolicies: PrivacyPolicy[];
  currentPrivacyPolicy: PrivacyPolicy | null;
  loading: boolean;
  error: string | null;

  getPrivacyPolicy: (id: string) => Promise<PrivacyPolicy | null>;
  fetchPrivacyPolicies: () => Promise<void>;
  getText: (text: MultiLanguageText | undefined, language?: Language) => string;
}

// Create Context
const CiPrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

// Provider Props
interface PrivacyProviderProps {
  children: ReactNode;
}

// Provider Component
export const CiPrivacyProvider: React.FC<PrivacyProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [privacyPolicies, setPrivacyPolicies] = useState<PrivacyPolicy[]>([]);
  const [currentPrivacyPolicy, setCurrentPrivacyPolicy] = useState<PrivacyPolicy | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("FR");


  // Get URL parameters
  const id = searchParams.get("id");
  const isUpdate = searchParams.get("edit");

  const clearError = () => setError(null);

  // Fetch privacy policy data if in update mode
  useEffect(() => {
    if (id && isUpdate) {
      getPrivacyPolicy(id);
    }
  }, [id, isUpdate]);

  const getText = (
        text: MultiLanguageText | undefined,
        language: Language = currentLanguage
      ): string => {
        if (!text) return "";
        return text[language] || text.FR || text.EN || "";
      };

  // API Functions
  const fetchPrivacyPolicies = async (): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch("/api/privacy/get");

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des politiques de confidentialité");
      }

      const data = await response.json();
      console.log("DATA", data);
      
      // S'assurer que data est un tableau
      if (Array.isArray(data)) {
        setPrivacyPolicies(data);
      } else if (data && typeof data === 'object') {
        // Si c'est un objet unique, le convertir en tableau
        setPrivacyPolicies([data]);
      } else {
        setPrivacyPolicies([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Error fetching privacy policies:", err);
      setPrivacyPolicies([]); // S'assurer qu'on a un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const getPrivacyPolicy = async (id: string): Promise<PrivacyPolicy | null> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/privacy/get/${id}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la politique de confidentialité");
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

      setCurrentPrivacyPolicy(privacyPolicy);
      console.log("PRIVACY POLICY FORM DATA AFTER PARSING:", {
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
    fetchPrivacyPolicies();
  }, []);

  // Context value
  const contextValue: PrivacyContextType = {
    // Data
    privacyPolicies,
    currentPrivacyPolicy,
    loading,
    error,

    getPrivacyPolicy,
    fetchPrivacyPolicies,
    getText
  };

  return (
    <CiPrivacyContext.Provider value={contextValue}>
      {children}
    </CiPrivacyContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCiPrivacy = (): PrivacyContextType => {
  const context = useContext(CiPrivacyContext);

  if (context === undefined) {
    throw new Error("useCiPrivacy must be used within a CiPrivacyProvider");
  }

  return context;
};