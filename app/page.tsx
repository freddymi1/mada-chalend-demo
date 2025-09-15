import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <Footer />
      <Toaster />
    </main>
  )
}
