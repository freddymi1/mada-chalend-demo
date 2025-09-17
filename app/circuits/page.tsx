import { Header } from "@/components/client/header"
import { ToursSection } from "@/components/client/tours-section"
import { Footer } from "@/components/client/footer"
import { Toaster } from "@/components/client/ui/toaster"

export default function CircuitsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <ToursSection />
      </div>
      <Footer />
      <Toaster />
    </main>
  )
}
