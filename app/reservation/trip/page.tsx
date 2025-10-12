import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { Toaster } from "@/components/client/ui/toaster"
import { CarBookingSection } from "@/components/client/car-booking-section"
import {TripBookingScreen} from "@/components/client/trip-booking-screen"

export default function BookTripPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in min-h-[80vh]">
        <TripBookingScreen />
      </div>
      <Footer />
      <Toaster />
    </main>
  )
}
