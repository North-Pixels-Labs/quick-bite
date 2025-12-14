'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import { useCreateItem, useCreateOption, useCreateOptionValue } from '@/hooks/useMenuQueries'
import { useToast } from '@/components/shared/Toast'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { MenuCategory } from '@/types/restaurant.types'
import { assetUrl } from '@/lib/utils'

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
        ingredients: [] as string[],
        allergens: [] as string[],
        sort_order: 0,
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)
    const [options, setOptions] = useState<Array<{ id: string; name: string; type: 'single_select' | 'multi_select'; is_required: boolean; sort_order: number; values: Array<{ id: string; name: string; price_modifier: string; is_default: boolean; sort_order: number }> }>>([])

    const { showToast } = useToast()
    const createItem = useCreateItem()
    const createOption = useCreateOption()
    const createValue = useCreateOptionValue()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            cropToSquare(file).then((cropped) => {
                setImageFile(cropped)
                const reader = new FileReader()
                reader.onloadend = () => setImagePreview(reader.result as string)
                reader.readAsDataURL(cropped)
            }).catch(() => {
                setImageFile(file)
            })
        }
    }

    const addIngredient = (value: string) => {
        const v = value.trim()
        if (!v) return
        setFormData((f) => ({ ...f, ingredients: Array.from(new Set([...(f.ingredients || []), v])) }))
    }
    const removeIngredient = (v: string) => setFormData((f) => ({ ...f, ingredients: (f.ingredients || []).filter((x) => x !== v) }))
    const addAllergen = (value: string) => {
        const v = value.trim()
        if (!v) return
        setFormData((f) => ({ ...f, allergens: Array.from(new Set([...(f.allergens || []), v])) }))
    }
    const removeAllergen = (v: string) => setFormData((f) => ({ ...f, allergens: (f.allergens || []).filter((x) => x !== v) }))

    const addOption = () => {
        setOptions((opts) => [...opts, { id: crypto.randomUUID(), name: '', type: 'single_select', is_required: false, sort_order: 0, values: [] }])
    }
    const removeOption = (id: string) => setOptions((opts) => opts.filter((o) => o.id !== id))
    const addValue = (optionId: string) => {
        setOptions((opts) => opts.map((o) => o.id === optionId ? { ...o, values: [...o.values, { id: crypto.randomUUID(), name: '', price_modifier: '', is_default: false, sort_order: 0 }] } : o))
    }
    const removeValue = (optionId: string, valueId: string) => setOptions((opts) => opts.map((o) => o.id === optionId ? { ...o, values: o.values.filter((v) => v.id !== valueId) } : o))

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
            const res = await createItem.mutateAsync({
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
                    ingredients: (formData.ingredients && formData.ingredients.length) ? JSON.stringify(formData.ingredients) : undefined,
                    allergens: (formData.allergens && formData.allergens.length) ? JSON.stringify(formData.allergens) : undefined,
                    sort_order: formData.sort_order,
                },
            })
            const itemId = res.data.data.id
            // Upload image if present
            if (imageFile) {
                setServerError(null)
                try {
                    const fd = new FormData(); fd.append('image', imageFile)
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/restaurants/${restaurantId}/menu/items/${itemId}/image`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` }, body: fd })
                } catch (err) {
                    setServerError('Image upload failed')
                }
            }
            // Create options & values
            for (const opt of options) {
                const createdOpt = await createOption.mutateAsync({ restaurantId, itemId, data: { name: opt.name.trim(), type: opt.type, is_required: opt.is_required, sort_order: opt.sort_order } })
                const optionId = createdOpt.data.data.id
                for (const val of opt.values) {
                    await createValue.mutateAsync({ restaurantId, itemId, optionId, data: { name: val.name.trim(), price_modifier: val.price_modifier ? Math.round(parseFloat(val.price_modifier) * 100) : 0, is_default: val.is_default, sort_order: val.sort_order } })
                }
            }
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
                    className="w-full max-w-2xl relative scrollbar-thin h-[80%] overflow-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 my-8"
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
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Item Image</label>
                            <div className="flex items-center gap-4">
                                <div className="w-32 h-32 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Upload className="w-12 h-12 text-gray-600" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="block">
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        <span className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center gap-2">
                                            <Upload className="w-4 h-4" />
                                            {imagePreview ? 'Change Image' : 'Upload Image'}
                                        </span>
                                    </label>
                                    {serverError && <p className="text-sm text-red-400">{serverError}</p>}
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
                                        <option key={category.id} value={category.id} className="bg-black/40 backdrop-blur-xl">
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
                                {formData.price && (
                                    <p className="text-xs text-gray-500 mt-1">Formatted: ${Number(formData.price).toFixed(2)}</p>
                                )}
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

                        {/* Ingredients */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Ingredients</label>
                            <ChipEditor values={formData.ingredients} onAdd={addIngredient} onRemove={removeIngredient} placeholder="Add ingredient" />
                        </div>

                        {/* Allergens */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Allergens</label>
                            <ChipEditor values={formData.allergens} onAdd={addAllergen} onRemove={removeAllergen} placeholder="Add allergen" />
                        </div>

                        {/* Options Builder */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white">Customization Options</h3>
                                <button type="button" onClick={addOption} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-white text-sm inline-flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Option
                                </button>
                            </div>
                            {options.map((opt, idx) => (
                                <div key={opt.id} className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input value={opt.name} onChange={(e) => setOptions((arr) => arr.map((o) => o.id === opt.id ? { ...o, name: e.target.value } : o))} placeholder="Option name (e.g., Size)" className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                                        <select value={opt.type} onChange={(e) => setOptions((arr) => arr.map((o) => o.id === opt.id ? { ...o, type: e.target.value as 'single_select' | 'multi_select' } : o))} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white">
                                            <option value="single_select" className="bg-black/40 backdrop-blur-xl">Single Select</option>
                                            <option value="multi_select" className="bg-black/40 backdrop-blur-xl">Multi Select</option>
                                        </select>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={opt.is_required} onChange={(e) => setOptions((arr) => arr.map((o) => o.id === opt.id ? { ...o, is_required: e.target.checked } : o))} />
                                            <span className="text-sm text-gray-300">Required</span>
                                        </label>
                                        <input type="number" value={opt.sort_order} onChange={(e) => setOptions((arr) => arr.map((o) => o.id === opt.id ? { ...o, sort_order: parseInt(e.target.value) || 0 } : o))} className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded text-white" placeholder="Sort" />
                                        <button type="button" onClick={() => removeOption(opt.id)} className="px-2 py-2 bg-red-500/10 hover:bg-red-500/20 rounded text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {opt.values.map((val) => (
                                            <div key={val.id} className="flex items-center gap-2">
                                                <input value={val.name} onChange={(e) => setOptions((arr) => arr.map((o) => o.id === opt.id ? { ...o, values: o.values.map((v) => v.id === val.id ? { ...v, name: e.target.value } : v) } : o))} placeholder="Value name (e.g., Large)" className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                                                <input type="number" step="0.01" value={val.price_modifier} onChange={(e) => setOptions((arr) => arr.map((o) => o.id === opt.id ? { ...o, values: o.values.map((v) => v.id === val.id ? { ...v, price_modifier: e.target.value } : v) } : o))} placeholder="+$0.50" className="w-32 px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                                                <label className="flex items-center gap-2">
                                                    <input type="checkbox" checked={val.is_default} onChange={(e) => setOptions((arr) => arr.map((o) => o.id === opt.id ? { ...o, values: o.values.map((v) => v.id === val.id ? { ...v, is_default: e.target.checked } : v) } : o))} />
                                                    <span className="text-sm text-gray-300">Default</span>
                                                </label>
                                                <input type="number" value={val.sort_order} onChange={(e) => setOptions((arr) => arr.map((o) => o.id === opt.id ? { ...o, values: o.values.map((v) => v.id === val.id ? { ...v, sort_order: parseInt(e.target.value) || 0 } : v) } : o))} className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded text-white" placeholder="Sort" />
                                                <button type="button" onClick={() => removeValue(opt.id, val.id)} className="px-2 py-2 bg-red-500/10 hover:bg-red-500/20 rounded text-red-400">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addValue(opt.id)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-white text-sm inline-flex items-center gap-2">
                                            <Plus className="w-4 h-4" /> Add Value
                                        </button>
                                    </div>
                                </div>
                            ))}
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

function ChipEditor({ values, onAdd, onRemove, placeholder }: { values: string[]; onAdd: (v: string) => void; onRemove: (v: string) => void; placeholder: string }) {
    const [input, setInput] = useState('')
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                <button type="button" onClick={() => { onAdd(input); setInput('') }} className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded text-white">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
                {values?.map((v) => (
                    <span key={v} className="px-2 py-1 bg-white/10 text-white text-xs rounded inline-flex items-center gap-2">
                        {v}
                        <button type="button" onClick={() => onRemove(v)} className="text-gray-300 hover:text-white">×</button>
                    </span>
                ))}
            </div>
        </div>
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
