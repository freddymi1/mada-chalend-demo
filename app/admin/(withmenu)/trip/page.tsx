"use client"

import CircuitScreen from "@/components/admin/circuit-screen";
import TripScreen from "@/components/admin/trip-screen";
import { Toaster } from "@/components/client/ui/toaster";

const CircuitPage = () => {
  return (
    <>
      <TripScreen />
      <Toaster />
    </>
  );
};

export default CircuitPage;
