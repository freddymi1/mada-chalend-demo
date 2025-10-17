import AvisScreen from "@/components/client/avis-screen";
import { Header } from "@/components/client/header";
import { Toaster } from "@/components/client/ui/toaster";
import React from "react";

const AvisPage = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <AvisScreen />
      </div>
      {/* <Footer /> */}
      <Toaster />
    </main>
  );
};

export default AvisPage;
