import { Footer } from "@/components/client/footer";
import { Header } from "@/components/client/header";
import { HeroSection } from "@/components/client/hero-section";
import { Toaster } from "@/components/client/ui/toaster";
import ReviewSlider from "@/components/client/review-slider";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ReviewSlider />
      <Footer />
      <Toaster />
    </main>
  )
}
