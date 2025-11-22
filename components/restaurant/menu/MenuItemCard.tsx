'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MoreVertical, Image as ImageIcon, Leaf, Wheat, Edit, Trash2, Eye, Settings } from 'lucide-react'
import { assetUrl } from '@/lib/utils'
import { useUpdateItemAvailability, useDeleteItem, useUpdateItem } from '@/hooks/useMenuQueries'
import { useToast } from '@/components/shared/Toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EditItemModal from './EditItemModal'
import ItemDetailModal from './ItemDetailModal'
import ManageOptionsModal from './ManageOptionsModal'
import type { MenuItem, MenuCategory } from '@/types/restaurant.types'

interface MenuItemCardProps {
    item: MenuItem
    restaurantId: string
    viewMode: 'grid' | 'list'
    categories: MenuCategory[]
}

export default function MenuItemCard({ item, restaurantId, viewMode, categories }: MenuItemCardProps) {
    const [showMenu, setShowMenu] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showManageOptions, setShowManageOptions] = useState(false)

    const { showToast } = useToast()
    const updateAvailability = useUpdateItemAvailability()
    const deleteItem = useDeleteItem()
    const updateItem = useUpdateItem()
    const router = useRouter()

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

    const handleDelete = async () => {
        try {
            await deleteItem.mutateAsync({ restaurantId, itemId: item.id })
            showToast('success', 'Item deleted successfully')
            setShowDeleteDialog(false)
        } catch (error) {
            showToast('error', 'Failed to delete item')
        }
    }

    const move = async (delta: number) => {
        try {
            await updateItem.mutateAsync({ restaurantId, itemId: item.id, data: { sort_order: item.sort_order + delta } })
            showToast('success', 'Sort order updated')
        } catch {
            showToast('error', 'Failed to update sort order')
        }
    }

    const formatPrice = (price: number) => {
        return `$${(price / 100).toFixed(2)}`
    }

    if (viewMode === 'list') {
        return (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
                >
                    {/* Image */}
                    <div
                        className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer"
                        onClick={() => router.push(`/dashboard/restaurant/menu/${item.id}`)}
                    >
                        {item.image_url ? (
                            <img src={assetUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-gray-600" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4
                                className="text-white font-medium truncate cursor-pointer hover:text-orange-400 transition-colors"
                                onClick={() => router.push(`/dashboard/restaurant/menu/${item.id}`)}
                            >
                                {item.name}
                            </h4>
                            {item.is_vegetarian && <Leaf className="w-4 h-4 text-green-400 flex-shrink-0" />}
                            {item.is_vegan && <Leaf className="w-4 h-4 text-green-500 flex-shrink-0" />}
                            {item.is_gluten_free && <Wheat className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
                        </div>
                        {item.description && (
                            <p className="text-sm text-gray-400 line-clamp-1">{item.description}</p>
                        )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-white">{formatPrice(item.price)}</span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => move(-10)} className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded text-white">↑</button>
                            <button onClick={() => move(10)} className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded text-white">↓</button>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={item.is_available}
                                onChange={handleToggleAvailability}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>

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
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-50 overflow-visible">
                                        <button
                                            onClick={() => {
                                                router.push(`/dashboard/restaurant/menu/${item.id}`)
                                                setShowMenu(false)
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowEditModal(true)
                                                setShowMenu(false)
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit Item
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowManageOptions(true)
                                                setShowMenu(false)
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Manage Options
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDeleteDialog(true)
                                                setShowMenu(false)
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Item
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Modals */}
                {showEditModal && (
                    <EditItemModal
                        item={item}
                        restaurantId={restaurantId}
                        categories={categories}
                        onClose={() => setShowEditModal(false)}
                    />
                )}
                {showDetailModal && (
                    <ItemDetailModal
                        item={item}
                        restaurantId={restaurantId}
                        onClose={() => setShowDetailModal(false)}
                        onEdit={() => setShowEditModal(true)}
                    />
                )}
                {showManageOptions && (
                    <ManageOptionsModal
                        item={item}
                        restaurantId={restaurantId}
                        onClose={() => setShowManageOptions(false)}
                    />
                )}
                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={handleDelete}
                    title="Delete Item"
                    message={`Are you sure you want to delete "${item.name}"?`}
                    confirmText="Delete"
                    variant="danger"
                    isLoading={deleteItem.isPending}
                />
            </>
        )
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
            >
                {/* Image */}
                <div
                    className="aspect-video bg-white/5 flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/dashboard/restaurant/menu/${item.id}`)}
                >
                    {item.image_url ? (
                        <img src={assetUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-12 h-12 text-gray-600" />
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4
                                    className="text-white font-medium cursor-pointer hover:text-orange-400 transition-colors"
                                    onClick={() => router.push(`/dashboard/restaurant/menu/${item.id}`)}
                                >
                                    {item.name}
                                </h4>
                                {item.is_vegetarian && <Leaf className="w-4 h-4 text-green-400 flex-shrink-0" />}
                                {item.is_vegan && <Leaf className="w-4 h-4 text-green-500 flex-shrink-0" />}
                                {item.is_gluten_free && <Wheat className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
                            </div>
                            {item.description && (
                                <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                            )}
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
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-50 overflow-visible">
                                        <button
                                            onClick={() => {
                                                router.push(`/dashboard/restaurant/menu/${item.id}`)
                                                setShowMenu(false)
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowEditModal(true)
                                                setShowMenu(false)
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit Item
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowManageOptions(true)
                                                setShowMenu(false)
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Manage Options
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDeleteDialog(true)
                                                setShowMenu(false)
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Item
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
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

            {/* Modals */}
            {showEditModal && (
                <EditItemModal
                    item={item}
                    restaurantId={restaurantId}
                    categories={categories}
                    onClose={() => setShowEditModal(false)}
                />
            )}
            {showDetailModal && (
                <ItemDetailModal
                    item={item}
                    restaurantId={restaurantId}
                    onClose={() => setShowDetailModal(false)}
                    onEdit={() => setShowEditModal(true)}
                />
            )}
            {showManageOptions && (
                <ManageOptionsModal
                    item={item}
                    restaurantId={restaurantId}
                    onClose={() => setShowManageOptions(false)}
                />
            )}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Item"
                message={`Are you sure you want to delete "${item.name}"?`}
                confirmText="Delete"
                variant="danger"
                isLoading={deleteItem.isPending}
            />
        </>
    )
}
