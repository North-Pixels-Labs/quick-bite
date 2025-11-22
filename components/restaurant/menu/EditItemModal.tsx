'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { assetUrl } from '@/lib/utils'
import { useUpdateItem, useUploadItemImage, useDeleteItemImage } from '@/hooks/useMenuQueries'
import { useToast } from '@/components/shared/Toast'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { MenuItem, MenuCategory } from '@/types/restaurant.types'

interface EditItemModalProps {
    item: MenuItem
    restaurantId: string
    categories: MenuCategory[]
    onClose: () => void
}

export default function EditItemModal({ item, restaurantId, categories, onClose }: EditItemModalProps) {
    const [formData, setFormData] = useState({
        category_id: item.category_id,
        name: item.name,
        description: item.description || '',
        price: (item.price / 100).toString(),
        is_vegetarian: item.is_vegetarian,
        is_vegan: item.is_vegan,
        is_gluten_free: item.is_gluten_free,
        calories: item.calories?.toString() || '',
        preparation_time: item.preparation_time?.toString() || '',
        sort_order: item.sort_order,
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(item.image_url ? assetUrl(item.image_url) : null)
    const [serverError, setServerError] = useState<string | null>(null)
    const [originalImage, setOriginalImage] = useState<File | null>(null)
    const [cropX, setCropX] = useState(50)
    const [cropY, setCropY] = useState(50)

    const { showToast } = useToast()
    const updateItem = useUpdateItem()
    const uploadImage = useUploadItemImage()
    const deleteImage = useDeleteItemImage()

    const recropAndPreviewLocal = (file: File, x: number, y: number) => {
        cropToSquareWithOffset(file, x, y).then(({ file: cropped, dataUrl }) => {
            setImageFile(cropped)
            setImagePreview(dataUrl)
        })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setOriginalImage(file)
            recropAndPreviewLocal(file, cropX, cropY)
        }
    }

    const handleDeleteImage = async () => {
        if (!item.image_url) return

        try {
            await deleteImage.mutateAsync({ restaurantId, itemId: item.id })
            setImagePreview(null)
            setImageFile(null)
            showToast('success', 'Image deleted successfully')
        } catch (error) {
            showToast('error', 'Failed to delete image')
        }
    }

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

        try {
            // Update item details
            await updateItem.mutateAsync({
                restaurantId,
                itemId: item.id,
                data: {
                    category_id: formData.category_id,
                    name: formData.name.trim(),
                    description: formData.description.trim() || undefined,
                    price: Math.round(parseFloat(formData.price) * 100),
                    is_vegetarian: formData.is_vegetarian,
                    is_vegan: formData.is_vegan,
                    is_gluten_free: formData.is_gluten_free,
                    calories: formData.calories ? parseInt(formData.calories) : undefined,
                    preparation_time: formData.preparation_time ? parseInt(formData.preparation_time) : undefined,
                    sort_order: formData.sort_order,
                },
            })

            // Upload new image if selected
            if (imageFile) {
                setServerError(null)
                try {
                    await uploadImage.mutateAsync({ restaurantId, itemId: item.id, file: imageFile })
                } catch (err: any) {
                    const msg = err?.response?.data?.message || 'Image upload failed'
                    setServerError(msg)
                    return
                }
            }

            showToast('success', 'Menu item updated successfully')
            onClose()
        } catch (error) {
            showToast('error', 'Failed to update menu item')
        }
    }

    const isLoading = updateItem.isPending || uploadImage.isPending || deleteImage.isPending

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
                        <h2 className="text-xl font-bold text-white">Edit Menu Item</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Item Image
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-32 h-32 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-12 h-12 text-gray-600" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <span className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        {imagePreview ? 'Change Image' : 'Upload Image'}
                                    </span>
                                </label>
                                {serverError && (
                                    <p className="text-sm text-red-400">{serverError}</p>
                                )}
                                {originalImage && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">Position X</span>
                                            <input type="range" min={0} max={100} value={cropX} onChange={(e) => { const v = parseInt(e.target.value); setCropX(v); recropAndPreviewLocal(originalImage, v, cropY) }} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">Position Y</span>
                                            <input type="range" min={0} max={100} value={cropY} onChange={(e) => { const v = parseInt(e.target.value); setCropY(v); recropAndPreviewLocal(originalImage, cropX, v) }} />
                                        </div>
                                    </div>
                                )}
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteImage}
                                        disabled={deleteImage.isPending}
                                        className="block px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        {deleteImage.isPending ? 'Deleting...' : 'Delete Image'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

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
                                disabled={isLoading}
                                className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Item'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

async function cropToSquare(file: File): Promise<File> {
    const img = document.createElement('img')
    img.src = URL.createObjectURL(file)
    await new Promise((res) => { img.onload = res })
    const size = Math.min(img.naturalWidth, img.naturalHeight)
    const sx = (img.naturalWidth - size) / 2
    const sy = (img.naturalHeight - size) / 2
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 800
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, sx, sy, size, size, 0, 0, 800, 800)
    return new Promise<File>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('crop failed'))
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '') + '-cropped.jpg', { type: 'image/jpeg' }))
        }, 'image/jpeg', 0.9)
    })
}

async function cropToSquareWithOffset(file: File, offsetXPercent: number, offsetYPercent: number): Promise<{ file: File; dataUrl: string }> {
    const img = document.createElement('img')
    img.src = URL.createObjectURL(file)
    await new Promise((res) => { img.onload = res })
    const size = Math.min(img.naturalWidth, img.naturalHeight)
    const maxX = img.naturalWidth - size
    const maxY = img.naturalHeight - size
    const sx = Math.round((offsetXPercent / 100) * maxX)
    const sy = Math.round((offsetYPercent / 100) * maxY)
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 800
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, sx, sy, size, size, 0, 0, 800, 800)
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('crop failed'))
            const f = new File([blob], file.name.replace(/\.[^.]+$/, '') + '-cropped.jpg', { type: 'image/jpeg' })
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
            resolve({ file: f, dataUrl })
        }, 'image/jpeg', 0.9)
    })
}
