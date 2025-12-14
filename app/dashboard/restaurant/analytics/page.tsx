'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    ShoppingBag, 
    Users, 
    Clock,
    Calendar,
    BarChart3,
    Loader2,
    LineChart,
    PieChart
} from 'lucide-react'
import { 
    ResponsiveContainer, 
    LineChart as RechartsLineChart, 
    AreaChart, 
    BarChart as RechartsBarChart,
    PieChart as RechartsPieChart,
    Area, 
    Bar, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend,
    Cell,
    Pie
} from 'recharts'
import { useRestaurants } from '@/hooks/useRestaurantQueries'
import { useDailyAnalytics, useWeeklyAnalytics, useMonthlyAnalytics } from '@/hooks/useAnalyticsQueries'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount / 100)
}

// Chart colors
const CHART_COLORS = {
    primary: '#f97316', // orange-500
    secondary: '#06b6d4', // cyan-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
    purple: '#8b5cf6', // violet-500
    pink: '#ec4899', // pink-500
    indigo: '#6366f1', // indigo-500
}

const PIE_COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.purple,
    CHART_COLORS.pink,
    CHART_COLORS.indigo,
    CHART_COLORS.danger,
]

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-lg">
                <p className="text-white font-medium mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.name.includes('Revenue') || entry.name.includes('Value') 
                            ? formatCurrency(entry.value) 
                            : entry.value}
                    </p>
                ))}
            </div>
        )
    }
    return null
}

