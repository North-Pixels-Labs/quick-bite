'use client'

import React from 'react'
import { Bell, Search } from 'lucide-react'

export const Header = () => {
    return (
        <header className="h-16 bg-[#121212] border-b border-white/10 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-40">
            {/* Search */}
            <div className="flex items-center gap-3 w-96 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus-within:border-orange-500/50 transition-colors">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search orders, menu items..."
                    className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#121212]" />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">Tasty Bites</p>
                        <p className="text-xs text-gray-500">Restaurant Owner</p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        TB
                    </div>
                </div>
            </div>
        </header>
    )
}
