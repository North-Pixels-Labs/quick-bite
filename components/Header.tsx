'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X, ChevronDown, Store, Bike, User } from 'lucide-react'

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [loginDropdown, setLoginDropdown] = useState(false)
    const [registerDropdown, setRegisterDropdown] = useState(false)

    const userTypes = [
        { id: 'restaurant', label: 'Restaurant/Store', icon: Store },
        { id: 'rider', label: 'Rider', icon: Bike },
        { id: 'customer', label: 'Customer', icon: User }
    ]

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
                            {['Menu', 'About'].map((item, i) => (
                                <motion.a
                                    key={item}
                                    href={`/${item.toLowerCase()}`}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -2 }}
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    {item}
                                </motion.a>
                            ))}

                            {/* Login Dropdown */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => {
                                        setLoginDropdown(!loginDropdown)
                                        setRegisterDropdown(false)
                                    }}
                                    whileHover={{ y: -2 }}
                                    className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                                >
                                    Login <ChevronDown className="w-4 h-4" />
                                </motion.button>

                                <AnimatePresence>
                                    {loginDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full mt-2 right-0 w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
                                        >
                                            {userTypes.map((type) => (
                                                <motion.a
                                                    key={type.id}
                                                    href={`/login/${type.id}`}
                                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                                    className="w-full px-4 py-3 text-left flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                                                    onClick={() => setLoginDropdown(false)}
                                                >
                                                    <type.icon className="w-4 h-4" />
                                                    {type.label}
                                                </motion.a>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Register Dropdown */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => {
                                        setRegisterDropdown(!registerDropdown)
                                        setLoginDropdown(false)
                                    }}
                                    whileHover={{ y: -2 }}
                                    className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                                >
                                    Register <ChevronDown className="w-4 h-4" />
                                </motion.button>

                                <AnimatePresence>
                                    {registerDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full mt-2 right-0 w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
                                        >
                                            {userTypes.map((type) => (
                                                <motion.a
                                                    key={type.id}
                                                    href={`/register/${type.id}`}
                                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                                    className="w-full px-4 py-3 text-left flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                                                    onClick={() => setRegisterDropdown(false)}
                                                >
                                                    <type.icon className="w-4 h-4" />
                                                    {type.label}
                                                </motion.a>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.a
                                href="/order"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="hidden md:block px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-black hover:shadow-lg hover:shadow-yellow-500/25 transition-shadow"
                            >
                                Order Now
                            </motion.a>
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
                            {['Menu', 'About'].map((item) => (
                                <motion.a
                                    key={item}
                                    href={`/${item.toLowerCase()}`}
                                    whileTap={{ scale: 0.95 }}
                                    className="block py-2 text-lg text-gray-300"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item}
                                </motion.a>
                            ))}

                            {/* Mobile Login Section */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Login</h3>
                                {userTypes.map((type) => (
                                    <motion.a
                                        key={`login-${type.id}`}
                                        href={`/login/${type.id}`}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full text-left py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 text-gray-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <type.icon className="w-4 h-4" />
                                        {type.label}
                                    </motion.a>
                                ))}
                            </div>

                            {/* Mobile Register Section */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Register</h3>
                                {userTypes.map((type) => (
                                    <motion.a
                                        key={`register-${type.id}`}
                                        href={`/register/${type.id}`}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full text-left py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 text-gray-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <type.icon className="w-4 h-4" />
                                        {type.label}
                                    </motion.a>
                                ))}
                            </div>

                            <motion.a
                                href="/order"
                                whileTap={{ scale: 0.95 }}
                                className="w-full py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-black text-center block"
                            >
                                Order Now
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}