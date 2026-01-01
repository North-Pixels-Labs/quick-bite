'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    ShoppingBag,
    UtensilsCrossed,
    Users,
    Settings,
    LogOut,
    ChefHat,
    Menu,
    X,
    Search,
    Bell,
    BarChart3
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSidebar } from '@/context/SidebarContext'
import { Bike, MapPin, FileText, Package } from 'lucide-react'

export const Sidebar = () => {
    const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()

    // Dynamic menu items based on user type
    const getMenuItems = () => {
        const userType = user?.user_type

        if (userType === 'rider') {
            return [
                {
                    icon: LayoutDashboard,
                    label: 'Overview',
                    href: '/dashboard/rider',
                    color: 'text-cyan-400',
                    bgColor: 'bg-cyan-400/10'
                },
                {
                    icon: Package,
                    label: 'Deliveries',
                    href: '/dashboard/rider/deliveries',
                    color: 'text-green-400',
                    bgColor: 'bg-green-400/10'
                },
                {
                    icon: MapPin,
                    label: 'Requests',
                    href: '/dashboard/rider/requests',
                    color: 'text-orange-400',
                    bgColor: 'bg-orange-400/10'
                },
                {
                    icon: FileText,
                    label: 'Documents',
                    href: '/dashboard/rider/documents',
                    color: 'text-blue-400',
                    bgColor: 'bg-blue-400/10'
                },
                {
                    icon: Settings,
                    label: 'Settings',
                    href: '/dashboard/rider/settings',
                    color: 'text-gray-400',
                    bgColor: 'bg-gray-400/10'
                },
            ]
        }

        // Default to restaurant menu
        return [
            {
                icon: LayoutDashboard,
                label: 'Overview',
                href: '/dashboard/restaurant',
                color: 'text-cyan-400',
                bgColor: 'bg-cyan-400/10'
            },
            {
                icon: ShoppingBag,
                label: 'Orders',
                href: '/dashboard/restaurant/orders',
                color: 'text-green-400',
                bgColor: 'bg-green-400/10'
            },
            {
                icon: UtensilsCrossed,
                label: 'Menu',
                href: '/dashboard/restaurant/menu',
                color: 'text-orange-400',
                bgColor: 'bg-orange-400/10'
            },
            {
                icon: BarChart3,
                label: 'Analytics',
                href: '/dashboard/restaurant/analytics',
                color: 'text-blue-400',
                bgColor: 'bg-blue-400/10'
            },
            {
                icon: Users,
                label: 'Staff',
                href: '/dashboard/restaurant/staff',
                color: 'text-purple-400',
                bgColor: 'bg-purple-400/10'
            },
            {
                icon: Settings,
                label: 'Settings',
                href: '/dashboard/restaurant/settings',
                color: 'text-gray-400',
                bgColor: 'bg-gray-400/10'
            },
        ]
    }

    const menuItems = getMenuItems()

    const handleLogout = async () => {
        await logout()
        router.push('/')
    }

    // Get user initials
    const getInitials = () => {
        if (!user) return 'U'
        const firstInitial = user.first_name?.[0] || ''
        const lastInitial = user.last_name?.[0] || ''
        return (firstInitial + lastInitial).toUpperCase() || 'U'
    }

    // Get display name
    const getDisplayName = () => {
        if (!user) return 'User'
        if (user.first_name && user.last_name) {
            return `${user.first_name} ${user.last_name}`
        }
        return user.first_name || user.email || 'User'
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="fixed top-3 left-4 z-50 md:hidden p-2 rounded-lgbg-transparent text-white shadow-lg"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? 64 : 256
                }}
                className="hidden md:flex flex-col h-screen bg-black/20 backdrop-blur-xl border-r border-white/10 fixed left-0 top-0 z-50"
                style={{ width: isCollapsed ? '64px' : '256px' }}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center space-x-3"
                                >
                                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
                                        <ChefHat className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-bold text-lg">QuickBite</h2>
                                        <p className="text-gray-400 text-sm truncate">
                                            {user?.user_type === 'rider' ? 'Rider Portal' : 'Restaurant Portal'}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            <button
                                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4"
                            >
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:border-orange-500/50 focus:outline-none transition-colors"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={item.href}>
                                        <div
                                            className={`flex items-center 
                                                ${!isCollapsed ? `space-x-3 p-3` : `space-x-2 p-2`}
                                                rounded-xl transition-all duration-300 group ${
                                                isActive
                                                    ? `${item.bgColor} ${item.color} shadow-lg`
                                                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            <Icon className={`h-5 w-5 ${isActive ? item.color : ""}`} />
                                            {!isCollapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="font-medium"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}

                                            {isActive && !isCollapsed && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="ml-auto w-2 h-2 rounded-full bg-current"
                                                />
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-white/10">
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-4"
                            >
                                <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {getInitials()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate text-sm">
                                            {getDisplayName()}
                                        </p>
                                        <p className="text-gray-400 text-xs truncate">
                                            {user?.email || 'Restaurant Owner'}
                                        </p>
                                    </div>
                                    <button className="text-gray-400 hover:text-white p-1 rounded transition-colors">
                                        <Bell className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        <button
                            className={`w-full flex items-center text-red-400 hover:text-red-300 hover:bg-red-400/10 p-3 rounded-xl transition-all ${
                                isCollapsed ? "justify-center" : "space-x-3"
                            }`}
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5" />
                            {!isCollapsed && <span className="font-medium">Logout</span>}
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.aside
                        initial={{ x: -256 }}
                        animate={{ x: 0 }}
                        exit={{ x: -256 }}
                        className="fixed left-0 top-0 h-full w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 md:hidden"
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="p-4 border-b border-white/10">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
                                        <ChefHat className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-bold text-lg">QuickBite</h2>
                                        <p className="text-gray-400 text-sm">{user?.user_type === 'rider' ? 'Rider Portal' : 'Restaurant Portal'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href
                                    const Icon = item.icon

                                    return (
                                        <Link 
                                            key={item.href} 
                                            href={item.href} 
                                            onClick={() => setIsMobileOpen(false)}
                                        >
                                            <div
                                                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                                                    isActive
                                                        ? `${item.bgColor} ${item.color} shadow-lg`
                                                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                                                }`}
                                            >
                                                <Icon className={`h-5 w-5 ${isActive ? item.color : ""}`} />
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </nav>

                            {/* User Profile & Logout */}
                            <div className="p-4 border-t border-white/10">
                                <div className="mb-4">
                                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {getInitials()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate text-sm">
                                                {getDisplayName()}
                                            </p>
                                            <p className="text-gray-400 text-xs truncate">
                                                {user?.email || 'Restaurant Owner'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="w-full flex items-center space-x-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 p-3 rounded-xl transition-all"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    )
}
