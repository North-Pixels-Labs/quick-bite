'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Clock, Star, Search, Loader2, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCustomerFavorites } from '@/hooks/useCustomerQueries'

const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400'
    if (rating >= 4.0) return 'text-yellow-400'
    if (rating >= 3.5) return 'text-orange-400'
    return 'text-red-400'
}

const getDeliveryTimeColor = (time: number) => {
    if (time <= 20) return 'text-green-400'
    if (time <= 35) return 'text-yellow-400'
    if (time <= 50) return 'text-orange-400'
    return 'text-red-400'
}

export default function CustomerFavoritesPage() {
    const { user } = useAuth()
    const { data: favorites, isLoading } = useCustomerFavorites()
    const [searchTerm, setSearchTerm] = useState('')

    const filteredFavorites = useMemo(() => {
        if (!favorites) return []

        return favorites.filter((restaurant: any) =>
            searchTerm === '' ||
            restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.cuisine_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [favorites, searchTerm])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }

    const getUserName = () => {
        if (!user) return ''
        return user.first_name || user.email?.split('@')[0] || 'customer'
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Favorites</h1>
                    <p className="text-gray-400">{getGreeting()}, {getUserName()}! Your favorite restaurants, just a tap away.</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                    type="text"
                    placeholder="Search your favorite restaurants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
                />
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.length > 0 ? filteredFavorites.map((restaurant: any, index: number) => (
                    <motion.div
                        key={restaurant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors group"
                    >
                        {/* Restaurant Image */}
                        <div className="relative h-48 bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                            {restaurant.image_url ? (
                                <img
                                    src={restaurant.image_url}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-16 h-16 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center">
                                        <Heart className="w-8 h-8 text-emerald-400" />
                                    </div>
                                </div>
                            )}

                            {/* Favorite Button */}
                            <button className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-colors">
                                <Heart className="w-4 h-4 fill-current" />
                            </button>

                            {/* Status Badge */}
                            <div className="absolute top-3 left-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    restaurant.is_open
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                }`}>
                                    {restaurant.is_open ? 'Open' : 'Closed'}
                                </span>
                            </div>
                        </div>

                        {/* Restaurant Info */}
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-bold text-white truncate">{restaurant.name}</h3>
                                <div className="flex items-center gap-1 ml-2">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className={`text-sm font-medium ${getRatingColor(restaurant.rating || 0)}`}>
                                        {restaurant.rating?.toFixed(1) || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 mb-3">{restaurant.cuisine_type || 'Various Cuisine'}</p>

                            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                                <div className="flex items-center gap-1">
                                    <Clock className={`w-4 h-4 ${getDeliveryTimeColor(restaurant.delivery_time || 30)}`} />
                                    <span>{restaurant.delivery_time || 30} min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{restaurant.distance?.toFixed(1) || 'N/A'} km</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium">
                                    Order Now
                                </button>
                                <button className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors">
                                    View Menu
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full text-center py-12">
                        <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">
                            {searchTerm ? 'No favorites found' : 'No favorite restaurants yet'}
                        </h3>
                        <p className="text-gray-400 mb-4">
                            {searchTerm
                                ? 'Try adjusting your search terms'
                                : 'Start exploring restaurants and add them to your favorites for quick access'
                            }
                        </p>
                        {!searchTerm && (
                            <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                                Discover Restaurants
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Favorites Stats */}
            {favorites && favorites.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 text-center">
                        <h4 className="text-2xl font-bold text-white">{favorites.length}</h4>
                        <p className="text-sm text-gray-400">Favorite Restaurants</p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 text-center">
                        <h4 className="text-2xl font-bold text-white">
                            {favorites.filter((r: any) => r.is_open).length}
                        </h4>
                        <p className="text-sm text-gray-400">Currently Open</p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 text-center">
                        <h4 className="text-2xl font-bold text-white">
                            {favorites.reduce((avg: number, r: any) => avg + (r.rating || 0), 0) / favorites.length || 0}
                        </h4>
                        <p className="text-sm text-gray-400">Avg Rating</p>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
