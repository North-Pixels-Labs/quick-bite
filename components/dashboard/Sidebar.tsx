'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    ShoppingBag,
    UtensilsCrossed,
    Users,
    Settings,
    LogOut,
    ChefHat
} from 'lucide-react'

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/restaurant' },
    { icon: ShoppingBag, label: 'Orders', href: '/dashboard/restaurant/orders' },
    { icon: UtensilsCrossed, label: 'Menu', href: '/dashboard/restaurant/menu' },
    { icon: Users, label: 'Staff', href: '/dashboard/restaurant/staff' },
    { icon: Settings, label: 'Settings', href: '/dashboard/restaurant/settings' },
]

export const Sidebar = () => {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen bg-[#121212] border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-white/10">
                <Link href="/dashboard/restaurant" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-white tracking-tight">QuickBite</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${isActive
                                    ? 'bg-orange-500/10 text-orange-500'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-gray-500 group-hover:text-white'}`} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-white/10">
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
