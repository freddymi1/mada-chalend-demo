import BlogSlider from "@/components/client/blog-slider";
import { Footer } from "@/components/client/footer";
import { Header } from "@/components/client/header";
import { HeroSection } from "@/components/client/hero-section";
import { Toaster } from "@/components/client/ui/toaster";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <BlogSlider />
      <Footer />
      <Toaster />
    </main>
  )
}
