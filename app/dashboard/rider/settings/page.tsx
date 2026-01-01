'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, MapPin, Bike, Bell, Shield, Save, Loader2, Power, Wifi, WifiOff, CheckCircle, AlertTriangle, FileText } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRiderProfile, useUpdateRiderOnline, useUpdateRiderAvailability, useUpdateRiderLocation } from '@/hooks/useRiderQueries'
import { Skeleton } from '@/components/ui/skeleton'

type NotificationSettings = {
    newRequests: boolean
    deliveryUpdates: boolean
    earnings: boolean
    systemUpdates: boolean
}

export default function RiderSettingsPage() {
    const { user } = useAuth()
    const { data: riderProfile, isLoading: profileLoading } = useRiderProfile()
    const updateOnline = useUpdateRiderOnline()
    const updateAvailability = useUpdateRiderAvailability()
    const updateLocation = useUpdateRiderLocation()

    const [location, setLocation] = useState({
        latitude: riderProfile?.current_latitude || 5.6037,
        longitude: riderProfile?.current_longitude || -0.1870
    })

    const [notifications, setNotifications] = useState<NotificationSettings>({
        newRequests: true,
        deliveryUpdates: true,
        earnings: true,
        systemUpdates: false
    })

    const handleOnlineToggle = async () => {
        try {
            await updateOnline.mutateAsync(!riderProfile?.is_online)
        } catch (error) {
            console.error('Failed to update online status:', error)
        }
    }

    const handleAvailabilityToggle = async () => {
        try {
            await updateAvailability.mutateAsync(!riderProfile?.is_available)
        } catch (error) {
            console.error('Failed to update availability:', error)
        }
    }

    const handleLocationUpdate = async () => {
        try {
            await updateLocation.mutateAsync({
                latitude: location.latitude,
                longitude: location.longitude
            })
        } catch (error) {
            console.error('Failed to update location:', error)
        }
    }

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    })
                },
                (error) => {
                    console.error('Error getting location:', error)
                }
            )
        }
    }

    // Create skeleton loading layout
    const SettingsSkeleton = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400">Manage your account and preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Information Skeleton */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-12 mb-2" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-16 mb-2" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Status & Availability Skeleton */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-6 w-40" />
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-5 h-5 rounded" />
                                <div>
                                    <Skeleton className="h-5 w-24 mb-1" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>
                            <Skeleton className="w-11 h-6 rounded-full" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-5 h-5 rounded" />
                                <div>
                                    <Skeleton className="h-5 w-32 mb-1" />
                                    <Skeleton className="h-4 w-36" />
                                </div>
                            </div>
                            <Skeleton className="w-11 h-6 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Location Settings Skeleton */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Skeleton className="h-4 w-28 mb-2" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                        <div className="flex gap-3">
                            <Skeleton className="h-10 flex-1 rounded-lg" />
                            <Skeleton className="h-10 flex-1 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Notifications Skeleton */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div className="flex-1">
                                    <Skeleton className="h-5 w-32 mb-1" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <Skeleton className="w-11 h-6 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vehicle Information Skeleton */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-6 w-36" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Settings Skeleton */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div className="flex-1">
                                    <Skeleton className="h-5 w-40 mb-1" />
                                    <Skeleton className="h-4 w-56" />
                                </div>
                                <Skeleton className="h-9 w-20 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    if (profileLoading) {
        return <SettingsSkeleton />
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400">Manage your account and preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Profile Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                                {user?.first_name} {user?.last_name}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Contact support to update your name</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                                {user?.email}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                                {riderProfile?.phone || 'Not provided'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Account Status</label>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                    riderProfile?.verification_status === 'verified'
                                        ? 'bg-green-500'
                                        : riderProfile?.verification_status === 'pending'
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                }`}></div>
                                <span className="text-white capitalize">
                                    {riderProfile?.verification_status || 'Unverified'}
                                </span>
                            </div>
                            {riderProfile?.verification_status !== 'verified' && (
                                <p className="text-xs text-orange-400 mt-1">
                                    Complete document verification to start accepting deliveries
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Online Status & Availability */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <Power className="w-5 h-5 text-green-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Status & Availability</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                                {riderProfile?.is_online ? (
                                    <Wifi className="w-5 h-5 text-green-500" />
                                ) : (
                                    <WifiOff className="w-5 h-5 text-gray-500" />
                                )}
                                <div>
                                    <p className="text-white font-medium">Online Status</p>
                                    <p className="text-sm text-gray-400">
                                        {riderProfile?.is_online ? 'You can receive delivery requests' : 'You are offline'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleOnlineToggle}
                                disabled={updateOnline.isPending}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    riderProfile?.is_online ? 'bg-green-500' : 'bg-gray-600'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        riderProfile?.is_online ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Bike className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="text-white font-medium">Available for Deliveries</p>
                                    <p className="text-sm text-gray-400">
                                        {riderProfile?.is_available ? 'Accepting new delivery requests' : 'Not accepting requests'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleAvailabilityToggle}
                                disabled={updateAvailability.isPending || !riderProfile?.is_online}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    riderProfile?.is_available ? 'bg-blue-500' : 'bg-gray-600'
                                } ${!riderProfile?.is_online ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        riderProfile?.is_available ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        {!riderProfile?.is_online && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                <p className="text-yellow-400 text-sm">
                                    You must be online to receive delivery requests. Turn on your online status above.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Location Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-purple-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Location Settings</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Current Latitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                value={location.latitude}
                                onChange={(e) => setLocation(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Current Longitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                value={location.longitude}
                                onChange={(e) => setLocation(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={getCurrentLocation}
                                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                            >
                                Get Current Location
                            </button>
                            <button
                                onClick={handleLocationUpdate}
                                disabled={updateLocation.isPending}
                                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
                            >
                                {updateLocation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Update Location
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Notification Preferences */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5 text-orange-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div>
                                    <p className="text-white font-medium capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {key === 'newRequests' && 'Get notified when new delivery requests arrive'}
                                        {key === 'deliveryUpdates' && 'Updates on your active deliveries'}
                                        {key === 'earnings' && 'Daily earnings summaries and payouts'}
                                        {key === 'systemUpdates' && 'Platform updates and maintenance notices'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setNotifications(prev => ({ ...prev, [key as keyof NotificationSettings]: !prev[key as keyof NotificationSettings] }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        value ? 'bg-orange-500' : 'bg-gray-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            value ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Vehicle Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:col-span-2"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <Bike className="w-5 h-5 text-red-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Vehicle Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Vehicle Type</label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                                {riderProfile?.vehicle_type || 'Motorcycle'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">License Plate</label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                                {riderProfile?.license_plate || 'Not provided'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Vehicle Model</label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                                {riderProfile?.vehicle_model || 'Not provided'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Vehicle Color</label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                                {riderProfile?.vehicle_color || 'Not provided'}
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                        Vehicle information is managed through your verification documents. Contact support to update.
                    </p>
                </motion.div>

                {/* Account Verification */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            riderProfile?.verification_status === 'verified'
                                ? 'bg-green-500/20'
                                : riderProfile?.verification_status === 'pending'
                                ? 'bg-yellow-500/20'
                                : 'bg-red-500/20'
                        }`}>
                            {riderProfile?.verification_status === 'verified' ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : riderProfile?.verification_status === 'pending' ? (
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Account Verification</h2>
                            <p className="text-sm text-gray-400">
                                {riderProfile?.verification_status === 'verified'
                                    ? 'Your account is fully verified'
                                    : 'Complete verification to start accepting deliveries'
                                }
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {riderProfile?.verification_status === 'verified' ? (
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-white font-medium">Account Verified</p>
                                    <p className="text-sm text-gray-400">You can now accept delivery requests</p>
                                </div>
                            </div>
                        ) : riderProfile?.verification_status === 'pending' ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                    <div>
                                        <p className="text-white font-medium">Verification In Progress</p>
                                        <p className="text-sm text-gray-400">Your documents are being reviewed</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/rider/documents"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    View Documents
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="text-white font-medium">Verification Required</p>
                                        <p className="text-sm text-gray-400">Upload required documents to get verified</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/rider/documents"
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Upload Documents
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Security Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:col-span-2"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-gray-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Security & Privacy</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <p className="text-white font-medium">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                            </div>
                            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                                Enable
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <p className="text-white font-medium">Change Password</p>
                                <p className="text-sm text-gray-400">Update your account password</p>
                            </div>
                            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                                Change
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <p className="text-white font-medium">Data Export</p>
                                <p className="text-sm text-gray-400">Download your account data</p>
                            </div>
                            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                                Export
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
