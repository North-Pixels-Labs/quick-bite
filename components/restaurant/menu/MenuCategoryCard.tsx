'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Folder, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { useDeleteCategory } from '@/hooks/useMenuQueries'
import { useToast } from '@/components/shared/Toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EditCategoryModal from './EditCategoryModal'
import type { MenuCategory } from '@/types/restaurant.types'

interface MenuCategoryCardProps {
    category: MenuCategory
    restaurantId: string
}

export default function MenuCategoryCard({ category, restaurantId }: MenuCategoryCardProps) {
    const [showMenu, setShowMenu] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const { showToast } = useToast()
    const deleteCategory = useDeleteCategory()

    const handleDelete = async () => {
        try {
            await deleteCategory.mutateAsync({ restaurantId, categoryId: category.id })
            showToast('success', 'Category deleted successfully')
            setShowDeleteDialog(false)
        } catch (error) {
            showToast('error', 'Failed to delete category')
        }
    }

    return (
        <>
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

                {/* Actions Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setShowEditModal(true)
                                        setShowMenu(false)
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Category
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteDialog(true)
                                        setShowMenu(false)
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Category
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Edit Modal */}
            {showEditModal && (
                <EditCategoryModal
                    category={category}
                    restaurantId={restaurantId}
                    onClose={() => setShowEditModal(false)}
                />
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${category.name}"? This will also delete all items in this category.`}
                confirmText="Delete"
                variant="danger"
                isLoading={deleteCategory.isPending}
            />
        </>
    )
}
