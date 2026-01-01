"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Clock, Star, Sparkles, Search, TrendingUp, MapPin, Flame, ChevronDown, Loader2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useRestaurantsByCity } from '@/hooks/useCustomerQueries'
import type { Restaurant } from '@/types/restaurant.types'
import { ParticleCanvas } from '@/components/ParticleCanvas'

const DiscoverPage = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('Accra')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCityDropdown, setShowCityDropdown] = useState(false)

  const { data: restaurants = [], isLoading, error } = useRestaurantsByCity(selectedCity)

  // Get unique cuisine types from restaurants
  const cuisineTypes = Array.from(new Set(restaurants.map(r => r.cuisine_type).filter(Boolean)))

  const foodCategories = [
    { id: 'all', name: 'All', icon: Sparkles, gradient: 'from-purple-500 to-pink-500' },
    ...cuisineTypes.map(cuisine => ({
      id: cuisine.toLowerCase(),
      name: cuisine,
      icon: Sparkles,
      gradient: 'from-orange-500 to-red-500'
    }))
  ]

  // Filter restaurants by category and search
  const filteredRestaurants = restaurants
    .filter(r => activeCategory === 'all' || r.cuisine_type?.toLowerCase() === activeCategory)
    .filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.cuisine_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

  // Get trending restaurants (top rated)
  const trendingRestaurants = [...restaurants]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)

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
    return emojiMap[cuisineType?.toLowerCase()] || '🍽️'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <ParticleCanvas />
      <Header />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-block mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 blur-2xl opacity-50" />
                  <h1 className="relative text-6xl md:text-8xl font-black">
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                      Discover
                    </span>
                  </h1>
                </div>
              </motion.div>
              
              <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto font-light">
                Explore the best restaurants and cuisines in your city
              </p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto mb-8"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-3">
                    <Search className="w-6 h-6 text-gray-400 ml-3" />
                    <input
                      type="text"
                      placeholder="Search restaurants or cuisines..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* City Selector */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center items-center gap-3"
              >
                <MapPin className="w-5 h-5 text-purple-400" />
                <div className="relative">
                  <button
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <span className="font-medium text-white">{selectedCity}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showCityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 right-0 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50"
                      >
                        {['Accra', 'Tema', 'Takoradi', 'Kumasi'].map(city => (
                          <button
                            key={city}
                            onClick={() => {
                              setSelectedCity(city)
                              setShowCityDropdown(false)
                            }}
                            className="w-full px-6 py-3 text-left hover:bg-white/5 transition-colors"
                          >
                            {city}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {/* Trending Section */}
            {!isLoading && trendingRestaurants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-bold text-white">Trending Now</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trendingRestaurants.map((restaurant, i) => (
                    <motion.div
                      key={restaurant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="relative group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden">
                        <div className="absolute top-3 right-3">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            HOT
                          </div>
                        </div>
                        <div className="text-5xl mb-4">{getCuisineEmoji(restaurant.cuisine_type || '')}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{restaurant.name}</h3>
                        <p className="text-sm text-purple-300 mb-3">{restaurant.cuisine_type}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span>{restaurant.rating?.toFixed(1) || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{restaurant.estimated_delivery_time || 30} min</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Category Filter */}
            {!isLoading && foodCategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Browse by Cuisine</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {foodCategories.map((category, i) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategory(category.id)}
                      className={`relative px-6 py-3 rounded-full font-medium transition-all ${
                        activeCategory === category.id
                          ? 'text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {activeCategory === category.id && (
                        <motion.div
                          layoutId="activeCategory"
                          className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-full`}
                          transition={{ type: "spring", duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col justify-center items-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-purple-400 mb-4" />
                <span className="text-gray-400 text-lg">Loading restaurants...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Failed to load restaurants</h3>
                <p className="text-red-400 mb-6">Please try again later</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Restaurants Grid */}
            {!isLoading && !error && (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredRestaurants.map((restaurant, i) => (
                    <motion.div
                      key={restaurant.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                          <motion.div
                            className="text-6xl mb-4"
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {getCuisineEmoji(restaurant.cuisine_type || '')}
                          </motion.div>
                          
                          <h3 className="text-2xl font-bold text-white mb-2">{restaurant.name}</h3>
                          <p className="text-sm text-purple-300 mb-4">{restaurant.cuisine_type}</p>
                          
                          {restaurant.description && (
                            <p className="text-sm text-gray-400 mb-4 flex-grow line-clamp-2">
                              {restaurant.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-white font-medium">{restaurant.rating?.toFixed(1) || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{restaurant.estimated_delivery_time || 30} min</span>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                          >
                            View Menu <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredRestaurants.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-3">No restaurants found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery 
                    ? `No results for "${searchQuery}". Try adjusting your search.`
                    : 'Try adjusting your filters or search query'}
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all')
                    setSearchQuery('')
                  }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default DiscoverPage