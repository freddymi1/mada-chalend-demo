"use client"

import BookingScreen from "@/components/admin/booking-screen";
import { Toaster } from "@/components/client/ui/toaster";
import React from "react";

const BookingPage = () => {
  return (
    <>
      <BookingScreen />
      <Toaster />
    </>
  );
};

export default BookingPage;
