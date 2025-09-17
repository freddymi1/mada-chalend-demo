import { Header } from "@/components/client/header"
import { ContactSection } from "@/components/client/contact-section"
import { Footer } from "@/components/client/footer"
import { Toaster } from "@/components/client/ui/toaster"

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
