'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Package, DollarSign, Clock, MapPin, Bike, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRiderProfile, useRiderActiveDeliveries, useRiderEarningsSummary } from '@/hooks/useRiderQueries'
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
        case 'picked_up':
            return 'bg-orange-500/20 text-orange-400'
        case 'out_for_delivery':
            return 'bg-blue-500/20 text-blue-400'
        case 'delivered':
            return 'bg-green-500/20 text-green-400'
        default:
            return 'bg-gray-500/20 text-gray-400'
    }
}

export default function RiderDashboardOverview() {
    const { user } = useAuth()

    const { data: riderProfile, isLoading: profileLoading } = useRiderProfile()
    const { data: activeDeliveries, isLoading: deliveriesLoading } = useRiderActiveDeliveries()
    const { data: earningsSummary, isLoading: earningsLoading } = useRiderEarningsSummary({ period: 'today' })

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }

    const getUserName = () => {
        if (!user) return ''
        return user.first_name || user.email?.split('@')[0] || 'rider'
    }

    const stats = useMemo(() => {
        const todayEarnings = earningsSummary?.total_delivery_fee || 0
        const deliveryCount = earningsSummary?.deliveries || 0
        const activeCount = activeDeliveries?.length || 0
        const avgDeliveryTime = deliveryCount > 0 ? 25 : 0

        return [
            {
                label: 'Today\'s Earnings',
                value: formatCurrency(todayEarnings),
                change: '+12.5%',
                icon: DollarSign,
                color: 'from-green-500 to-emerald-500'
            },
            {
                label: 'Active Deliveries',
                value: activeCount.toString(),
                change: activeCount > 0 ? 'Active' : 'Available',
                icon: Package,
                color: 'from-blue-500 to-cyan-500'
            },
            {
                label: 'Completed Today',
                value: deliveryCount.toString(),
                change: '+8.2%',
                icon: Bike,
                color: 'from-purple-500 to-pink-500'
            },
            {
                label: 'Avg. Delivery Time',
                value: avgDeliveryTime > 0 ? `${avgDeliveryTime} min` : 'N/A',
                change: avgDeliveryTime > 0 ? '-5.3%' : '0%',
                icon: Clock,
                color: 'from-orange-500 to-red-500'
            }
        ]
    }, [earningsSummary, activeDeliveries])

    const recentDeliveries = useMemo(() => {
        if (!activeDeliveries) return []

        return activeDeliveries
            .slice(0, 4)
            .map((delivery: any) => ({
                id: `#${delivery.order_number || delivery.id?.slice(0, 8)}`,
                customer: `Customer ${delivery.customer_id?.slice(0, 8) || 'Unknown'}`,
                address: delivery.delivery_address?.street || 'Address not available',
                status: delivery.status?.charAt(0).toUpperCase() + delivery.status?.slice(1) || 'Unknown',
                time: formatTimeAgo(delivery.updated_at || delivery.created_at),
                amount: formatCurrency(delivery.total_amount || 0)
            }))
    }, [activeDeliveries])

    const isLoading = profileLoading || deliveriesLoading || earningsLoading

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Rider Dashboard</h1>
                    <p className="text-gray-400">{getGreeting()}, {getUserName()}! Here's your delivery status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        riderProfile?.is_online
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                    }`}>
                        {riderProfile?.is_online ? 'Online' : 'Offline'}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        riderProfile?.is_available
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                    }`}>
                        {riderProfile?.is_available ? 'Available' : 'Unavailable'}
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
                                stat.change === 'Active' ? 'text-blue-400' : 'text-gray-400'
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
                        <h2 className="text-lg font-bold text-white">Active Deliveries</h2>
                        <button className="text-sm text-orange-400 hover:text-orange-300">View All</button>
                    </div>
                    <div className="space-y-4">
                        {recentDeliveries.length > 0 ? recentDeliveries.map((delivery) => (
                            <div key={delivery.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors gap-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-sm font-bold text-gray-400 flex-shrink-0">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-white truncate">{delivery.customer}</p>
                                        <p className="text-xs text-gray-500 truncate">{delivery.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                                    <p className="text-sm font-bold text-white">{delivery.amount}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(delivery.status)}`}>
                                        {delivery.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8">
                                <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400">No active deliveries</p>
                                <p className="text-sm text-gray-500">New orders will appear here</p>
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
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <Bike className="w-4 h-4 text-green-500" />
                            </div>
                            <span className="text-sm font-medium text-white">Go Online</span>
                        </button>
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-sm font-medium text-white">Update Location</span>
                        </button>
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-orange-500" />
                            </div>
                            <span className="text-sm font-medium text-white">View Requests</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
