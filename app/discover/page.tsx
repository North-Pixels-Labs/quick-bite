"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Clock, MapPin, Star, Sparkles, Pizza, Salad, Coffee, Loader2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useRestaurantsByCity } from '@/hooks/useCustomerQueries'
import type { Restaurant } from '@/types/restaurant.types'

const DiscoverPage = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('Accra') // Default city

  const { data: restaurants = [], isLoading, error } = useRestaurantsByCity(selectedCity)

  // Get unique cuisine types from restaurants
  const cuisineTypes = Array.from(new Set(restaurants.map(r => r.cuisine_type).filter(Boolean)))

  const foodCategories = [
    { id: 'all', name: 'All', icon: Sparkles },
    ...cuisineTypes.map(cuisine => ({
      id: cuisine.toLowerCase(),
      name: cuisine,
      icon: Sparkles // Default icon, could be customized per cuisine
    }))
  ]

  // Filter restaurants by category
  const filteredRestaurants = activeCategory === 'all'
    ? restaurants
    : restaurants.filter(r => r.cuisine_type?.toLowerCase() === activeCategory.toLowerCase())

  const getCategoryColor = (cuisineType: string) => {
    const colors = [
      'from-red-600/20 to-yellow-600/20',
      'from-green-600/20 to-emerald-600/20',
      'from-blue-600/20 to-cyan-600/20',
      'from-purple-600/20 to-pink-600/20',
      'from-orange-600/20 to-red-600/20',
      'from-yellow-600/20 to-orange-600/20'
    ]
    const index = cuisineType.length % colors.length
    return colors[index]
  }

  const getCuisineEmoji = (cuisineType: string) => {
    const emojiMap: { [key: string]: string } = {
      'pizza': '🍕',
      'italian': '🍝',
      'chinese': '🥡',
      'japanese': '🍱',
      'mexican': '🌮',
      'american': '🍔',
      'indian': '🍛',
      'thai': '🍜',
      'mediterranean': '🫒',
      'healthy': '🥗',
      'salad': '🥬',
      'coffee': '☕',
      'beverages': '🥤',
      'dessert': '🍰',
      'fast food': '🍟'
    }
    return emojiMap[cuisineType.toLowerCase()] || '🍽️'
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Discover Restaurants
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Find amazing food from restaurants near you in {selectedCity}
            </p>

            {/* City Selector */}
            <div className="flex justify-center mb-8">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Accra">Accra</option>
                <option value="Tema">Tema</option>
                <option value="Takoradi">Takoradi</option>
                <option value="Kumasi">Kumasi</option>
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Restaurants in {selectedCity}
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">Choose from our partner restaurants</p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {foodCategories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <span className="ml-2 text-gray-400">Loading restaurants...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">Failed to load restaurants</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-full bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Restaurants Grid */}
          {!isLoading && !error && (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredRestaurants.map((restaurant, i) => (
                  <motion.div
                    key={restaurant.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl"
                      style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                    />
                    <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${getCategoryColor(activeCategory)} backdrop-blur-xl border border-white/10 overflow-hidden`}>
                      <motion.div
                        className="text-6xl mb-4"
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {getCuisineEmoji(activeCategory === 'all' ? restaurant.cuisine_type || 'general' : activeCategory)}
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">{restaurant.cuisine_type}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span>{restaurant.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{restaurant.estimated_delivery_time || 30} min</span>
                        </div>
                      </div>
                      {restaurant.description && (
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                          {restaurant.description}
                        </p>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                      >
                        View Menu <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredRestaurants.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 mb-4">No restaurants found in this category</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="px-6 py-3 rounded-full bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors"
              >
                Show All Restaurants
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default DiscoverPage
