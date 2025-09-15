import { Header } from "@/components/header"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <ContactSection />
      </div>
      <Footer />
      <Toaster />
    </main>
  )
}
