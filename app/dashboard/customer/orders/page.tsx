'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Clock, MapPin, Star, Filter, Search, Loader2, History, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCustomerOrders, useCustomerOrderStatusHistory } from '@/hooks/useCustomerQueries'
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
    return format(date, 'MMM d, yyyy')
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

const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
]

export default function CustomerOrdersPage() {
    const { user } = useAuth()
    const { data: orders, isLoading } = useCustomerOrders()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const { data: orderHistory, isLoading: historyLoading } = useCustomerOrderStatusHistory(selectedOrderId || '')

    const filteredOrders = useMemo(() => {
        if (!orders) return []

        return orders.filter((order: any) => {
            const matchesSearch = searchTerm === '' ||
                order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.restaurant_name?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === 'all' ||
                order.status?.toLowerCase() === statusFilter.toLowerCase()

            return matchesSearch && matchesStatus
        })
    }, [orders, searchTerm, statusFilter])

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
                    <h1 className="text-2xl font-bold text-white">Order History</h1>
                    <p className="text-gray-400">{getGreeting()}, {getUserName()}! Here's your complete order history.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search orders by number or restaurant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500/50 focus:outline-none transition-colors appearance-none"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length > 0 ? filteredOrders.map((order: any, index: number) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-sm font-bold text-gray-400 flex-shrink-0">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-white">#{order.order_number || order.id?.slice(0, 8)}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(order.status)}`}>
                                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">{order.restaurant_name || 'Restaurant'}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTimeAgo(order.created_at)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {order.delivery_address?.street || 'Delivery Address'}
                                        </span>
                                        <span>{order.items?.length || 0} items</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3">
                                <div className="text-right">
                                    <p className="text-lg font-bold text-white">{formatCurrency(order.total_amount || 0)}</p>
                                    <p className="text-xs text-gray-500">Total</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedOrderId(order.id)}
                                        className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium flex items-center gap-1"
                                    >
                                        <History className="w-3 h-3" />
                                        History
                                    </button>
                                    <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No orders found</h3>
                        <p className="text-gray-400 mb-4">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'You haven\'t placed any orders yet'
                            }
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                            <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                                Start Ordering
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            {orders && orders.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 text-center">
                        <h4 className="text-2xl font-bold text-white">{orders.length}</h4>
                        <p className="text-sm text-gray-400">Total Orders</p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 text-center">
                        <h4 className="text-2xl font-bold text-white">
                            {orders.filter((o: any) => o.status === 'delivered').length}
                        </h4>
                        <p className="text-sm text-gray-400">Completed</p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 text-center">
                        <h4 className="text-2xl font-bold text-white">
                            {formatCurrency(orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0))}
                        </h4>
                        <p className="text-sm text-gray-400">Total Spent</p>
                    </div>
                </motion.div>
            )}

            {/* Order History Modal */}
            {selectedOrderId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Order Status History</h3>
                                <button
                                    onClick={() => setSelectedOrderId(null)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {historyLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                </div>
                            ) : orderHistory && orderHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {orderHistory.map((history: any, index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-4"
                                        >
                                            <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(history.status)}`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-white capitalize">
                                                        {history.status.replace('_', ' ')}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(history.status)}`}>
                                                        {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mb-2">
                                                    {format(new Date(history.created_at), 'MMM d, yyyy h:mm a')}
                                                </p>
                                                {history.updated_by && (
                                                    <p className="text-xs text-gray-500">
                                                        Updated by: {history.updated_by}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-400">No status history available</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
