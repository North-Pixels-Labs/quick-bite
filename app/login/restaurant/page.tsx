'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Store, Zap } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ParticleCanvas } from '@/components/ParticleCanvas'
import { LoginForm } from '@/components/auth/LoginForm'

export default function RestaurantLogin() {
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
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-600/10 rounded-3xl blur-xl" />

                        <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            {/* Header Section */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl mb-4"
                                >
                                    <Store className="w-8 h-8 text-orange-400" />
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl font-bold mb-2"
                                >
                                    Restaurant Login
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gray-400"
                                >
                                    Access your restaurant dashboard
                                </motion.p>
                            </div>

                            {/* Login Form */}
                            <LoginForm userType="restaurant" />

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-400">
                                    Don't have an account?{' '}
                                    <a
                                        href="/register/restaurant"
                                        className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                                    >
                                        Register your restaurant
                                    </a>
                                </p>
                            </div>

                            {/* Help Section */}
                            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">Need Help?</h3>
                                        <p className="text-xs text-gray-400">
                                            Contact our restaurant support team at{' '}
                                            <a href="mailto:restaurants@quickbite.com" className="text-orange-400 hover:text-orange-300">
                                                restaurants@quickbite.com
                                            </a>
                                        </p>
                                    </div>
                                </div>
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