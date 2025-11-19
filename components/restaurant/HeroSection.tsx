'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChefHat, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

export const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-sm font-medium text-orange-300">Partner with QuickBite</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                        Grow Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                            Restaurant Business
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-8 max-w-xl">
                        Join thousands of restaurants that trust QuickBite to reach more customers, streamline operations, and boost revenue.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/register/restaurant">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-white shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                            >
                                Get Started <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                        <Link href="/login/restaurant">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white hover:bg-white/10 transition-colors"
                            >
                                Login to Dashboard
                            </motion.button>
                        </Link>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">500+</h3>
                            <p className="text-sm text-gray-500">Restaurant Partners</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">30%</h3>
                            <p className="text-sm text-gray-500">Average Revenue Increase</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">24/7</h3>
                            <p className="text-sm text-gray-500">Support for Partners</p>
                        </div>
                    </div>
                </motion.div>

                {/* Visual Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative hidden lg:block"
                >
                    <div className="relative z-10 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        {/* Mock Dashboard UI */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                    <ChefHat className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Tasty Bites</h4>
                                    <p className="text-xs text-gray-500">Dashboard Overview</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                    <span className="text-xs text-gray-400">Today's Revenue</span>
                                </div>
                                <p className="text-2xl font-bold text-white">$1,245.00</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs text-gray-400">Active Orders</span>
                                </div>
                                <p className="text-2xl font-bold text-white">12</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-700 rounded-full" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Order #{2045 + i}</p>
                                            <p className="text-xs text-gray-500">2 items • $45.00</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                                        Preparing
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-500 rounded-2xl rotate-12 opacity-20 blur-xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500 rounded-full opacity-20 blur-xl" />
                </motion.div>
            </div>
        </section>
    )
}
