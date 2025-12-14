'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useUpdateCategory } from '@/hooks/useMenuQueries'
import { useToast } from '@/components/shared/Toast'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { MenuCategory } from '@/types/restaurant.types'

interface EditCategoryModalProps {
    category: MenuCategory
    restaurantId: string
    onClose: () => void
}

export default function EditCategoryModal({ category, restaurantId, onClose }: EditCategoryModalProps) {
    const [name, setName] = useState(category.name)
    const [description, setDescription] = useState(category.description || '')
    const [sortOrder, setSortOrder] = useState(category.sort_order)

    const { showToast } = useToast()
    const updateCategory = useUpdateCategory()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            showToast('error', 'Category name is required')
            return
        }

        try {
            await updateCategory.mutateAsync({
                restaurantId,
                categoryId: category.id,
                data: {
                    name: name.trim(),
                    description: description.trim() || undefined,
                    sort_order: sortOrder,
                },
            })
            showToast('success', 'Category updated successfully')
            onClose()
        } catch (error) {
            showToast('error', 'Failed to update category')
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Edit Category</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Pizzas, Burgers, Desserts"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of this category"
                                rows={3}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sort Order
                            </label>
                            <input
                                type="number"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                placeholder="0"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                            />
                            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
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
                                disabled={updateCategory.isPending}
                                className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {updateCategory.isPending ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Category'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
