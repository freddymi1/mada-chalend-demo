import ClArticleDetail from "@/components/client/cl-article-detail";
import CiBlogDetailScreen from "@/components/client/cl-blog-details-screen";
import { Footer } from "@/components/client/footer";
import { Header } from "@/components/client/header";
import { Toaster } from "@/components/client/ui/toaster";
import React from "react";

const FAQPage = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <ClArticleDetail />
      </div>
      <Footer />
      <Toaster />
    </main>
  );
};

export default FAQPage;
