'use client'

import { motion } from 'framer-motion'
import { Folder, MoreVertical } from 'lucide-react'
import type { MenuCategory } from '@/types/restaurant.types'

interface MenuCategoryCardProps {
    category: MenuCategory
    restaurantId: string
}

export default function MenuCategoryCard({ category }: MenuCategoryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    {category.description && (
                        <p className="text-sm text-gray-400">{category.description}</p>
                    )}
                </div>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
        </motion.div>
    )
}
