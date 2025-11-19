'use client'

import { motion } from 'framer-motion'
import { MoreVertical, Image as ImageIcon, Leaf, Wheat } from 'lucide-react'
import { useUpdateItemAvailability } from '@/hooks/useMenuQueries'
import { useToast } from '@/components/shared/Toast'
import type { MenuItem } from '@/types/restaurant.types'

interface MenuItemCardProps {
    item: MenuItem
    restaurantId: string
    viewMode: 'grid' | 'list'
}

export default function MenuItemCard({ item, restaurantId, viewMode }: MenuItemCardProps) {
    const { showToast } = useToast()
    const updateAvailability = useUpdateItemAvailability()

    const handleToggleAvailability = async () => {
        try {
            await updateAvailability.mutateAsync({
                restaurantId,
                itemId: item.id,
                data: { is_available: !item.is_available },
            })
            showToast('success', `${item.name} is now ${!item.is_available ? 'available' : 'unavailable'}`)
        } catch (error) {
            showToast('error', 'Failed to update availability')
        }
    }

    const formatPrice = (price: number) => {
        return `$${(price / 100).toFixed(2)}`
    }

    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
            >
                {/* Image */}
                <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-gray-600" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium truncate">{item.name}</h4>
                        {item.is_vegetarian && <Leaf className="w-4 h-4 text-green-400" title="Vegetarian" />}
                        {item.is_vegan && <Leaf className="w-4 h-4 text-green-500" title="Vegan" />}
                        {item.is_gluten_free && <Wheat className="w-4 h-4 text-yellow-400" title="Gluten Free" />}
                    </div>
                    {item.description && (
                        <p className="text-sm text-gray-400 line-clamp-1">{item.description}</p>
                    )}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-white">{formatPrice(item.price)}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={item.is_available}
                            onChange={handleToggleAvailability}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
        >
            {/* Image */}
            <div className="aspect-video bg-white/5 flex items-center justify-center overflow-hidden">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <ImageIcon className="w-12 h-12 text-gray-600" />
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-medium">{item.name}</h4>
                            {item.is_vegetarian && <Leaf className="w-4 h-4 text-green-400" title="Vegetarian" />}
                            {item.is_vegan && <Leaf className="w-4 h-4 text-green-500" title="Vegan" />}
                            {item.is_gluten_free && <Wheat className="w-4 h-4 text-yellow-400" title="Gluten Free" />}
                        </div>
                        {item.description && (
                            <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                        )}
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-white">{formatPrice(item.price)}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={item.is_available}
                            onChange={handleToggleAvailability}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                </div>

                {!item.is_available && (
                    <div className="mt-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-md text-center">
                        Unavailable
                    </div>
                )}
            </div>
        </motion.div>
    )
}
