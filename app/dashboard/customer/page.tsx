'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Bell, Clock, MapPin, Star, Loader2, TrendingUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCustomerOrders, useCustomerFavorites, useCustomerNotifications } from '@/hooks/useCustomerQueries'
import { format } from 'date-fns'

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount / 100)
}

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hr ago`
    return format(date, 'MMM d, h:mm a')
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'bg-yellow-500/20 text-yellow-400'
        case 'confirmed':
            return 'bg-blue-500/20 text-blue-400'
        case 'preparing':
            return 'bg-orange-500/20 text-orange-400'
        case 'ready':
            return 'bg-purple-500/20 text-purple-400'
        case 'out_for_delivery':
            return 'bg-cyan-500/20 text-cyan-400'
        case 'delivered':
            return 'bg-green-500/20 text-green-400'
        case 'cancelled':
            return 'bg-red-500/20 text-red-400'
        default:
            return 'bg-gray-500/20 text-gray-400'
    }
}

export default function CustomerDashboardOverview() {
    const { user } = useAuth()

    const { data: orders, isLoading: ordersLoading } = useCustomerOrders()
    const { data: favorites, isLoading: favoritesLoading } = useCustomerFavorites()
    const { data: notifications, isLoading: notificationsLoading } = useCustomerNotifications()

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

    const stats = useMemo(() => {
        const totalOrders = orders?.length || 0
        const activeOrders = orders?.filter((order: any) => ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status))?.length || 0
        const totalSpent = orders?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0
        const favoriteCount = favorites?.length || 0

        return [
            {
                label: 'Total Orders',
                value: totalOrders.toString(),
                change: '+12.5%',
                icon: ShoppingBag,
                color: 'from-emerald-500 to-green-500'
            },
            {
                label: 'Active Orders',
                value: activeOrders.toString(),
                change: activeOrders > 0 ? 'In Progress' : 'None',
                icon: Clock,
                color: 'from-blue-500 to-cyan-500'
            },
            {
                label: 'Total Spent',
                value: formatCurrency(totalSpent),
                change: '+8.2%',
                icon: TrendingUp,
                color: 'from-purple-500 to-pink-500'
            },
            {
                label: 'Favorites',
                value: favoriteCount.toString(),
                change: favoriteCount > 0 ? 'Saved' : 'None',
                icon: Heart,
                color: 'from-red-500 to-pink-500'
            }
        ]
    }, [orders, favorites])

    const recentOrders = useMemo(() => {
        if (!orders) return []

        return orders
            .slice(0, 4)
            .map((order: any) => ({
                id: `#${order.order_number || order.id?.slice(0, 8)}`,
                restaurant: order.restaurant_name || 'Restaurant',
                items: order.items?.length || 0,
                status: order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown',
                time: formatTimeAgo(order.updated_at || order.created_at),
                amount: formatCurrency(order.total_amount || 0)
            }))
    }, [orders])

    const unreadNotifications = useMemo(() => {
        return notifications?.filter((n: any) => !n.read)?.length || 0
    }, [notifications])

    const isLoading = ordersLoading || favoritesLoading || notificationsLoading

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
                    <h1 className="text-2xl font-bold text-white">Customer Dashboard</h1>
                    <p className="text-gray-400">{getGreeting()}, {getUserName()}! Here's your order overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        unreadNotifications > 0
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-gray-500/20 text-gray-400'
                    }`}>
                        {unreadNotifications > 0 ? `${unreadNotifications} New` : 'All Read'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${
                                stat.change.startsWith('+') ? 'text-green-400' :
                                stat.change === 'In Progress' ? 'text-blue-400' :
                                stat.change === 'Saved' ? 'text-red-400' : 'text-gray-400'
                            }`}>
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                        <button className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.length > 0 ? recentOrders.map((order) => (
                            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors gap-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-sm font-bold text-gray-400 flex-shrink-0">
                                        <ShoppingBag className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-white truncate">{order.restaurant}</p>
                                        <p className="text-xs text-gray-500 truncate">{order.items} items • {order.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                                    <p className="text-sm font-bold text-white">{order.amount}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8">
                                <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400">No orders yet</p>
                                <p className="text-sm text-gray-500">Your order history will appear here</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-sm font-medium text-white">Order Food</span>
                        </button>
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <Heart className="w-4 h-4 text-red-500" />
                            </div>
                            <span className="text-sm font-medium text-white">View Favorites</span>
                        </button>
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <Bell className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-sm font-medium text-white">Notifications</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
