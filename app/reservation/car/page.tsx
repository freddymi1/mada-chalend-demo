import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { Toaster } from "@/components/client/ui/toaster"
import { CarBookingSection } from "@/components/client/car-booking-section"

export default function ReservationPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <CarBookingSection />
      </div>
      <Footer />
      <Toaster />
    </main>
  )
}
