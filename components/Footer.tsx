'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export function Footer() {
    return (
        <footer className="py-16 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="col-span-1 md:col-span-2"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                QuickBite
                            </span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            The fastest food delivery service in your city. Order from your favorite restaurants and get your food delivered in under 30 minutes.
                        </p>
                        <div className="flex gap-4">
                            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                                <motion.button
                                    key={social}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                                >
                                    <span className="text-xs font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">{social[0]}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {[
                        {
                            title: 'Company',
                            links: ['About Us', 'Careers', 'Press', 'Blog']
                        },
                        {
                            title: 'Support',
                            links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service']
                        }
                    ].map((section, i) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <motion.a
                                            href="#"
                                            whileHover={{ x: 5 }}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <p className="text-gray-400 text-sm">
                        © 2025 QuickBite. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}