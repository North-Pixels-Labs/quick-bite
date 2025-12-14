'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Flame, Leaf, Wheat, DollarSign, Tag } from 'lucide-react'
import { assetUrl } from '@/lib/utils'
import { useMenuItemOptions } from '@/hooks/useMenuQueries'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { MenuItem } from '@/types/restaurant.types'

interface ItemDetailModalProps {
    item: MenuItem
    restaurantId: string
    onClose: () => void
    onEdit: () => void
}

export default function ItemDetailModal({ item, restaurantId, onClose, onEdit }: ItemDetailModalProps) {
    const { data: options, isLoading: loadingOptions } = useMenuItemOptions(restaurantId, item.id)

    const formatPrice = (price: number) => {
        return `$${(price / 100).toFixed(2)}`
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden my-8"
                >
                    {/* Header with Image */}
                    <div className="relative h-64 bg-white/5">
                        {item.image_url ? (
                            <img src={assetUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Tag className="w-16 h-16 text-gray-600" />
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors backdrop-blur-sm"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Title and Price */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">{item.name}</h2>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {item.is_vegetarian && (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md flex items-center gap-1">
                                            <Leaf className="w-3 h-3" />
                                            Vegetarian
                                        </span>
                                    )}
                                    {item.is_vegan && (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-md flex items-center gap-1">
                                            <Leaf className="w-3 h-3" />
                                            Vegan
                                        </span>
                                    )}
                                    {item.is_gluten_free && (
                                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-md flex items-center gap-1">
                                            <Wheat className="w-3 h-3" />
                                            Gluten Free
                                        </span>
                                    )}
                                    {!item.is_available && (
                                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-md">
                                            Unavailable
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-white">{formatPrice(item.price)}</div>
                            </div>
                        </div>

                        {/* Description */}
                        {item.description && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                                <p className="text-gray-400">{item.description}</p>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {item.calories && (
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                        <Flame className="w-4 h-4" />
                                        Calories
                                    </div>
                                    <div className="text-white font-semibold">{item.calories}</div>
                                </div>
                            )}
                            {item.preparation_time && (
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                        <Clock className="w-4 h-4" />
                                        Prep Time
                                    </div>
                                    <div className="text-white font-semibold">{item.preparation_time} min</div>
                                </div>
                            )}
                        </div>

                        {/* Ingredients */}
                        {item.ingredients && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-300 mb-2">Ingredients</h3>
                                <p className="text-gray-400">{item.ingredients}</p>
                            </div>
                        )}

                        {/* Allergens */}
                        {item.allergens && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-300 mb-2">Allergens</h3>
                                <p className="text-red-400">{item.allergens}</p>
                            </div>
                        )}

                        {/* Options */}
                        {loadingOptions ? (
                            <div className="flex items-center justify-center py-4">
                                <LoadingSpinner />
                            </div>
                        ) : options && options.length > 0 ? (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-300 mb-3">Customization Options</h3>
                                <div className="space-y-3">
                                    {options.map((option) => (
                                        <div key={option.id} className="p-3 bg-white/5 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-white">{option.name}</span>
                                                <span className="text-xs text-gray-400">
                                                    {option.type === 'single_select' ? 'Choose one' : 'Choose multiple'}
                                                </span>
                                            </div>
                                            {option.is_required && (
                                                <span className="text-xs text-orange-400">Required</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    onClose()
                                    onEdit()
                                }}
                                className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Edit Item
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
