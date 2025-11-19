'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload } from 'lucide-react'
import { useCreateItem } from '@/hooks/useMenuQueries'
import { useToast } from '@/components/shared/Toast'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { MenuCategory } from '@/types/restaurant.types'

interface AddItemModalProps {
    restaurantId: string
    categories: MenuCategory[]
    onClose: () => void
}

export default function AddItemModal({ restaurantId, categories, onClose }: AddItemModalProps) {
    const [formData, setFormData] = useState({
        category_id: categories[0]?.id || '',
        name: '',
        description: '',
        price: '',
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        calories: '',
        preparation_time: '',
        sort_order: 0,
    })

    const { showToast } = useToast()
    const createItem = useCreateItem()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            showToast('error', 'Item name is required')
            return
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            showToast('error', 'Valid price is required')
            return
        }

        if (!formData.category_id) {
            showToast('error', 'Please select a category')
            return
        }

        try {
            await createItem.mutateAsync({
                restaurantId,
                data: {
                    category_id: formData.category_id,
                    name: formData.name.trim(),
                    description: formData.description.trim() || undefined,
                    price: Math.round(parseFloat(formData.price) * 100), // Convert to cents
                    is_vegetarian: formData.is_vegetarian,
                    is_vegan: formData.is_vegan,
                    is_gluten_free: formData.is_gluten_free,
                    calories: formData.calories ? parseInt(formData.calories) : undefined,
                    preparation_time: formData.preparation_time ? parseInt(formData.preparation_time) : undefined,
                    sort_order: formData.sort_order,
                },
            })
            showToast('success', 'Menu item created successfully')
            onClose()
        } catch (error) {
            showToast('error', 'Failed to create menu item')
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-2xl bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 my-8"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Add Menu Item</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Margherita Pizza"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                    required
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id} className="bg-[#1A1A1A]">
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Price ($) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="9.99"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the item"
                                rows={3}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 resize-none"
                            />
                        </div>

                        {/* Dietary Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Dietary Information
                            </label>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_vegetarian}
                                        onChange={(e) => setFormData({ ...formData, is_vegetarian: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-600 bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-gray-300">Vegetarian</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_vegan}
                                        onChange={(e) => setFormData({ ...formData, is_vegan: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-600 bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-gray-300">Vegan</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_gluten_free}
                                        onChange={(e) => setFormData({ ...formData, is_gluten_free: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-600 bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-gray-300">Gluten Free</span>
                                </label>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Calories
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.calories}
                                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                    placeholder="250"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Prep Time (min)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.preparation_time}
                                    onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                                    placeholder="15"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={formData.sort_order}
                                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createItem.isPending}
                                className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {createItem.isPending ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Item'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
