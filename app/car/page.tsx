import CarSection from "@/components/client/car-section";
import { Footer } from "@/components/client/footer";
import { Header } from "@/components/client/header";
import { Toaster } from "@/components/client/ui/toaster";
import React from "react";

const CarPage = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in"><CarSection/></div>
      <Footer />
      <Toaster />
    </main>
  );
};

export default CarPage;
