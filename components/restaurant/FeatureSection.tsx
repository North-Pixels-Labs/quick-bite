'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Smartphone, BarChart3, Clock, ShieldCheck } from 'lucide-react'

const features = [
    {
        icon: <Smartphone className="w-6 h-6" />,
        title: "Easy Order Management",
        description: "Accept and manage orders seamlessly from any device. Get real-time notifications and track order status.",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Powerful Analytics",
        description: "Gain insights into your sales, popular items, and customer preferences to make data-driven decisions.",
        color: "from-purple-500 to-pink-500"
    },
    {
        icon: <Clock className="w-6 h-6" />,
        title: "Real-time Tracking",
        description: "Track your delivery fleet and keep customers updated with accurate delivery times.",
        color: "from-orange-500 to-red-500"
    },
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: "Secure Payments",
        description: "Get paid quickly and securely. We support mobile money, cards, and bank transfers.",
        color: "from-green-500 to-emerald-500"
    }
]

export const FeatureSection = () => {
    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl w-full mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-4"
                    >
                        Everything you need to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                            run your restaurant
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-2xl mx-auto"
                    >
                        Our platform provides a comprehensive suite of tools designed to help you manage operations, delight customers, and grow your business.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <div className="text-white">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
