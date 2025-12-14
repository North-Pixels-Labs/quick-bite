'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
    Search, 
    Filter, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Package, 
    Truck, 
    Eye,
    MoreHorizontal,
    Loader2,
    SortAsc,
    SortDesc,
    Calendar,
    DollarSign,
    X,
    RefreshCw
} from 'lucide-react'
import { useRestaurants } from '@/hooks/useRestaurantQueries'
import { useRestaurantOrders, useUpdateOrderStatus } from '@/hooks/useOrderQueries'
import { useOrderWebSocket } from '@/hooks/useWebSocket'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationToast } from '@/components/shared/NotificationToast'
import { OrderStatus } from '@/types/restaurant.types'
import { format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns'

const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    confirmed: { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    preparing: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    ready: { icon: CheckCircle, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    picked_up: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    out_for_delivery: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    delivered: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
    cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
}

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

type SortField = 'created_at' | 'total_amount' | 'order_number' | 'status'
type SortDirection = 'asc' | 'desc'

interface OrderFilters {
    status: OrderStatus | 'all'
    dateFrom: string
    dateTo: string
    minAmount: string
    maxAmount: string
    sortField: SortField
    sortDirection: SortDirection
}

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [filters, setFilters] = useState<OrderFilters>({
        status: 'all',
        dateFrom: '',
        dateTo: '',
        minAmount: '',
        maxAmount: '',
        sortField: 'created_at',
        sortDirection: 'desc'
    })

    // Fetch restaurants and get the first one
    const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants()
    const restaurantId = restaurants?.[0]?.id

    // Fetch orders
    const { data: orders, isLoading: loadingOrders, refetch: refetchOrders } = useRestaurantOrders(
        restaurantId || '',
        filters.status !== 'all' ? { status: filters.status } : {}
    )

    const updateOrderStatus = useUpdateOrderStatus()
    const { notifications, addNotification, removeNotification } = useNotifications()

    // WebSocket for real-time order updates
    const { isConnected: wsConnected, connectionStatus } = useOrderWebSocket(
        restaurantId || '',
        (updatedOrder) => {
            // Refetch orders when we receive an update
            refetchOrders()
            
            // Show notification for order updates
            addNotification({
                type: 'info',
                title: 'Order Updated',
                message: `Order #${updatedOrder.order_number} status changed to ${updatedOrder.status}`,
                duration: 4000
            })
        }
    )

    const isLoading = loadingRestaurants || loadingOrders

    // Filter and sort orders
    const filteredAndSortedOrders = useMemo(() => {
        if (!orders) return []
        
        let filtered = orders.filter(order => {
            // Search filter
            const matchesSearch = searchQuery === '' || 
                order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
            
            // Date range filter
            const orderDate = new Date(order.created_at)
            const matchesDateFrom = !filters.dateFrom || 
                isAfter(orderDate, startOfDay(new Date(filters.dateFrom))) ||
                orderDate.toDateString() === new Date(filters.dateFrom).toDateString()
            
            const matchesDateTo = !filters.dateTo || 
                isBefore(orderDate, endOfDay(new Date(filters.dateTo))) ||
                orderDate.toDateString() === new Date(filters.dateTo).toDateString()
            
            // Amount range filter
            const matchesMinAmount = !filters.minAmount || 
                order.total_amount >= (parseFloat(filters.minAmount) * 100)
            
            const matchesMaxAmount = !filters.maxAmount || 
                order.total_amount <= (parseFloat(filters.maxAmount) * 100)
            
            return matchesSearch && matchesDateFrom && matchesDateTo && 
                   matchesMinAmount && matchesMaxAmount
        })

        // Sort orders
        filtered.sort((a, b) => {
            let aValue: any, bValue: any
            
            switch (filters.sortField) {
                case 'created_at':
                    aValue = new Date(a.created_at).getTime()
                    bValue = new Date(b.created_at).getTime()
                    break
                case 'total_amount':
                    aValue = a.total_amount
                    bValue = b.total_amount
                    break
                case 'order_number':
                    aValue = a.order_number
                    bValue = b.order_number
                    break
                case 'status':
                    aValue = a.status
                    bValue = b.status
                    break
                default:
                    aValue = new Date(a.created_at).getTime()
                    bValue = new Date(b.created_at).getTime()
            }
            
            if (filters.sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })

        return filtered
    }, [orders, searchQuery, filters])

    const handleFilterChange = (key: keyof OrderFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const clearFilters = () => {
        setFilters({
            status: 'all',
            dateFrom: '',
            dateTo: '',
            minAmount: '',
            maxAmount: '',
            sortField: 'created_at',
            sortDirection: 'desc'
        })
        setSearchQuery('')
    }

    const hasActiveFilters = filters.status !== 'all' || filters.dateFrom || filters.dateTo || 
                           filters.minAmount || filters.maxAmount || searchQuery

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await updateOrderStatus.mutateAsync({
                orderId,
                data: { status: newStatus }
            })
            
            addNotification({
                type: 'success',
                title: 'Status Updated',
                message: `Order status changed to ${newStatus}`,
                duration: 3000
            })
        } catch (error: any) {
            console.error('Failed to update order status:', error)
            addNotification({
                type: 'error',
                title: 'Update Failed',
                message: error?.response?.data?.error || 'Failed to update order status',
                duration: 5000
            })
        }
    }

    const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
        const statusFlow: Record<OrderStatus, OrderStatus | null> = {
            pending: 'confirmed',
            confirmed: 'preparing',
            preparing: 'ready',
            ready: 'picked_up',
            picked_up: 'out_for_delivery',
            out_for_delivery: 'delivered',
            delivered: null,
            cancelled: null,
        }
        return statusFlow[currentStatus]
    }

    const getStatusActions = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return [
                    { label: 'Confirm', status: 'confirmed' as OrderStatus, color: 'bg-blue-500' },
                    { label: 'Cancel', status: 'cancelled' as OrderStatus, color: 'bg-red-500' }
                ]
            case 'confirmed':
                return [
                    { label: 'Start Preparing', status: 'preparing' as OrderStatus, color: 'bg-blue-500' },
                    { label: 'Cancel', status: 'cancelled' as OrderStatus, color: 'bg-red-500' }
                ]
            case 'preparing':
                return [
                    { label: 'Mark Ready', status: 'ready' as OrderStatus, color: 'bg-orange-500' }
                ]
            case 'ready':
                return [
                    { label: 'Mark Picked Up', status: 'picked_up' as OrderStatus, color: 'bg-purple-500' }
                ]
            default:
                return []
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    if (!restaurantId) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No restaurant found. Please create a restaurant first.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Order Management</h1>
                    <p className="text-gray-400">Track and manage your restaurant orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetchOrders()}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        title="Refresh orders"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {/* WebSocket Connection Status */}
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                            wsConnected ? 'bg-green-400' : 
                            connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <span className="text-xs text-gray-400">
                            {wsConnected ? 'Live' : 
                             connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                        </span>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                        {filteredAndSortedOrders.length} orders
                        {hasActiveFilters && ` (filtered from ${orders?.length || 0})`}
                    </div>
                </div>
            </div>

            {/* Search and Basic Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by order number or customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value as OrderStatus | 'all')}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-orange-500/50"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`px-3 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            showAdvancedFilters || hasActiveFilters
                                ? 'bg-orange-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        Advanced
                    </button>
                    
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-3 py-2.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Advanced Filters</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                From Date
                            </label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                To Date
                            </label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                            />
                        </div>

                        {/* Amount Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Min Amount (₵)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={filters.minAmount}
                                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Max Amount (₵)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={filters.maxAmount}
                                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                placeholder="1000.00"
                            />
                        </div>
                    </div>

                    {/* Sorting */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <h4 className="text-md font-medium text-white mb-4">Sort Options</h4>
                        <div className="flex items-center gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                                <select
                                    value={filters.sortField}
                                    onChange={(e) => handleFilterChange('sortField', e.target.value as SortField)}
                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50"
                                >
                                    <option value="created_at">Date Created</option>
                                    <option value="total_amount">Total Amount</option>
                                    <option value="order_number">Order Number</option>
                                    <option value="status">Status</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Direction</label>
                                <button
                                    onClick={() => handleFilterChange('sortDirection', 
                                        filters.sortDirection === 'asc' ? 'desc' : 'asc'
                                    )}
                                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                                >
                                    {filters.sortDirection === 'asc' ? (
                                        <SortAsc className="w-4 h-4" />
                                    ) : (
                                        <SortDesc className="w-4 h-4" />
                                    )}
                                    {filters.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Orders List */}
            {filteredAndSortedOrders.length === 0 ? (
                <div className="text-center py-12 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No orders found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAndSortedOrders.map((order) => {
                        const StatusIcon = statusConfig[order.status]?.icon || Clock
                        const statusColor = statusConfig[order.status]?.color || 'text-gray-400'
                        const statusBg = statusConfig[order.status]?.bg || 'bg-gray-500/20'
                        const actions = getStatusActions(order.status)

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg ${statusBg} flex items-center justify-center`}>
                                            <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">
                                                Order #{order.order_number}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {formatTimeAgo(order.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                                        </span>
                                        <button
                                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Customer</p>
                                        <p className="text-sm text-white">Customer {order.customer_id.slice(0, 8)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Total Amount</p>
                                        <p className="text-sm font-semibold text-white">{formatCurrency(order.total_amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Delivery Code</p>
                                        <p className="text-sm font-mono text-orange-400">{order.delivery_code}</p>
                                    </div>
                                </div>

                                {order.special_instructions && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 mb-1">Special Instructions</p>
                                        <p className="text-sm text-white bg-white/5 rounded-lg p-3">
                                            {order.special_instructions}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {actions.length > 0 && (
                                    <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                        {actions.map((action) => (
                                            <button
                                                key={action.status}
                                                onClick={() => handleStatusUpdate(order.id, action.status)}
                                                disabled={updateOrderStatus.isPending}
                                                className={`px-4 py-2 ${action.color} hover:opacity-80 text-white rounded-lg font-medium transition-opacity disabled:opacity-50 flex items-center gap-2`}
                                            >
                                                {updateOrderStatus.isPending && (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                )}
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            )}

            {/* Notification Toasts */}
            <NotificationToast 
                notifications={notifications} 
                onRemove={removeNotification} 
            />
        </div>
    )
}
