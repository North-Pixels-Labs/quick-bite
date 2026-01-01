"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight, Clock, MapPin, Star, Sparkles, Zap, Shield, Heart, ChevronDown, Menu, X, Check, TrendingUp, Users, Smartphone, CreditCard, Truck, ChefHat, Coffee, Pizza, Salad, } from 'lucide-react'
import { ParticleCanvas } from '@/components/ParticleCanvas'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const QuickBiteLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [hoveredCard, setHoveredCard] = useState<null | number>(null)
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const opacityProgress = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const yProgress = useTransform(scrollYProgress, [0, 1], [0, -100])

  const smoothScale = useSpring(scaleProgress, { stiffness: 100, damping: 30 })

  // Animated counter hook
  const Counter = ({ value, duration = 2 }: { value: string; duration?: number }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })

    useEffect(() => {
      if (inView) {
        let start = 0
        const end = parseInt(value)
        const increment = end / (duration * 60)
        const timer = setInterval(() => {
          start += increment
          if (start >= end) {
            setCount(end)
            clearInterval(timer)
          } else {
            setCount(Math.floor(start))
          }
        }, 1000 / 60)
        return () => clearInterval(timer)
      }
    }, [inView, value, duration])

    return <span ref={ref}>{count.toLocaleString()}</span>
  }

  const foodCategories = [
    { id: 'all', name: 'All', icon: Sparkles },
    // { id: 'burger', name: 'Burgers', icon: Burger },
    { id: 'pizza', name: 'Pizza', icon: Pizza },
    { id: 'salad', name: 'Healthy', icon: Salad },
    { id: 'coffee', name: 'Drinks', icon: Coffee }
  ]

  const restaurants = [
    { id: 1, name: 'Burger Palace', rating: 4.8, time: '25-30', category: 'burger', image: '🍔', color: 'from-orange-600/20 to-red-600/20' },
    { id: 2, name: 'Pizza Heaven', rating: 4.9, time: '30-35', category: 'pizza', image: '🍕', color: 'from-red-600/20 to-yellow-600/20' },
    { id: 3, name: 'Green Garden', rating: 4.7, time: '20-25', category: 'salad', image: '🥗', color: 'from-green-600/20 to-emerald-600/20' },
    { id: 4, name: 'Coffee Corner', rating: 4.9, time: '15-20', category: 'coffee', image: '☕', color: 'from-amber-600/20 to-brown-600/20' },
    { id: 5, name: 'Sushi Master', rating: 4.8, time: '35-40', category: 'all', image: '🍱', color: 'from-pink-600/20 to-purple-600/20' },
    { id: 6, name: 'Taco Fiesta', rating: 4.6, time: '25-30', category: 'all', image: '🌮', color: 'from-yellow-600/20 to-orange-600/20' }
  ]

  const filteredRestaurants = activeCategory === 'all'
    ? restaurants
    : restaurants.filter(r => r.category === activeCategory)

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <ParticleCanvas />

      {/* Navigation */}
      <Header />
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-xl z-40 border-b border-white/10"
          >
            <div className="p-6 space-y-4">
              {['Features', 'Restaurants', 'Pricing', 'About'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileTap={{ scale: 0.95 }}
                  className="block py-2 text-lg text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Delivering happiness in 30 minutes</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Food Delivered
            </span>
            <br />
            <span className="text-white">At Lightning Speed</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Order from your favorite restaurants and get your food delivered hot and fresh in under 30 minutes
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-black text-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all flex items-center justify-center gap-2"
            >
              Order Now <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.a
              href="/discover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 font-semibold text-lg hover:bg-white/20 transition-all inline-block"
            >
              View Restaurants
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="w-8 h-8 text-gray-500" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section - Bento Style */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {[
              { value: '50000', label: 'Happy Customers', icon: Users, color: 'from-blue-600/20 to-cyan-600/20' },
              { value: '2500', label: 'Partner Restaurants', icon: ChefHat, color: 'from-purple-600/20 to-pink-600/20' },
              { value: '15', label: 'Minutes Average Delivery', icon: Clock, color: 'from-green-600/20 to-emerald-600/20' },
              { value: '99', label: '% Customer Satisfaction', icon: Heart, color: 'from-red-600/20 to-pink-600/20' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl"
                  style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                />
                <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/10`}>
                  <stat.icon className="w-8 h-8 mb-4 text-white/80" />
                  <div className="text-3xl font-bold mb-2">
                    <Counter value={stat.value} />
                    {stat.label.includes('%') && '%'}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Why Choose QuickBite
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Experience the future of food delivery</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
            {/* Large Feature Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
              <div className="relative h-full p-8 flex flex-col justify-between">
                <div>
                  <Zap className="w-12 h-12 text-yellow-400 mb-4" />
                  <h3 className="text-3xl font-bold mb-4">Lightning Fast Delivery</h3>
                  <p className="text-gray-300 text-lg">Get your food delivered in under 30 minutes or it's free. Our advanced logistics ensure your meal arrives hot and fresh.</p>
                </div>
                <motion.div
                  className="flex items-center gap-2 text-purple-400"
                  whileHover={{ x: 10 }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
              <motion.div
                className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            </motion.div>

            {/* Small Feature Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl p-6"
            >
              <MapPin className="w-10 h-10 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Live Tracking</h3>
              <p className="text-gray-400 text-sm">Track your order in real-time</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl p-6"
            >
              <Shield className="w-10 h-10 text-green-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
              <p className="text-gray-400 text-sm">Contactless delivery options</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <CreditCard className="w-10 h-10 text-orange-400 mb-3" />
                  <h3 className="text-2xl font-bold mb-2">Multiple Payment Options</h3>
                  <p className="text-gray-400">Pay with card, wallet, or cash on delivery</p>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 opacity-20 blur-2xl"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 backdrop-blur-xl p-6"
            >
              <TrendingUp className="w-10 h-10 text-pink-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Best Deals</h3>
              <p className="text-gray-400 text-sm">Exclusive offers & discounts</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Restaurant Discovery CTA */}
      <section id="restaurants" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Discover Amazing Restaurants
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Explore hundreds of restaurants in your city, from local favorites to international cuisine
            </p>

            <motion.a
              href="/discover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-black text-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all"
            >
              Explore Restaurants <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Animated Steps */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Three simple steps to delicious food</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: 'Choose & Order', desc: 'Browse menus and place your order with just a few taps', step: '01' },
              { icon: CreditCard, title: 'Quick Payment', desc: 'Secure payment with multiple options available', step: '02' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Track your order and receive it within 30 minutes', step: '03' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-10 blur-2xl"
                  />
                  <div className="text-6xl font-bold text-white/10 mb-4">{item.step}</div>
                  <item.icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
                {i < 2 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.3 }}
                    className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent -translate-y-1/2 origin-left"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20" />
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 text-center overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-3xl opacity-20"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Ready to Order?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers and experience the fastest food delivery in your city
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-boldg hover:shadow-lg hover:shadow-yellow-500/25 transition-all flex items-center justify-center gap-2"
                >
                  Download App <Smartphone className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 font-semibold text-lg hover:bg-white/20 transition-all"
                >
                  Order Online
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Free delivery on first order</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>No minimum order</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default QuickBiteLanding
