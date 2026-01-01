'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bell, Clock, Check, X, Filter, Loader2, AlertCircle, Package, Star } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCustomerNotifications } from '@/hooks/useCustomerQueries'
import { format } from 'date-fns'

const getNotificationIcon = (type: string) => {
    switch (type?.toLowerCase()) {
        case 'order':
            return Package
        case 'review':
            return Star
        case 'promotion':
            return AlertCircle
        default:
            return Bell
    }
}

const getNotificationColor = (type: string) => {
    switch (type?.toLowerCase()) {
        case 'order':
            return 'text-blue-400'
        case 'review':
            return 'text-yellow-400'
        case 'promotion':
            return 'text-green-400'
        default:
            return 'text-gray-400'
    }
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

export default function CustomerNotificationsPage() {
    const { user } = useAuth()
    const { data: notifications, isLoading } = useCustomerNotifications()
    const [filter, setFilter] = useState('all')

    const filteredNotifications = useMemo(() => {
        if (!notifications) return []

        return notifications.filter((notification: any) => {
            if (filter === 'all') return true
            if (filter === 'unread') return !notification.read
            if (filter === 'read') return notification.read
            return notification.type?.toLowerCase() === filter
        })
    }, [notifications, filter])

    const unreadCount = useMemo(() => {
        return notifications?.filter((n: any) => !n.read)?.length || 0
    }, [notifications])

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
                    <h1 className="text-2xl font-bold text-white">Notifications</h1>
                    <p className="text-gray-400">{getGreeting()}, {getUserName()}! Stay updated with your latest activity.</p>
                </div>
                {unreadCount > 0 && (
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                        {unreadCount} unread
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {[
                    { value: 'all', label: 'All' },
                    { value: 'unread', label: 'Unread' },
                    { value: 'read', label: 'Read' },
                    { value: 'order', label: 'Orders' },
                    { value: 'promotion', label: 'Promotions' },
                    { value: 'review', label: 'Reviews' },
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === option.value
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length > 0 ? filteredNotifications.map((notification: any, index: number) => {
                    const IconComponent = getNotificationIcon(notification.type)

                    return (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-black/40 backdrop-blur-xl border rounded-2xl p-6 transition-colors ${
                                notification.read
                                    ? 'border-white/5 opacity-75'
                                    : 'border-emerald-500/30 bg-emerald-500/5'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    notification.read
                                        ? 'bg-gray-500/20 text-gray-400'
                                        : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                    <IconComponent className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                {notification.title || 'Notification'}
                                            </h3>
                                            <p className="text-gray-300 mb-3">
                                                {notification.message || 'You have a new notification'}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatTimeAgo(notification.created_at)}
                                                </span>
                                                {notification.type && (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)} bg-current/10`}>
                                                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {!notification.read && (
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                            )}
                                            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {notification.action_url && (
                                        <div className="mt-4 flex gap-2">
                                            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium">
                                                {notification.action_text || 'View Details'}
                                            </button>
                                            {!notification.read && (
                                                <button className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm">
                                                    Mark as Read
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                }) : (
                    <div className="text-center py-12">
                        <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">
                            {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
                        </h3>
                        <p className="text-gray-400 mb-4">
                            {filter === 'all'
                                ? 'You\'ll receive notifications about your orders, promotions, and more'
                                : `You don't have any ${filter} notifications at the moment`
                            }
                        </p>
                        {filter !== 'all' && (
                            <button
                                onClick={() => setFilter('all')}
                                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                            >
                                View All Notifications
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Notification Stats */}
            {notifications && notifications.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-4"
                >
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 text-center">
                        <h4 className="text-2xl font-bold text-white">{notifications.length}</h4>
                        <p className="text-sm text-gray-400">Total</p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 text-center">
                        <h4 className="text-2xl font-bold text-emerald-400">{unreadCount}</h4>
                        <p className="text-sm text-gray-400">Unread</p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 text-center">
                        <h4 className="text-2xl font-bold text-blue-400">
                            {notifications.filter((n: any) => n.type === 'order').length}
                        </h4>
                        <p className="text-sm text-gray-400">Orders</p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 text-center">
                        <h4 className="text-2xl font-bold text-green-400">
                            {notifications.filter((n: any) => n.type === 'promotion').length}
                        </h4>
                        <p className="text-sm text-gray-400">Promotions</p>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
