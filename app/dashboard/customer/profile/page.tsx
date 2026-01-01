'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Edit, Save, X, Camera, Loader2, Shield, Bell, CreditCard } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function CustomerProfilePage() {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: {
            street: '',
            city: '',
            country: 'Ghana'
        }
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

    const getInitials = () => {
        if (!user) return 'U'
        const firstInitial = user.first_name?.[0] || ''
        const lastInitial = user.last_name?.[0] || ''
        return (firstInitial + lastInitial).toUpperCase() || 'U'
    }

    const handleSave = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setFormData({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: {
                street: '',
                city: '',
                country: 'Ghana'
            }
        })
        setIsEditing(false)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                    <p className="text-gray-400">{getGreeting()}, {getUserName()}! Manage your account information.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 text-center">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">{getInitials()}</span>
                            </div>
                            <button className="absolute bottom-2 right-1/2 transform translate-x-12 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-1">
                            {user?.first_name} {user?.last_name}
                        </h2>
                        <p className="text-gray-400 mb-4">{user?.email}</p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                <Shield className="w-4 h-4" />
                                <span>Customer Account</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                <Bell className="w-4 h-4" />
                                <span>Notifications Enabled</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                <CreditCard className="w-4 h-4" />
                                <span>Payment Method Added</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Profile Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Personal Information</h3>

                        <div className="space-y-6">
                            {/* Name Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
                                        />
                                    ) : (
                                        <div className="px-3 py-2 bg-white/5 border border-white/5 rounded-lg text-gray-300">
                                            {user?.first_name || 'Not provided'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
                                        />
                                    ) : (
                                        <div className="px-3 py-2 bg-white/5 border border-white/5 rounded-lg text-gray-300">
                                            {user?.last_name || 'Not provided'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                {isEditing ? (
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <div className="pl-10 pr-3 py-2 bg-white/5 border border-white/5 rounded-lg text-gray-300">
                                            {user?.email}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                {isEditing ? (
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
                                            placeholder="+233 XX XXX XXXX"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <div className="pl-10 pr-3 py-2 bg-white/5 border border-white/5 rounded-lg text-gray-300">
                                            {user?.phone || 'Not provided'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Address</label>
                                {isEditing ? (
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                        <textarea
                                            value={formData.address.street}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                address: {...formData.address, street: e.target.value}
                                            })}
                                            className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none transition-colors resize-none"
                                            rows={3}
                                            placeholder="Enter your delivery address"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                        <div className="pl-10 pr-3 py-2 bg-white/5 border border-white/5 rounded-lg text-gray-300 min-h-[60px] flex items-center">
                                            Default delivery address not set
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Account Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
            >
                <h3 className="text-lg font-bold text-white mb-6">Account Settings</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-emerald-400" />
                            <div>
                                <h4 className="text-white font-medium">Push Notifications</h4>
                                <p className="text-sm text-gray-400">Receive notifications about your orders</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <div>
                                <h4 className="text-white font-medium">Email Notifications</h4>
                                <p className="text-sm text-gray-400">Receive order updates via email</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-purple-400" />
                            <div>
                                <h4 className="text-white font-medium">Payment Methods</h4>
                                <p className="text-sm text-gray-400">Manage your saved payment methods</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm">
                            Manage
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
