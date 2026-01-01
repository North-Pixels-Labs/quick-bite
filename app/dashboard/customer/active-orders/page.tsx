'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Clock, MapPin, Phone, MessageCircle, Loader2, CheckCircle, Truck, X, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCustomerOrders } from '@/hooks/useCustomerQueries'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { customerApi } from '@/lib/api'
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
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        case 'confirmed':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        case 'preparing':
            return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
        case 'ready':
            return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        case 'out_for_delivery':
            return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
        default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
}

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return Clock
        case 'confirmed':
            return CheckCircle
        case 'preparing':
            return Package
        case 'ready':
            return CheckCircle
        case 'out_for_delivery':
            return Truck
        default:
            return Clock
    }
}

const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'Your order is being reviewed by the restaurant'
        case 'confirmed':
            return 'Your order has been confirmed and will be prepared soon'
        case 'preparing':
            return 'Your delicious food is being prepared'
        case 'ready':
            return 'Your order is ready and waiting for pickup/delivery'
        case 'out_for_delivery':
            return 'Your order is on the way!'
        default:
            return 'Order status update'
    }
}

export default function CustomerActiveOrdersPage() {
    const { user } = useAuth()
    const { data: orders, isLoading } = useCustomerOrders()
    const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)
    const queryClient = useQueryClient()

    const activeOrders = useMemo(() => {
        if (!orders) return []

        return orders.filter((order: any) =>
            ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status)
        ).sort((a: any, b: any) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
    }, [orders])

    const cancelOrderMutation = useMutation({
        mutationFn: (orderId: string) =>
            customerApi.updateOrderStatus(orderId, { status: 'cancelled' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer', 'orders'] })
            setCancelOrderId(null)
        },
    })

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
                    <h1 className="text-2xl font-bold text-white">Active Orders</h1>
                    <p className="text-gray-400">{getGreeting()}, {getUserName()}! Track your orders in real-time.</p>
                </div>
            </div>

            <div className="space-y-6">
                {activeOrders.length > 0 ? activeOrders.map((order: any, index: number) => {
                    const StatusIcon = getStatusIcon(order.status)

                    return (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                {/* Order Status */}
                                <div className="flex items-start gap-4 lg:min-w-0 lg:flex-1">
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(order.status)}`}>
                                        <StatusIcon className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-white">#{order.order_number || order.id?.slice(0, 8)}</h3>
                                            <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-3">{order.restaurant_name || 'Restaurant'}</p>
                                        <p className="text-sm text-gray-300 mb-4">{getStatusMessage(order.status)}</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span>Ordered {formatTimeAgo(order.created_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <MapPin className="w-4 h-4" />
                                                <span>{order.delivery_address?.street || 'Delivery Address'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items & Actions */}
                                <div className="lg:min-w-0 lg:w-80">
                                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                                        <h4 className="text-sm font-medium text-white mb-3">Order Items</h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {order.items?.slice(0, 3).map((item: any, itemIndex: number) => (
                                                <div key={itemIndex} className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-300 truncate">{item.menu_item_name || 'Item'}</span>
                                                    <span className="text-gray-400">x{item.quantity}</span>
                                                </div>
                                            ))}
                                            {order.items?.length > 3 && (
                                                <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
                                            )}
                                        </div>
                                        <div className="border-t border-white/10 mt-3 pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-white">Total</span>
                                                <span className="text-lg font-bold text-emerald-400">{formatCurrency(order.total_amount || 0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium">
                                            Track Order
                                        </button>
                                        <button className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors">
                                            <MessageCircle className="w-4 h-4" />
                                        </button>
                                        <button className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors">
                                            <Phone className="w-4 h-4" />
                                        </button>
                                        {['pending', 'confirmed'].includes(order.status) && (
                                            <button
                                                onClick={() => setCancelOrderId(order.id)}
                                                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                }) : (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No active orders</h3>
                        <p className="text-gray-400 mb-4">You don't have any orders in progress right now</p>
                        <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                            Browse Restaurants
                        </button>
                    </div>
                )}
            </div>

            {/* Order Tips */}
            {activeOrders.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <h3 className="text-lg font-bold text-white mb-4">Order Tracking Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-white mb-1">Real-time Updates</h4>
                                <p className="text-xs text-gray-400">Get instant notifications about your order status</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-white mb-1">Contact Support</h4>
                                <p className="text-xs text-gray-400">Need help? Contact the restaurant or rider directly</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Cancel Order Confirmation Dialog */}
            {cancelOrderId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-md w-full"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Cancel Order</h3>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Are you sure you want to cancel this order? This action cannot be undone and you may not be able to reorder immediately.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancelOrderId(null)}
                                className="flex-1 px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={() => cancelOrderMutation.mutate(cancelOrderId)}
                                disabled={cancelOrderMutation.isPending}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {cancelOrderMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : null}
                                Cancel Order
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
