'use client'

import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, Users, Target, Heart, Award, Clock, Shield, Sparkles, ArrowRight, MapPin, Star, TrendingUp } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ParticleCanvas } from '@/components/ParticleCanvas'

export default function About() {
    const [activeValue, setActiveValue] = useState(0)
    const statsRef = useRef(null)
    const isStatsInView = useInView(statsRef, { once: true })

    const values = [
        {
            icon: Zap,
            title: 'Speed & Efficiency',
            description: 'We deliver your favorite meals in under 30 minutes, ensuring hot and fresh food every time.',
            color: 'from-yellow-400 to-orange-500'
        },
        {
            icon: Heart,
            title: 'Customer First',
            description: 'Every decision we make is centered around creating the best possible experience for our customers.',
            color: 'from-pink-400 to-red-500'
        },
        {
            icon: Shield,
            title: 'Trust & Safety',
            description: 'We maintain the highest standards of food safety and secure transactions for peace of mind.',
            color: 'from-blue-400 to-cyan-500'
        },
        {
            icon: Users,
            title: 'Community Impact',
            description: 'Supporting local restaurants and providing flexible earning opportunities for our riders.',
            color: 'from-purple-400 to-pink-500'
        }
    ]

    const team = [
        {
            name: 'Sarah Chen',
            role: 'CEO & Co-Founder',
            image: '👩‍💼',
            bio: 'Former tech executive with 15+ years in logistics and marketplace platforms.'
        },
        {
            name: 'Marcus Rodriguez',
            role: 'CTO & Co-Founder',
            image: '👨‍💻',
            bio: 'Engineering leader who built scalable systems at major food delivery companies.'
        },
        {
            name: 'Aisha Patel',
            role: 'Head of Operations',
            image: '👩‍🔬',
            bio: 'Operations expert focused on optimizing delivery routes and restaurant partnerships.'
        },
        {
            name: 'David Kim',
            role: 'Head of Design',
            image: '👨‍🎨',
            bio: 'Design visionary creating intuitive experiences that delight users across all platforms.'
        }
    ]

    const milestones = [
        { year: '2020', title: 'Founded', description: 'QuickBite was born from a simple idea: make food delivery faster and more reliable.' },
        { year: '2021', title: 'First 1000 Orders', description: 'Reached our first major milestone with overwhelming community support.' },
        { year: '2022', title: 'Multi-City Launch', description: 'Expanded to 5 major cities, partnering with 500+ restaurants.' },
        { year: '2023', title: '1M+ Deliveries', description: 'Celebrated our millionth delivery and 50,000+ happy customers.' },
        { year: '2024', title: 'AI-Powered Logistics', description: 'Launched smart routing system, reducing delivery times by 40%.' }
    ]

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated Background */}
            <ParticleCanvas />

            {/* Header */}
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/50 mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-yellow-300">Our Story</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                        >
                            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                                Revolutionizing
                            </span>
                            <br />
                            <span className="text-white">Food Delivery</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
                        >
                            We're on a mission to connect communities through food, delivering not just meals but moments of joy,
                            one order at a time. Founded in 2020, QuickBite has grown from a simple idea to a platform that serves
                            thousands of customers daily.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section ref={statsRef} className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isStatsInView ? { opacity: 1 } : { opacity: 0 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {[
                            { value: '1M+', label: 'Deliveries Completed', icon: TrendingUp },
                            { value: '50K+', label: 'Happy Customers', icon: Users },
                            { value: '2.5K+', label: 'Restaurant Partners', icon: MapPin },
                            { value: '4.9', label: 'Average Rating', icon: Star }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10"
                            >
                                <stat.icon className="w-8 h-8 mx-auto mb-4 text-yellow-400" />
                                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Our Mission
                                </span>
                            </h2>
                            <p className="text-lg text-gray-300 mb-6">
                                To make delicious food accessible to everyone, everywhere, while supporting local businesses
                                and creating opportunities for our community of riders.
                            </p>
                            <p className="text-gray-400 mb-8">
                                We believe that great food brings people together, and technology should make those connections
                                easier, faster, and more meaningful. Every order placed through QuickBite supports local restaurants,
                                provides income for our riders, and brings joy to our customers.
                            </p>
                            <motion.a
                                href="/order"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                            >
                                Start Ordering <ArrowRight className="w-4 h-4" />
                            </motion.a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl" />
                            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10">
                                <Target className="w-12 h-12 text-purple-400 mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Vision 2025</h3>
                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                        Expand to 50+ cities nationwide
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-pink-400 rounded-full" />
                                        Partner with 10,000+ local restaurants
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                                        Achieve carbon-neutral deliveries
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                        Launch grocery delivery service
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                Our Values
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg">The principles that guide everything we do</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                onHoverStart={() => setActiveValue(i)}
                                className="relative group cursor-pointer"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl blur-xl`} />
                                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 h-full">
                                    <value.icon className="w-12 h-12 mb-6 text-white/80" />
                                    <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                                    <p className="text-gray-400">{value.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                Our Journey
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg">Key milestones in our growth story</p>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 to-emerald-400" />

                        {milestones.map((milestone, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative flex items-start gap-8 mb-12"
                            >
                                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center font-bold text-sm">
                                    {milestone.year}
                                </div>
                                <div className="flex-1 pt-2">
                                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                                    <p className="text-gray-400">{milestone.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                Meet Our Team
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg">The passionate people behind QuickBite</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="text-center"
                            >
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl blur-xl" />
                                    <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center text-4xl border border-white/10">
                                        {member.image}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                <p className="text-orange-400 font-medium mb-3">{member.role}</p>
                                <p className="text-sm text-gray-400">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl blur-3xl opacity-20" />
                    <div className="relative p-12 rounded-3xl bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border border-white/10 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                Join Our Story
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Whether you're a customer, restaurant partner, or rider, you're part of the QuickBite family.
                            Let's build the future of food delivery together.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.a
                                href="/order"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-black text-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all"
                            >
                                Order Now
                            </motion.a>
                            <motion.a
                                href="/register/restaurant"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 font-semibold text-lg hover:bg-white/20 transition-all"
                            >
                                Partner With Us
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    )
}