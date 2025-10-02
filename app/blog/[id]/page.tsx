import CiBlogDetailScreen from '@/components/client/cl-blog-details-screen'
import { Footer } from '@/components/client/footer'
import { Header } from '@/components/client/header'
import { Toaster } from '@/components/client/ui/toaster'
import React from 'react'

const BlogDetail = () => {
  return (
    
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <CiBlogDetailScreen/>
      </div>
      <Footer />
      <Toaster />
    </main>
  )
}

export default BlogDetail