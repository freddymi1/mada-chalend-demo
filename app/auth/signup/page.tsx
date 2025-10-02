import { Header } from '@/components/client/header'
import SignUpScreen from '@/components/client/signup-screen'
import { Toaster } from '@/components/client/ui/toaster'
import React from 'react'

const SignUpPage = () => {
  return (
    <main className="min-h-screen">
          <Header />
          <div className="animate-fade-in">
            <SignUpScreen/>
          </div>
          {/* <Footer /> */}
          <Toaster />
        </main>
  )
}

export default SignUpPage