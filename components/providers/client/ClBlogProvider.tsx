"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/shared/use-toast";
import { IBlog, IArticle } from "@/src/domain/entities/blog";

interface ClBlogFormData {
  title: string;
  subtitle: string;
  description: string;
  author: string;
  image: string;
  articles: IArticle[];
}

interface ClBlogContextType {
  addedBlogs: IBlog[];
  fetchBlogs: () => void;
  getBlogById: (id: string) => void;
  blogDetail: IBlog | null;
  isLoading: boolean;
  isUpdate: string | null;
}

const CiBlogContext = createContext<ClBlogContextType | undefined>(undefined);

export const CiBlogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [addedBlogs, setAddedBlogs] = useState<IBlog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [blogDetail, setBlogDetail] = useState<IBlog | null>(null);
 
  const params = useSearchParams();
  const id = params.get("id");
  const isUpdate = params.get("update");

  useEffect(() => {
    if (id) {
      getBlogById(id.toString());
    }
  }, [id]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog/get", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAddedBlogs(data);
        setIsLoading(false);
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement des blogs.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement des blogs.",
      });
      setIsLoading(false);
    }
  };

  const getBlogById = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBlogDetail(data);
        
        return data;
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement du blog.",
        });
        return null;
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement du blog.",
      });
      return null;
    }
  };

  return (
    <CiBlogContext.Provider
      value={{
    
        addedBlogs,
        fetchBlogs,
        getBlogById,
        blogDetail,
        isLoading,
        isUpdate,
      }}
    >
      {children}
    </CiBlogContext.Provider>
  );
};

export const useCiBlog = () => {
  const context = useContext(CiBlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a CiBlogProvider");
  }
  return context;
};