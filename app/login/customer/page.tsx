'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { User, Zap, Clock, Star } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ParticleCanvas } from '@/components/ParticleCanvas'
import { LoginForm } from '@/components/auth/LoginForm'

export default function CustomerLogin() {
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
                            <LoginForm userType="customer" />

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