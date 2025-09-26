'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Clock, Star } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ParticleCanvas } from '@/components/ParticleCanvas'

export default function CustomerLogin() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle login logic here
        console.log('Customer login:', formData)
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated Background */}
            <ParticleCanvas />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="pt-24 pb-16 px-6 min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        {/* Background Card */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl blur-xl" />

                        <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            {/* Header Section */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-4"
                                >
                                    <User className="w-8 h-8 text-purple-400" />
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl font-bold mb-2"
                                >
                                    Welcome Back
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gray-400"
                                >
                                    Sign in to order your favorite food
                                </motion.p>
                            </div>

                            {/* Login Form */}
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-white placeholder-gray-500"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-300">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-white placeholder-gray-500"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/20"
                                        />
                                        <span className="text-sm text-gray-300">Remember me</span>
                                    </label>
                                    <a
                                        href="/forgot-password"
                                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                {/* Login Button */}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                                >
                                    Sign In <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </motion.form>

                            {/* Divider */}
                            <div className="my-8 flex items-center">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="px-4 text-sm text-gray-400">or</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* Social Login */}
                            <div className="space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl font-medium text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                                >
                                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                                        <span className="text-xs font-bold text-black">G</span>
                                    </div>
                                    Continue with Google
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl font-medium text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                                >
                                    <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">f</span>
                                    </div>
                                    Continue with Facebook
                                </motion.button>
                            </div>

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-400">
                                    New to QuickBite?{' '}
                                    <a
                                        href="/register/customer"
                                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                                    >
                                        Create an account
                                    </a>
                                </p>
                            </div>

                            {/* Benefits Section */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                                <div className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">Welcome Offer!</h3>
                                        <p className="text-xs text-gray-400">
                                            Get 20% off your first order when you sign in today
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Features */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                                    <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                                    <div className="text-xs font-medium text-white">30 Min</div>
                                    <div className="text-xs text-gray-400">Delivery</div>
                                </div>
                                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                                    <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                    <div className="text-xs font-medium text-white">4.9★</div>
                                    <div className="text-xs text-gray-400">Rating</div>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-400">
                                    Need help?{' '}
                                    <a href="mailto:support@quickbite.com" className="text-purple-400 hover:text-purple-300">
                                        Contact Support
                                    </a>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}