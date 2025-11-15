// contexts/ContactProvider.tsx
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
export interface Service {
  id: string;
  title?: MultiLanguageText;
  content?: MultiLanguageText;
  contactId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  homeTitle?: MultiLanguageText;
  homeSubtitle?: MultiLanguageText;
  homeContent?: MultiLanguageText;
  aboutTitle?: MultiLanguageText;
  aboutContent?: MultiLanguageText;
  subContent?: MultiLanguageText;
  whatsapp?: string;
  phone?: string;
  email?: string;
  fbLink?: string;
  instaLink?: string;
  address?: string;
  services: Service[];
  createdAt: Date;
  updatedAt: Date;
}

// Context Type
interface ContactContextType {

  // Data
  contacts: Contact[];
  currentContact: Contact | null;
  loading: boolean;
  error: string | null;

  getContact: (id: string) => Promise<Contact | null>;
  fetchContacts: () => Promise<void>;
  setCurrentContact: (contact: Contact | null) => void;
  clearError: () => void;

}

// Create Context
const ContactContext = createContext<ContactContextType | undefined>(undefined);

// Provider Props
interface ContactProviderProps {
  children: ReactNode;
}

// Provider Component
export const CiContactProvider: React.FC<ContactProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get URL parameters
  const id = searchParams.get("id");
  const isUpdate = searchParams.get("edit");

  // Fetch contact data if in update mode
  useEffect(() => {
    if (id && isUpdate) {
      getContact(id);
    }
  }, [id, isUpdate]);


  // Clear error
  const clearError = () => setError(null);

  // API Functions
  const fetchContacts = async (): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch("/api/profile/get");

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des contacts");
      }

      const data = await response.json();
      setContacts(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const getContact = async (id: string): Promise<Contact | null> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/profile/get/${id}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du contact");
      }

      const contact = await response.json();
      console.log("CONTACT", contact);

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

      setCurrentContact(contact);

      return contact;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Error fetching contact:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Context value
  const contextValue: ContactContextType = {
    // Data
    contacts,
    currentContact,
    loading,
    error,

    getContact,
    fetchContacts,
    setCurrentContact,
    clearError,

  };

  return (
    <ContactContext.Provider value={contextValue}>
      {children}
    </ContactContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCiContact = (): ContactContextType => {
  const context = useContext(ContactContext);

  if (context === undefined) {
    throw new Error("useCiContact must be used within a CiContactProvider");
  }

  return context;
};