const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color,
    isLoading = false 
}: {
    title: string
    value: string
    change?: string
    icon: any
    color: string
    isLoading?: boolean
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            {change && (
                <div className={`flex items-center gap-1 text-sm font-medium ${
                    change.startsWith('+') ? 'text-green-400' : change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                }`}>
                    {change.startsWith('+') ? (
                        <TrendingUp className="w-4 h-4" />
                    ) : change.startsWith('-') ? (
                        <TrendingDown className="w-4 h-4" />
                    ) : null}
                    {change}
                </div>
            )}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-white mb-1">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : value}
            </h3>
            <p className="text-sm text-gray-400">{title}</p>
        </div>
    </motion.div>
)

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily')
    const [dateRange, setDateRange] = useState(() => {
        const today = new Date()
        return {
            start: format(subDays(today, 7), 'yyyy-MM-dd'),
            end: format(today, 'yyyy-MM-dd')
        }
    })

    // Fetch restaurants and get the first one
    const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants()
    const restaurantId = restaurants?.[0]?.id

    // Fetch analytics data based on time range
    const { data: dailyData, isLoading: loadingDaily } = useDailyAnalytics(
        restaurantId || '',
        timeRange === 'daily' ? { start_date: dateRange.start, end_date: dateRange.end } : undefined
    )

    const { data: weeklyData, isLoading: loadingWeekly } = useWeeklyAnalytics(
        restaurantId || '',
        timeRange === 'weekly' ? { start_date: dateRange.start, end_date: dateRange.end } : undefined
    )

    const { data: monthlyData, isLoading: loadingMonthly } = useMonthlyAnalytics(
        restaurantId || '',
        timeRange === 'monthly' ? { 
            year: new Date().getFullYear(), 
            month: new Date().getMonth() + 1 
        } : undefined
    )

    const isLoading = loadingRestaurants || loadingDaily || loadingWeekly || loadingMonthly

    // Get current data based on selected time range
    const currentData = useMemo(() => {
        switch (timeRange) {
            case 'daily':
                return dailyData
            case 'weekly':
                return weeklyData
            case 'monthly':
                return monthlyData
            default:
                return dailyData
        }
    }, [timeRange, dailyData, weeklyData, monthlyData])

    // Calculate summary stats
    const summaryStats = useMemo(() => {
        if (!currentData?.length) {
            return {
                totalRevenue: 0,
                totalOrders: 0,
                avgOrderValue: 0,
                avgDeliveryTime: 0,
                cancellationRate: 0
            }
        }

        const totals = currentData.reduce((acc, item) => ({
            revenue: acc.revenue + item.total_revenue,
            orders: acc.orders + item.total_orders,
            deliveryTime: acc.deliveryTime + item.average_delivery_time,
            cancellationRate: acc.cancellationRate + item.cancellation_rate
        }), { revenue: 0, orders: 0, deliveryTime: 0, cancellationRate: 0 })

        return {
            totalRevenue: totals.revenue,
            totalOrders: totals.orders,
            avgOrderValue: totals.orders > 0 ? totals.revenue / totals.orders : 0,
            avgDeliveryTime: totals.deliveryTime / currentData.length,
            cancellationRate: totals.cancellationRate / currentData.length
        }
    }, [currentData])

    // Prepare chart data
    const chartData = useMemo(() => {
        if (!currentData?.length) return []
        
        return currentData.map(item => ({
            date: format(new Date(item.date), 'MMM d'),
            fullDate: item.date,
            revenue: item.total_revenue / 100, // Convert to cedis for display
            orders: item.total_orders,
            avgOrderValue: item.average_order_value / 100,
            deliveryTime: Math.round(item.average_delivery_time),
            cancellationRate: item.cancellation_rate
        })).sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
    }, [currentData])

    // Order status distribution (mock data for pie chart)
    const orderStatusData = useMemo(() => [
        { name: 'Delivered', value: 65, color: CHART_COLORS.success },
        { name: 'Preparing', value: 20, color: CHART_COLORS.warning },
        { name: 'Pending', value: 10, color: CHART_COLORS.secondary },
        { name: 'Cancelled', value: 5, color: CHART_COLORS.danger },
    ], [])

    // Performance metrics over time
    const performanceData = useMemo(() => {
        if (!currentData?.length) return []
        
        return currentData.map(item => ({
            date: format(new Date(item.date), 'MMM d'),
            successRate: 100 - item.cancellation_rate,
            deliveryTime: Math.round(item.average_delivery_time),
            customerSatisfaction: Math.random() * 20 + 80 // Mock data
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }, [currentData])

    if (loadingRestaurants) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    if (!restaurantId) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No restaurant found. Please create a restaurant first.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                    <p className="text-gray-400">Track your restaurant's performance and insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as 'daily' | 'weekly' | 'monthly')}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50"
                    />
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(summaryStats.totalRevenue)}
                    change="+12.5%"
                    icon={DollarSign}
                    color="from-green-500 to-emerald-500"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Total Orders"
                    value={summaryStats.totalOrders.toString()}
                    change="+8.2%"
                    icon={ShoppingBag}
                    color="from-blue-500 to-cyan-500"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Avg. Order Value"
                    value={formatCurrency(summaryStats.avgOrderValue)}
                    change="+5.1%"
                    icon={TrendingUp}
                    color="from-purple-500 to-pink-500"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Avg. Delivery Time"
                    value={`${Math.round(summaryStats.avgDeliveryTime)} min`}
                    change="-2.3%"
                    icon={Clock}
                    color="from-orange-500 to-red-500"
                    isLoading={isLoading}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue & Orders Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Revenue & Orders Trend</h2>
                        <LineChart className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="h-64">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="#9CA3AF" 
                                        fontSize={12}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        yAxisId="revenue"
                                        orientation="left"
                                        stroke="#9CA3AF" 
                                        fontSize={12}
                                        tickLine={false}
                                        tickFormatter={(value) => `₵${value}`}
                                    />
                                    <YAxis 
                                        yAxisId="orders"
                                        orientation="right"
                                        stroke="#9CA3AF" 
                                        fontSize={12}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Area
                                        yAxisId="revenue"
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke={CHART_COLORS.primary}
                                        fillOpacity={1}
                                        fill="url(#revenueGradient)"
                                        strokeWidth={2}
                                        name="Revenue (₵)"
                                    />
                                    <Line
                                        yAxisId="orders"
                                        type="monotone"
                                        dataKey="orders"
                                        stroke={CHART_COLORS.secondary}
                                        strokeWidth={2}
                                        dot={{ fill: CHART_COLORS.secondary, strokeWidth: 2, r: 4 }}
                                        name="Orders"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-400">No data available</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Select a date range to view analytics
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Order Status Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Order Status Distribution</h2>
                        <PieChart className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload
                                            return (
                                                <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-lg">
                                                    <p className="text-white font-medium">{data.name}</p>
                                                    <p className="text-sm" style={{ color: data.color }}>
                                                        {data.value}% of orders
                                                    </p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36}
                                    formatter={(value, entry) => (
                                        <span style={{ color: entry.color }}>{value}</span>
                                    )}
                                />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Performance Metrics Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">Performance Metrics</h2>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-80">
                    {performanceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#9CA3AF" 
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <YAxis 
                                    stroke="#9CA3AF" 
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar 
                                    dataKey="successRate" 
                                    fill={CHART_COLORS.success} 
                                    name="Success Rate (%)"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar 
                                    dataKey="deliveryTime" 
                                    fill={CHART_COLORS.warning} 
                                    name="Avg Delivery Time (min)"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar 
                                    dataKey="customerSatisfaction" 
                                    fill={CHART_COLORS.purple} 
                                    name="Customer Satisfaction (%)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-400">No performance data available</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
            >
                <h2 className="text-lg font-semibold text-white mb-6">Performance Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                            {(100 - summaryStats.cancellationRate).toFixed(1)}%
                        </h3>
                        <p className="text-sm text-gray-400">Order Success Rate</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                            {Math.round(summaryStats.avgDeliveryTime)}
                        </h3>
                        <p className="text-sm text-gray-400">Avg. Delivery Time (min)</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <DollarSign className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                            {formatCurrency(summaryStats.avgOrderValue)}
                        </h3>
                        <p className="text-sm text-gray-400">Avg. Order Value</p>
                    </div>
                </div>
            </motion.div>

            {/* Data Table */}
            {currentData && currentData.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
                >
                    <h2 className="text-lg font-semibold text-white mb-6">Detailed Data</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Orders</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Revenue</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Avg. Order</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Delivery Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-3 px-4 text-white">
                                            {format(new Date(item.date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="py-3 px-4 text-white">{item.total_orders}</td>
                                        <td className="py-3 px-4 text-white">{formatCurrency(item.total_revenue)}</td>
                                        <td className="py-3 px-4 text-white">{formatCurrency(item.average_order_value)}</td>
                                        <td className="py-3 px-4 text-white">{Math.round(item.average_delivery_time)} min</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    )
}