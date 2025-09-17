import { Header } from "@/components/client/header"
import { BookingSection } from "@/components/client/booking-section"
import { Footer } from "@/components/client/footer"
import { Toaster } from "@/components/client/ui/toaster"

export default function ReservationPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <BookingSection />
      </div>
      <Footer />
      <Toaster />
    </main>
  )
}
