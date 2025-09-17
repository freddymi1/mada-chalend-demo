import { Header } from "@/components/client/header"
import { AboutSection } from "@/components/client/about-section"
import { Footer } from "@/components/client/footer"
import { Toaster } from "@/components/client/ui/toaster"

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
