'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Edit, Trash2, Settings } from 'lucide-react'
import { useMenuItemOptions, useCreateOption, useCreateOptionValue, useDeleteOption, useDeleteOptionValue, useUpdateOption, useUpdateOptionValue, useMenuItemOptionValues } from '@/hooks/useMenuQueries'
import { useToast } from '@/components/shared/Toast'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import type { MenuItem, MenuItemOption } from '@/types/restaurant.types'

interface ManageOptionsModalProps {
    item: MenuItem
    restaurantId: string
    onClose: () => void
}

export default function ManageOptionsModal({ item, restaurantId, onClose }: ManageOptionsModalProps) {
    const [showAddOption, setShowAddOption] = useState(false)
    const [showAddValue, setShowAddValue] = useState<string | null>(null)
    const [selectedOption, setSelectedOption] = useState<MenuItemOption | null>(null)

    const { data: options, isLoading } = useMenuItemOptions(restaurantId, item.id)
    const { showToast } = useToast()

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-3xl bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden my-8"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div>
                            <h2 className="text-xl font-bold text-white">Manage Options</h2>
                            <p className="text-sm text-gray-400 mt-1">{item.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <LoadingSpinner />
                            </div>
                        ) : !options?.length ? (
                            <div className="text-center py-12">
                                <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">No Options Yet</h3>
                                <p className="text-gray-400 mb-6">Add customization options like size, toppings, or extras</p>
                                <button
                                    onClick={() => setShowAddOption(true)}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Option
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Add Option Button */}
                                <button
                                    onClick={() => setShowAddOption(true)}
                                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Option
                                </button>

                                {/* Options List */}
                                {options.map((option) => (
                                    <OptionCard
                                        key={option.id}
                                        option={option}
                                        restaurantId={restaurantId}
                                        itemId={item.id}
                                        onAddValue={() => setShowAddValue(option.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>

                {/* Add Option Modal */}
                {showAddOption && (
                    <AddOptionModal
                        restaurantId={restaurantId}
                        itemId={item.id}
                        onClose={() => setShowAddOption(false)}
                    />
                )}

                {/* Add Value Modal */}
                {showAddValue && (
                    <AddOptionValueModal
                        restaurantId={restaurantId}
                        itemId={item.id}
                        optionId={showAddValue}
                        onClose={() => setShowAddValue(null)}
                    />
                )}
            </div>
        </AnimatePresence>
    )
}

// Option Card Component
function OptionCard({
    option,
    restaurantId,
    itemId,
    onAddValue,
}: {
    option: MenuItemOption
    restaurantId: string
    itemId: string
    onAddValue: () => void
}) {
    const [showMenu, setShowMenu] = useState(false)
    const [showEditOption, setShowEditOption] = useState(false)
    const [editValueId, setEditValueId] = useState<string | null>(null)
    const { data: values } = useMenuItemOptionValues(restaurantId, itemId, option.id)
    const deleteOption = useDeleteOption()
    const deleteValue = useDeleteOptionValue()

    return (
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium">{option.name}</h4>
                        {option.is_required && (
                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">
                                Required
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400">
                        {option.type === 'single_select' ? 'Choose one' : 'Choose multiple'}
                    </p>
                </div>

                {/* Actions Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <Settings className="w-4 h-4 text-gray-400" />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setShowEditOption(true)
                                        setShowMenu(false)
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Option
                                </button>
                                <button
                                    onClick={() => {
                                        deleteOption.mutate({ restaurantId, itemId, optionId: option.id })
                                        setShowMenu(false)
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Option
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Add Value Button */}
            <button
                onClick={onAddValue}
                className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add Value
            </button>

            {/* Values list */}
            {values?.length ? (
                <div className="mt-3 space-y-2">
                    {values.map((v) => (
                        <div key={v.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                            <div className="text-sm text-white">
                                {v.name}
                                {v.is_default && (
                                    <span className="ml-2 text-xs text-orange-400">Default</span>
                                )}
                                {v.price_modifier !== 0 && (
                                    <span className="ml-2 text-xs text-gray-400">
                                        {v.price_modifier > 0 ? '+' : ''}${(v.price_modifier / 100).toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditValueId(v.id)}
                                    className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteValue.mutate({ restaurantId, itemId, optionId: option.id, valueId: v.id })}
                                    className="px-2 py-1 text-xs bg-red-500/10 hover:bg-red-500/20 rounded text-red-400"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            {showEditOption && (
                <EditOptionModal
                    restaurantId={restaurantId}
                    itemId={itemId}
                    option={option}
                    onClose={() => setShowEditOption(false)}
                />
            )}
            {editValueId && (
                <EditOptionValueModal
                    restaurantId={restaurantId}
                    itemId={itemId}
                    optionId={option.id}
                    valueId={editValueId}
                    onClose={() => setEditValueId(null)}
                />
            )}
        </div>
    )
}

// Add Option Modal
function AddOptionModal({
    restaurantId,
    itemId,
    onClose,
}: {
    restaurantId: string
    itemId: string
    onClose: () => void
}) {
    const [name, setName] = useState('')
    const [type, setType] = useState<'single_select' | 'multi_select'>('single_select')
    const [isRequired, setIsRequired] = useState(false)
    const [sortOrder, setSortOrder] = useState(0)

    const { showToast } = useToast()
    const createOption = useCreateOption()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            showToast('error', 'Option name is required')
            return
        }

        try {
            await createOption.mutateAsync({
                restaurantId,
                itemId,
                data: {
                    name: name.trim(),
                    type,
                    is_required: isRequired,
                    sort_order: sortOrder,
                },
            })
            showToast('success', 'Option created successfully')
            onClose()
        } catch (error) {
            showToast('error', 'Failed to create option')
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-2xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Add Option</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Option Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Size, Toppings, Extras"
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Selection Type *
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'single_select' | 'multi_select')}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                        >
                            <option value="single_select" className="bg-[#1A1A1A]">Single Select (Choose one)</option>
                            <option value="multi_select" className="bg-[#1A1A1A]">Multi Select (Choose multiple)</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isRequired}
                                onChange={(e) => setIsRequired(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-300">Required option</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Sort Order
                        </label>
                        <input
                            type="number"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                        />
                    </div>

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
                            disabled={createOption.isPending}
                            className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {createOption.isPending ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    Creating...
                                </>
                            ) : (
                                'Create Option'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

// Add Option Value Modal
function AddOptionValueModal({
    restaurantId,
    itemId,
    optionId,
    onClose,
}: {
    restaurantId: string
    itemId: string
    optionId: string
    onClose: () => void
}) {
    const [name, setName] = useState('')
    const [priceModifier, setPriceModifier] = useState('')
    const [isDefault, setIsDefault] = useState(false)
    const [sortOrder, setSortOrder] = useState(0)

    const { showToast } = useToast()
    const createValue = useCreateOptionValue()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            showToast('error', 'Value name is required')
            return
        }

        try {
            await createValue.mutateAsync({
                restaurantId,
                itemId,
                optionId,
                data: {
                    name: name.trim(),
                    price_modifier: priceModifier ? Math.round(parseFloat(priceModifier) * 100) : 0,
                    is_default: isDefault,
                    sort_order: sortOrder,
                },
            })
            showToast('success', 'Option value created successfully')
            onClose()
        } catch (error) {
            showToast('error', 'Failed to create option value')
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-2xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Add Option Value</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Value Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Small, Medium, Large"
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Price Modifier ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={priceModifier}
                            onChange={(e) => setPriceModifier(e.target.value)}
                            placeholder="0.00 (no change)"
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Positive for extra charge, negative for discount
                        </p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isDefault}
                                onChange={(e) => setIsDefault(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-300">Default selection</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Sort Order
                        </label>
                        <input
                            type="number"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                        />
                    </div>

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
                            disabled={createValue.isPending}
                            className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {createValue.isPending ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    Creating...
                                </>
                            ) : (
                                'Create Value'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

function EditOptionModal({
    restaurantId,
    itemId,
    option,
    onClose,
}: {
    restaurantId: string
    itemId: string
    option: MenuItemOption
    onClose: () => void
}) {
    const [name, setName] = useState(option.name)
    const [type, setType] = useState<'single_select' | 'multi_select'>(option.type)
    const [isRequired, setIsRequired] = useState(option.is_required)
    const [sortOrder, setSortOrder] = useState(option.sort_order)

    const { showToast } = useToast()
    const updateOption = useUpdateOption()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateOption.mutateAsync({
                restaurantId,
                itemId,
                optionId: option.id,
                data: { name, type, is_required: isRequired, sort_order: sortOrder },
            })
            showToast('success', 'Option updated successfully')
            onClose()
        } catch {
            showToast('error', 'Failed to update option')
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Edit Option</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Option Name *</label>
                        <input className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Selection Type *</label>
                        <select value={type} onChange={(e) => setType(e.target.value as 'single_select' | 'multi_select')} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white">
                            <option value="single_select" className="bg-[#1A1A1A]">Single Select</option>
                            <option value="multi_select" className="bg-[#1A1A1A]">Multi Select</option>
                        </select>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-white/5 text-orange-500" />
                        <span className="text-sm text-gray-300">Required option</span>
                    </label>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
                        <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Save</button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

function EditOptionValueModal({
    restaurantId,
    itemId,
    optionId,
    valueId,
    onClose,
}: {
    restaurantId: string
    itemId: string
    optionId: string
    valueId: string
    onClose: () => void
}) {
    const { data: values } = useMenuItemOptionValues(restaurantId, itemId, optionId)
    const current = values?.find((v) => v.id === valueId)
    const [name, setName] = useState(current?.name || '')
    const [priceModifier, setPriceModifier] = useState(current ? (current.price_modifier / 100).toString() : '')
    const [isDefault, setIsDefault] = useState(current?.is_default || false)
    const [sortOrder, setSortOrder] = useState(current?.sort_order || 0)

    const { showToast } = useToast()
    const updateValue = useUpdateOptionValue()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateValue.mutateAsync({
                restaurantId,
                itemId,
                optionId,
                valueId,
                data: {
                    name: name.trim(),
                    price_modifier: priceModifier ? Math.round(parseFloat(priceModifier) * 100) : undefined,
                    is_default: isDefault,
                    sort_order: sortOrder,
                },
            })
            showToast('success', 'Option value updated successfully')
            onClose()
        } catch {
            showToast('error', 'Failed to update option value')
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Edit Option Value</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Value Name *</label>
                        <input className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Price Modifier ($)</label>
                        <input type="number" step="0.01" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" value={priceModifier} onChange={(e) => setPriceModifier(e.target.value)} />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-white/5 text-orange-500" />
                        <span className="text-sm text-gray-300">Default selection</span>
                    </label>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
                        <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Save</button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
