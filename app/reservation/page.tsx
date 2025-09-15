import { Header } from "@/components/header"
import { BookingSection } from "@/components/booking-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

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
