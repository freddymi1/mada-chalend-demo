import { Header } from "@/components/header"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <AboutSection />
      </div>
      <Footer />
      <Toaster />
    </main>
  )
}
