import { Footer } from '@/components/client/footer'
import { Header } from '@/components/client/header'
import ClLoginScreen from '@/components/client/login-screen'
import { Toaster } from '@/components/client/ui/toaster'
import React from 'react'

const LoginPage = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="animate-fade-in">
        <ClLoginScreen/>
      </div>
      {/* <Footer /> */}
      <Toaster />
    </main>
    
  )
}

export default LoginPage