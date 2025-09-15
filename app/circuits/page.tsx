import { Header } from "@/components/header"
import { ToursSection } from "@/components/tours-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

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
