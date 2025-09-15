import { Header } from "@/components/header"
import { BlogSection } from "@/components/blog-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

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
