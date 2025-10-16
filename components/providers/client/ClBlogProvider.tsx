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
  article: IArticle | null;
  getArticleById: (id: string) => void;
  isLoading1: boolean;
  updateArticle: (id: string, data: any) => Promise<IArticle | null>;
}

const CiBlogContext = createContext<ClBlogContextType | undefined>(undefined);

export const CiBlogProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [addedBlogs, setAddedBlogs] = useState<IBlog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [blogDetail, setBlogDetail] = useState<IBlog | null>(null);
  const [article, setArticle] = useState<IArticle | null>(null);

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

  // http://localhost:3000/api/blog/article/cmgtntv12000g7ahwhhehoitb
  const getArticleById = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/blog/article/${id}`, { cache: "no-store" });
      console.log(res);
      if (res.ok) {
        const data = await res.json();
        setArticle(data);
        setIsLoading(false);
        return data;
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement de l'article.",
        });
        setIsLoading(false);
        return null;
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement de l'article.",
      });
      setIsLoading(false);
      return null;
    }
  };

  const updateArticle = async (id: string, data: any) => {
    setIsLoading1(true);
    try {
      const res = await fetch(`/api/blog/article/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updatedArticle = await res.json();
        setArticle(updatedArticle);
        toast({
          title: "Success !",
          description: "Article mis à jour avec succès.",
        });
        setIsLoading1(false);
        return updatedArticle;
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors de la mise à jour de l'article.",
        });
        setIsLoading1(false);
        return null;
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors de la mise à jour de l'article.",
      });
      setIsLoading(false);
      return null;
    }
  };

  const getBlogById = async (id: string) => {
    setIsLoading1(true);
    try {
      const res = await fetch(`/api/blog/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBlogDetail(data);
        setIsLoading1(false);
        return data;
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement du blog.",
        });
        setIsLoading1(false);
        return null;
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement du blog.",
      });
      setIsLoading1(false);
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
        article,
        getArticleById,
        isLoading1,
        updateArticle
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
