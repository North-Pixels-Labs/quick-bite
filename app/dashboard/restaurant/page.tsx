'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ShoppingBag, Users, DollarSign, Clock, ArrowUpRight } from 'lucide-react'

const stats = [
    {
        label: 'Total Revenue',
        value: '$12,450',
        change: '+12.5%',
        icon: DollarSign,
        color: 'from-green-500 to-emerald-500'
    },
    {
        label: 'Total Orders',
        value: '1,245',
        change: '+8.2%',
        icon: ShoppingBag,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        label: 'Active Customers',
        value: '342',
        change: '+5.1%',
        icon: Users,
        color: 'from-purple-500 to-pink-500'
    },
    {
        label: 'Avg. Prep Time',
        value: '18 min',
        change: '-2.3%',
        icon: Clock,
        color: 'from-orange-500 to-red-500'
    }
]

const recentOrders = [
    { id: '#2045', customer: 'Alice Johnson', items: '2x Pizza, 1x Coke', total: '$45.00', status: 'Preparing', time: '5 min ago' },
    { id: '#2044', customer: 'Bob Smith', items: '1x Burger, 1x Fries', total: '$22.50', status: 'Ready', time: '12 min ago' },
    { id: '#2043', customer: 'Charlie Brown', items: '3x Tacos', total: '$18.00', status: 'Delivered', time: '25 min ago' },
    { id: '#2042', customer: 'Diana Prince', items: '1x Salad', total: '$15.00', status: 'Delivered', time: '40 min ago' },
]

export default function DashboardOverview() {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-gray-400">Welcome back, here's what's happening today.</p>
                </div>
                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                    Download Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-[#1A1A1A] border border-white/5 rounded-2xl hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.change}
                                <ArrowUpRight className={`w-3 h-3 ${stat.change.startsWith('+') ? '' : 'rotate-90'}`} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders & Charts (Placeholder) */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-[#1A1A1A] border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                        <button className="text-sm text-orange-400 hover:text-orange-300">View All</button>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-sm font-bold text-gray-400">
                                        {order.customer.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{order.customer}</p>
                                        <p className="text-xs text-gray-500">{order.items}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white">{order.total}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Preparing' ? 'bg-blue-500/20 text-blue-400' :
                                            order.status === 'Ready' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-green-500/20 text-green-400'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions / Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 text-orange-500" />
                            </div>
                            <span className="text-sm font-medium text-white">Create New Order</span>
                        </button>
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-sm font-medium text-white">Add Staff Member</span>
                        </button>
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-purple-500" />
                            </div>
                            <span className="text-sm font-medium text-white">View Analytics</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
