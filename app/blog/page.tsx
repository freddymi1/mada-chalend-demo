import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { Toaster } from "@/components/client/ui/toaster"
import BlogSection from "@/components/client/blog-section"

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <BlogSection />
      </div>
      <Footer />
      <Toaster />
    </main>
  )
}
