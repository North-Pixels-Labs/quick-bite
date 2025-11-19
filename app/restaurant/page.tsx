'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/restaurant/HeroSection'
import { FeatureSection } from '@/components/restaurant/FeatureSection'
import { ParticleCanvas } from '@/components/ParticleCanvas'

export default function RestaurantLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <ParticleCanvas />
      <Header />
      <main className="pt-20">
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  )
}
