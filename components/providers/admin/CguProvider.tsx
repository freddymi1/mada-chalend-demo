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

export interface CreateCguInput {
  content?: MultiLanguageText;
}

export interface UpdateCguInput {
  content?: MultiLanguageText;
}

// Form Data Interface
interface CguFormData {
  content: MultiLanguageText;
}

// Context Type
interface CguContextType {
  // Form data
  formData: CguFormData;
  setFormData: React.Dispatch<React.SetStateAction<CguFormData>>;

  // Form handlers
  handleMultilingualChange: (
    field: "content",
    lang: Language,
    value: string
  ) => void;

  // Language management
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;

  // Data
  cguS: CGU[];
  currentCGU: CGU | null;
  loading: boolean;
  error: string | null;

  // Actions
  createCGU: () => Promise<void>;
  updateCGU: (id: string) => Promise<void>;
  deleteCGU: (id: string) => Promise<void>;
  getCGU: (id: string) => Promise<CGU | null>;
  fetchCguS: () => Promise<void>;
  setCurrentCGU: (policy: CGU | null) => void;
  clearError: () => void;

  // Helper functions
  getText: (text: MultiLanguageText | undefined, language?: Language) => string;
  resetFormData: () => void;
}

// Create Context
const CguContext = createContext<CguContextType | undefined>(undefined);

// Provider Props
interface CguProviderProps {
  children: ReactNode;
}

// Provider Component
export const CguProvider: React.FC<CguProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [cguS, setCguS] = useState<CGU[]>([]);
  const [currentCGU, setCurrentCGU] = useState<CGU | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("FR");

  // Form Data State
  const [formData, setFormData] = useState<CguFormData>({
    content: { FR: "", EN: "" },
  });

  // Get URL parameters
  const id = searchParams.get("id");
  const isUpdate = searchParams.get("edit");

  // Fetch privacy policy data if in update mode
  useEffect(() => {
    if (id && isUpdate) {
      getCGU(id);
    }
  }, [id, isUpdate]);

  // Helper function to get text in current language
  const getText = (
    text: MultiLanguageText | undefined,
    language: Language = currentLanguage
  ): string => {
    if (!text) return "";
    return text[language] || text.FR || text.EN || "";
  };

  // Clear error
  const clearError = () => setError(null);

  // Form Handlers
  const handleMultilingualChange = (
    field: "content",
    lang: Language,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  // Reset Form Data
  const resetFormData = () => {
    setFormData({
      content: { FR: "", EN: "" },
    });
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
      } else if (data && typeof data === 'object') {
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

  const createCGU = async (): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      // Préparer les données pour l'API
      const privacyData = {
        content: JSON.stringify(formData.content),
      };

      console.log(
        "Sending privacy policy data:",
        JSON.stringify(privacyData, null, 2)
      );

      const response = await fetch("/api/cgu/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(privacyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la création de la CGU"
        );
      }

      const newPrivacyPolicy = await response.json();

      // Update local state - S'assurer que prev est un tableau
      setCguS((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [newPrivacyPolicy, ...prevArray];
      });
      setCurrentCGU(newPrivacyPolicy);

      // Reset form and show success
      resetFormData();
      toast({
        title: "Succès !",
        description: "CGU créée avec succès",
      });

      // Redirect if needed
      router.push("/admin/cgu");
      await fetchCguS()
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        title: "Erreur !",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error creating privacy policy:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCGU = async (id: string): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const updateData = {
        content: JSON.stringify(formData.content),
      };

      const response = await fetch(`/api/cgu/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la mise à jour de la politique de confidentialité"
        );
      }

      const updatedPrivacyPolicy = await response.json();

      // Update local state - S'assurer que prev est un tableau
      setCguS((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map((policy) => 
          policy.id === id ? updatedPrivacyPolicy : policy
        );
      });

      if (currentCGU?.id === id) {
        setCurrentCGU(updatedPrivacyPolicy);
      }

      toast({
        title: "Succès !",
        description: "CGU mise à jour avec succès",
      });

      router.push("/admin/cgu");
      await fetchCguS()
      
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        title: "Erreur !",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error updating CGU:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCGU = async (id: string): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/cgu/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la suppression de la CGU"
        );
      }

      // Update local state - S'assurer que prev est un tableau
      setCguS((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.filter((policy) => policy.id !== id);
      });

      if (currentCGU?.id === id) {
        setCurrentCGU(null);
      }

      toast({
        title: "Succès !",
        description: "CGU supprimée avec succès",
      });
      await fetchCguS();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        title: "Erreur !",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error deleting CGU:", err);
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

      // Populate form data avec les données PARSÉES
      setFormData({
        content: parseMultilingualField(privacyPolicy.content as string),
      });

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
    // Form data
    formData,
    setFormData,

    // Form handlers
    handleMultilingualChange,

    // Language management
    currentLanguage,
    setCurrentLanguage,

    // Data
    cguS,
    currentCGU,
    loading,
    error,

    // Actions
    createCGU,
    updateCGU,
    deleteCGU,
    getCGU,
    fetchCguS,
    setCurrentCGU,
    clearError,

    // Helper functions
    getText,
    resetFormData,
  };

  return (
    <CguContext.Provider value={contextValue}>
      {children}
    </CguContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCgu = (): CguContextType => {
  const context = useContext(CguContext);

  if (context === undefined) {
    throw new Error("useCgu must be used within a CguProvider");
  }

  return context;
};