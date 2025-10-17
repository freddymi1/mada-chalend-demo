import AddAvisScreen from '@/components/client/add-avis-screen'
import { Header } from '@/components/client/header'
import { Toaster } from '@/components/client/ui/toaster'
import React from 'react'

const AddAvis = () => {
  return (
     <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <AddAvisScreen />
      </div>
      {/* <Footer /> */}
      <Toaster />
    </main>
  )
}

export default AddAvis
