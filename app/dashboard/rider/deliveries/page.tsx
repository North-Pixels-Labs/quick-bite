'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Navigation, CheckCircle, Clock, Package, Loader2, QrCode } from 'lucide-react'
import { useRiderActiveDeliveries, useConfirmDeliveryByCode, useConfirmDeliveryByQr } from '@/hooks/useRiderQueries'
import { Skeleton } from '@/components/ui/skeleton'
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
        case 'assigned':
        case 'accepted':
            return 'bg-blue-500/20 text-blue-400'
        case 'picked_up':
            return 'bg-orange-500/20 text-orange-400'
        case 'out_for_delivery':
            return 'bg-purple-500/20 text-purple-400'
        case 'delivered':
            return 'bg-green-500/20 text-green-400'
        default:
            return 'bg-gray-500/20 text-gray-400'
    }
}

export default function RiderDeliveriesPage() {
    const { data: deliveries, isLoading, error } = useRiderActiveDeliveries()
    const confirmByCode = useConfirmDeliveryByCode()
    const confirmByQr = useConfirmDeliveryByQr()

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean
        orderId: string
        method: 'code' | 'qr'
        code?: string
    }>({ isOpen: false, orderId: '', method: 'code' })

    const handleConfirmDelivery = async () => {
        if (!confirmModal.orderId) return

        try {
            if (confirmModal.method === 'code' && confirmModal.code) {
                await confirmByCode.mutateAsync({
                    orderId: confirmModal.orderId,
                    code: confirmModal.code
                })
            } else if (confirmModal.method === 'qr') {
                await confirmByQr.mutateAsync({
                    orderId: confirmModal.orderId,
                    qr: 'demo-qr-string'
                })
            }
            setConfirmModal({ isOpen: false, orderId: '', method: 'code' })
        } catch (error) {
            console.error('Failed to confirm delivery:', error)
        }
    }

    // Create skeleton loading layout
    const DeliverySkeleton = () => (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="text-right space-y-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-24 ml-6" />
                            <Skeleton className="h-3 w-32 ml-6" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-28 ml-6" />
                            <Skeleton className="h-3 w-36 ml-6" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-[200px] space-y-3">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                </div>
            </div>
        </div>
    )

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">My Deliveries</h1>
                        <p className="text-gray-400">Manage your active delivery assignments</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Active</p>
                            <Skeleton className="h-6 w-8" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {[...Array(3)].map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <DeliverySkeleton />
                        </motion.div>
                    ))}
                </div>
            </div>
        )
    }

    // Improved error handling with user-friendly messages
    if (error) {
        let errorMessage = 'Failed to load deliveries'
        let errorDescription = 'Please try again later'

        // Try to parse the error response
        try {
            const errorData = JSON.parse(error.message || error.toString())
            if (errorData?.error) {
                const backendError = errorData.error.toLowerCase()
                if (backendError.includes('record not found') || backendError.includes('no deliveries')) {
                    errorMessage = 'No deliveries found'
                    errorDescription = 'You don\'t have any active deliveries at the moment'
                } else if (backendError.includes('unauthorized') || backendError.includes('forbidden')) {
                    errorMessage = 'Access denied'
                    errorDescription = 'You don\'t have permission to view deliveries'
                } else if (backendError.includes('network') || backendError.includes('connection')) {
                    errorMessage = 'Connection error'
                    errorDescription = 'Please check your internet connection'
                }
            }
        } catch (e) {
            // If parsing fails, use default messages
        }

        return (
            <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{errorMessage}</h3>
                <p className="text-gray-400">{errorDescription}</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Deliveries</h1>
                    <p className="text-gray-400">Manage your active delivery assignments</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Active</p>
                        <p className="text-xl font-bold text-white">{deliveries?.length || 0}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {deliveries && deliveries.length > 0 ? deliveries.map((delivery: any, index: number) => (
                    <motion.div
                        key={delivery.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">
                                            Order #{delivery.order_number || delivery.id?.slice(0, 8)}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {formatTimeAgo(delivery.assigned_at || delivery.created_at)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-green-400">
                                            {formatCurrency(delivery.total_amount || 0)}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(delivery.status)}`}>
                                            {delivery.status?.charAt(0).toUpperCase() + delivery.status?.slice(1) || 'Unknown'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-orange-500" />
                                            <span className="text-sm font-medium text-white">Pickup</span>
                                        </div>
                                        <p className="text-sm text-gray-300 ml-6">
                                            {delivery.restaurant?.name || 'Restaurant Name'}
                                        </p>
                                        <p className="text-xs text-gray-500 ml-6">
                                            {delivery.restaurant?.address || 'Restaurant address'}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm font-medium text-white">Delivery</span>
                                        </div>
                                        <p className="text-sm text-gray-300 ml-6">
                                            Customer {delivery.customer_id?.slice(0, 8) || 'Unknown'}
                                        </p>
                                        <p className="text-xs text-gray-500 ml-6">
                                            {delivery.delivery_address?.street || 'Delivery address'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 lg:min-w-[200px]">
                                {delivery.status === 'out_for_delivery' ? (
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setConfirmModal({
                                                isOpen: true,
                                                orderId: delivery.id,
                                                method: 'code'
                                            })}
                                            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Confirm Delivery
                                        </button>
                                        <button
                                            onClick={() => setConfirmModal({
                                                isOpen: true,
                                                orderId: delivery.id,
                                                method: 'qr'
                                            })}
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <QrCode className="w-4 h-4" />
                                            Scan QR Code
                                        </button>
                                    </div>
                                ) : delivery.status !== 'delivered' ? (
                                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                                        <Navigation className="w-4 h-4" />
                                        Update Status
                                    </button>
                                ) : (
                                    <div className="w-full bg-green-500/20 text-green-400 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Completed
                                    </div>
                                )}

                                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm">
                                    <Navigation className="w-4 h-4" />
                                    Get Directions
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No active deliveries</h3>
                        <p className="text-gray-400">Your assigned deliveries will appear here</p>
                    </div>
                )}
            </div>

            {confirmModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-lg font-bold text-white mb-4">Confirm Delivery</h3>

                        {confirmModal.method === 'code' ? (
                            <div className="space-y-4">
                                <p className="text-gray-400 text-sm">
                                    Enter the 4-digit code provided by the customer
                                </p>
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    value={confirmModal.code || ''}
                                    onChange={(e) => setConfirmModal(prev => ({
                                        ...prev,
                                        code: e.target.value.replace(/\D/g, '').slice(0, 4)
                                    }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                                    maxLength={4}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-gray-400 text-sm">
                                    Scan the QR code provided by the customer
                                </p>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500">QR Scanner would go here</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setConfirmModal({ isOpen: false, orderId: '', method: 'code' })}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelivery}
                                disabled={confirmByCode.isPending || confirmByQr.isPending || (confirmModal.method === 'code' && !confirmModal.code)}
                                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {(confirmByCode.isPending || confirmByQr.isPending) ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                                Confirm
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
