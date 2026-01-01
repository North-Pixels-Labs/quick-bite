'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, DollarSign, Check, X, Loader2, Package } from 'lucide-react'
import { useRiderRequests, useAcceptAssignment, useDeclineRequest, useMarkRequestViewed } from '@/hooks/useRiderQueries'
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

const getDistanceText = (distance?: number) => {
    if (!distance) return 'Distance unknown'
    if (distance < 1) return `${(distance * 1000).toFixed(0)}m away`
    return `${distance.toFixed(1)}km away`
}

export default function RiderRequestsPage() {
    const { data: requests, isLoading, error } = useRiderRequests()
    const acceptAssignment = useAcceptAssignment()
    const declineRequest = useDeclineRequest()
    const markRequestViewed = useMarkRequestViewed()

    const handleAccept = async (orderId: string, requestId: string) => {
        try {
            await acceptAssignment.mutateAsync(orderId)
        } catch (error) {
            console.error('Failed to accept assignment:', error)
        }
    }

    const handleDecline = async (requestId: string) => {
        try {
            await declineRequest.mutateAsync(requestId)
        } catch (error) {
            console.error('Failed to decline request:', error)
        }
    }

    const handleViewRequest = async (requestId: string) => {
        try {
            await markRequestViewed.mutateAsync(requestId)
        } catch (error) {
            console.error('Failed to mark request as viewed:', error)
        }
    }

    // Create skeleton loading layout
    const RequestSkeleton = () => (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Order Details */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="text-right space-y-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-3 w-28" />
                        </div>
                    </div>

                    {/* Restaurant & Customer Info */}
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

                    {/* Distance & Time */}
                    <div className="flex items-center gap-6">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:min-w-[200px]">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
            </div>
        </div>
    )

    if (isLoading) {
        return (
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Delivery Requests</h1>
                        <p className="text-gray-400">New delivery opportunities available</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <span className="text-sm text-gray-400">Live updates</span>
                    </div>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <RequestSkeleton />
                        </motion.div>
                    ))}
                </div>
            </div>
        )
    }

    // Improved error handling with user-friendly messages
    if (error) {
        let errorMessage = 'Failed to load requests'
        let errorDescription = 'Please try again later'

        // Try to parse the error response
        try {
            const errorData = JSON.parse(error.message || error.toString())
            if (errorData?.error) {
                const backendError = errorData.error.toLowerCase()
                if (backendError.includes('record not found') || backendError.includes('no requests')) {
                    errorMessage = 'No delivery requests'
                    errorDescription = 'There are no delivery requests available at the moment'
                } else if (backendError.includes('unauthorized') || backendError.includes('forbidden')) {
                    errorMessage = 'Access denied'
                    errorDescription = 'You don\'t have permission to view delivery requests'
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Delivery Requests</h1>
                    <p className="text-gray-400">New delivery opportunities available</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">Live updates</span>
                </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {requests && requests.length > 0 ? requests.map((request: any, index: number) => (
                    <motion.div
                        key={request.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                        onMouseEnter={() => handleViewRequest(request.id)}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            {/* Order Details */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">
                                            Order #{request.order?.order_number || request.order_id?.slice(0, 8)}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {formatTimeAgo(request.sent_at || request.created_at)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-green-400">
                                            {formatCurrency(request.order?.total_amount || 0)}
                                        </p>
                                        <p className="text-xs text-gray-500">Delivery fee included</p>
                                    </div>
                                </div>

                                {/* Restaurant & Customer Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-orange-500" />
                                            <span className="text-sm font-medium text-white">Pickup</span>
                                        </div>
                                        <p className="text-sm text-gray-300 ml-6">
                                            {request.order?.restaurant?.name || 'Restaurant Name'}
                                        </p>
                                        <p className="text-xs text-gray-500 ml-6">
                                            {request.order?.restaurant?.address || 'Restaurant address'}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm font-medium text-white">Delivery</span>
                                        </div>
                                        <p className="text-sm text-gray-300 ml-6">
                                            Customer {request.order?.customer_id?.slice(0, 8) || 'Unknown'}
                                        </p>
                                        <p className="text-xs text-gray-500 ml-6">
                                            {request.order?.delivery_address?.street || 'Delivery address'}
                                        </p>
                                    </div>
                                </div>

                                {/* Distance & Time */}
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-400">
                                            {getDistanceText(request.distance_km)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-400">
                                            Est. {request.estimated_time || '15-20'} min
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400 font-medium">
                                            +{formatCurrency(request.delivery_fee || 500)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:min-w-[200px]">
                                <button
                                    onClick={() => handleAccept(request.order_id || request.id, request.id)}
                                    disabled={acceptAssignment.isPending}
                                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {acceptAssignment.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleDecline(request.id)}
                                    disabled={declineRequest.isPending}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {declineRequest.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <X className="w-4 h-4" />
                                    )}
                                    Decline
                                </button>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        {request.status && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                        request.status === 'sent' ? 'bg-blue-500' :
                                        request.status === 'viewed' ? 'bg-orange-500' :
                                        request.status === 'accepted' ? 'bg-green-500' :
                                        request.status === 'declined' ? 'bg-red-500' : 'bg-gray-500'
                                    }`}></div>
                                    <span className="text-xs text-gray-400 capitalize">
                                        {request.status}
                                    </span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )) : (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No delivery requests</h3>
                        <p className="text-gray-400">New delivery opportunities will appear here</p>
                        <p className="text-sm text-gray-500 mt-2">Make sure you're online and available to receive requests</p>
                    </div>
                )}
            </div>
        </div>
    )
}
