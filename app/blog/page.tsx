import { Header } from "@/components/client/header"
import { BlogSection } from "@/components/client/blog-section"
import { Footer } from "@/components/client/footer"
import { Toaster } from "@/components/client/ui/toaster"

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
