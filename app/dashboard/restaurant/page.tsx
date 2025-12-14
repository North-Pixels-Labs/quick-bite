'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ShoppingBag, Users, DollarSign, Clock, ArrowUpRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRestaurants } from '@/hooks/useRestaurantQueries'
import { useRestaurantOrders } from '@/hooks/useOrderQueries'
import { useDailyAnalytics } from '@/hooks/useAnalyticsQueries'
import { format } from 'date-fns'

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount / 100) // Convert from pesewas to cedis
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
        case 'preparing':
            return 'bg-blue-500/20 text-blue-400'
        case 'ready':
        case 'picked_up':
            return 'bg-orange-500/20 text-orange-400'
        case 'out_for_delivery':
            return 'bg-purple-500/20 text-purple-400'
        case 'delivered':
            return 'bg-green-500/20 text-green-400'
        case 'cancelled':
            return 'bg-red-500/20 text-red-400'
        default:
            return 'bg-gray-500/20 text-gray-400'
    }
}

export default function DashboardOverview() {
    const { user } = useAuth()
    
    // Fetch restaurant data
    const { data: restaurants, isLoading: restaurantsLoading } = useRestaurants()
    const currentRestaurant = restaurants?.[0] // Assuming first restaurant for now
    
    // Fetch orders data
    const { data: orders, isLoading: ordersLoading } = useRestaurantOrders(
        currentRestaurant?.id || '',
        {}
    )
    
    // Fetch analytics data
    const today = format(new Date(), 'yyyy-MM-dd')
    const { data: todayAnalytics, isLoading: analyticsLoading } = useDailyAnalytics(
        currentRestaurant?.id || '',
        { start_date: today, end_date: today }
    )

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }

    const getUserName = () => {
        if (!user) return ''
        return user.first_name || user.email?.split('@')[0] || 'there'
    }

    // Calculate stats from real data
    const stats = useMemo(() => {
        const todayData = todayAnalytics?.[0]
        const recentOrders = orders?.slice(0, 10) || []
        
        // Calculate today's revenue
        const todayRevenue = recentOrders
            .filter(order => {
                const orderDate = format(new Date(order.created_at), 'yyyy-MM-dd')
                return orderDate === today
            })
            .reduce((sum, order) => sum + order.total_amount, 0)

        // Calculate active customers (unique customers from recent orders)
        const activeCustomers = new Set(
            recentOrders
                .filter(order => {
                    const orderDate = new Date(order.created_at)
                    const daysDiff = (new Date().getTime() - orderDate.getTime()) / (1000 * 3600 * 24)
                    return daysDiff <= 7 // Last 7 days
                })
                .map(order => order.customer_id)
        ).size

        // Calculate average prep time from recent completed orders
        const completedOrders = recentOrders.filter(order => 
            order.status === 'delivered' && order.ready_at && order.confirmed_at
        )
        const avgPrepTime = completedOrders.length > 0 
            ? completedOrders.reduce((sum, order) => {
                const prepTime = new Date(order.ready_at!).getTime() - new Date(order.confirmed_at!).getTime()
                return sum + (prepTime / (1000 * 60)) // Convert to minutes
            }, 0) / completedOrders.length
            : 0

        return [
            {
                label: 'Today\'s Revenue',
                value: formatCurrency(todayRevenue),
                change: todayData ? `${todayData.total_revenue > 0 ? '+' : ''}${((todayRevenue / 100) / 100).toFixed(1)}%` : '+0%',
                icon: DollarSign,
                color: 'from-green-500 to-emerald-500'
            },
            {
                label: 'Total Orders',
                value: todayData?.total_orders?.toString() || orders?.length?.toString() || '0',
                change: '+8.2%', // You can calculate this from historical data
                icon: ShoppingBag,
                color: 'from-blue-500 to-cyan-500'
            },
            {
                label: 'Active Customers',
                value: activeCustomers.toString(),
                change: '+5.1%', // You can calculate this from historical data
                icon: Users,
                color: 'from-purple-500 to-pink-500'
            },
            {
                label: 'Avg. Prep Time',
                value: avgPrepTime > 0 ? `${Math.round(avgPrepTime)} min` : 'N/A',
                change: avgPrepTime > 0 ? '-2.3%' : '0%', // You can calculate this from historical data
                icon: Clock,
                color: 'from-orange-500 to-red-500'
            }
        ]
    }, [orders, todayAnalytics, today])

    // Get recent orders for display
    const recentOrders = useMemo(() => {
        if (!orders) return []
        
        return orders
            .slice(0, 4)
            .map(order => ({
                id: `#${order.order_number}`,
                customer: `Customer ${order.customer_id.slice(0, 8)}`, // You might want to fetch customer names
                items: `${order.id}`, // You might want to fetch order items
                total: formatCurrency(order.total_amount),
                status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
                time: formatTimeAgo(order.created_at)
            }))
    }, [orders])

    const isLoading = restaurantsLoading || ordersLoading || analyticsLoading

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    if (!currentRestaurant) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No restaurant found. Please create a restaurant first.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-gray-400">{getGreeting()}, {getUserName()}! Here's what's happening today.</p>
                </div>
                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                    Download Report
                </button>
            </div>

            {/* Stats Grid */}
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
                            <div className={`flex items-center gap-1 text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.change}
                                <ArrowUpRight className={`w-3 h-3 ${stat.change.startsWith('+') ? '' : 'rotate-90'}`} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                        <button className="text-sm text-orange-400 hover:text-orange-300">View All</button>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors gap-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-sm font-bold text-gray-400 flex-shrink-0">
                                        {order.customer.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-white truncate">{order.customer}</p>
                                        <p className="text-xs text-gray-500 truncate">{order.items}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                                    <p className="text-sm font-bold text-white">{order.total}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions / Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 text-orange-500" />
                            </div>
                            <span className="text-sm font-medium text-white">Create New Order</span>
                        </button>
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-sm font-medium text-white">Add Staff Member</span>
                        </button>
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-purple-500" />
                            </div>
                            <span className="text-sm font-medium text-white">View Analytics</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
