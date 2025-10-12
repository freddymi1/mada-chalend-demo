import { Footer } from '@/components/client/footer'
import { Header } from '@/components/client/header'
import TripCltDetailScreen from '@/components/client/trip-clt-detail-screen'
import { Toaster } from '@/components/client/ui/toaster'
import React from 'react'

const TripDetailPage = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="min-h-[70vh] animate-fade-in">
        <TripCltDetailScreen />
      </div>
      <Footer />
      <Toaster />
    </main>
  )
}

export default TripDetailPage
