'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <>
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/50 border-b border-white/10"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2"
                        >
                            
                            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                QuickBite
                            </span>
                        </motion.div>

                        <div className="hidden md:flex items-center gap-8">
                            {['Features', 'Restaurants', 'Pricing', 'About'].map((item, i) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -2 }}
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="hidden md:block px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-black hover:shadow-lg hover:shadow-yellow-500/25 transition-shadow"
                            >
                                Order Now
                            </motion.button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden"
                            >
                                {isMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-xl z-40 border-b border-white/10"
                    >
                        <div className="p-6 space-y-4">
                            {['Features', 'Restaurants', 'Pricing', 'About'].map((item) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    whileTap={{ scale: 0.95 }}
                                    className="block py-2 text-lg text-gray-300"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item}
                                </motion.a>
                            ))}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="w-full py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-black"
                            >
                                Get Started
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}