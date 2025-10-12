import { Footer } from "@/components/client/footer";
import { Header } from "@/components/client/header";
import TripScreen from "@/components/client/trip-screen";
import { Toaster } from "@/components/client/ui/toaster";
import React from "react";

const TripPage = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="min-h-[70vh] animate-fade-in">
        <TripScreen />
      </div>
      <Footer />
      <Toaster />
    </main>
  );
};

export default TripPage;
