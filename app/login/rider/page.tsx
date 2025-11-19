'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bike, Zap } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ParticleCanvas } from '@/components/ParticleCanvas'
import { LoginForm } from '@/components/auth/LoginForm'

export default function RiderLogin() {
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
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-3xl blur-xl" />

                        <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            {/* Header Section */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl mb-4"
                                >
                                    <Bike className="w-8 h-8 text-blue-400" />
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl font-bold mb-2"
                                >
                                    Rider Login
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gray-400"
                                >
                                    Access your delivery dashboard
                                </motion.p>
                            </div>

                            {/* Login Form */}
                            <LoginForm userType="rider" />

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-400">
                                    Want to become a rider?{' '}
                                    <a
                                        href="/register/rider"
                                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Join our delivery team
                                    </a>
                                </p>
                            </div>

                            {/* Help Section */}
                            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">Rider Support</h3>
                                        <p className="text-xs text-gray-400">
                                            Need help with deliveries? Contact us at{' '}
                                            <a href="mailto:riders@quickbite.com" className="text-blue-400 hover:text-blue-300">
                                                riders@quickbite.com
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                                    <div className="text-lg font-bold text-blue-400">$25+</div>
                                    <div className="text-xs text-gray-400">Avg. per hour</div>
                                </div>
                                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                                    <div className="text-lg font-bold text-cyan-400">24/7</div>
                                    <div className="text-xs text-gray-400">Flexible hours</div>
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