'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
    Plus, 
    Search, 
    Grid, 
    List, 
    CheckSquare, 
    Square, 
    Trash2, 
    Eye, 
    EyeOff, 
    Edit, 
    MoreHorizontal,
    X,
    Download
} from 'lucide-react'
import { useRestaurants } from '@/hooks/useRestaurantQueries'
import { 
    useMenuCategories, 
    useMenuItems, 
    useUpdateCategory, 
    useUpdateItem, 
    useUpdateItemAvailability,
    useDeleteItem 
} from '@/hooks/useMenuQueries'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import EmptyState from '@/components/shared/EmptyState'
import MenuCategoryCard from '@/components/restaurant/menu/MenuCategoryCard'
import MenuItemCard from '@/components/restaurant/menu/MenuItemCard'
import AddCategoryModal from '@/components/restaurant/menu/AddCategoryModal'
import AddItemModal from '@/components/restaurant/menu/AddItemModal'

export default function MenuPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddCategory, setShowAddCategory] = useState(false)
    const [showAddItem, setShowAddItem] = useState(false)
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
    const [bulkMode, setBulkMode] = useState(false)
    const [showBulkActions, setShowBulkActions] = useState(false)

    // Fetch restaurants and get the first one (assuming single restaurant for now)
    const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants()
    const restaurantId = restaurants?.[0]?.id

    // Fetch menu data
    const { data: categories, isLoading: loadingCategories } = useMenuCategories(restaurantId || '')
    const { data: items, isLoading: loadingItems } = useMenuItems(restaurantId || '')
    const updateCategory = useUpdateCategory()
    const updateItem = useUpdateItem()
    const updateItemAvailability = useUpdateItemAvailability()
    const deleteItem = useDeleteItem()

    const isLoading = loadingRestaurants || loadingCategories || loadingItems

    // Filter items by search query
    const filteredItems = items?.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Group items by category
    const itemsByCategory = filteredItems?.reduce((acc, item) => {
        const list = acc[item.category_id] ?? []
        list.push(item)
        acc[item.category_id] = list
        return acc
    }, {} as Record<string, typeof filteredItems>)

    const [dragCatId, setDragCatId] = useState<string | null>(null)
    const [dragItemId, setDragItemId] = useState<string | null>(null)

    const sortedCategories = useMemo(() => (categories || []).slice().sort((a, b) => a.sort_order - b.sort_order), [categories])

    // Bulk operations
    const handleSelectAll = () => {
        if (selectedItems.size === filteredItems?.length) {
            setSelectedItems(new Set())
        } else {
            setSelectedItems(new Set(filteredItems?.map(item => item.id) || []))
        }
    }

    const handleItemSelect = (itemId: string) => {
        const newSelected = new Set(selectedItems)
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId)
        } else {
            newSelected.add(itemId)
        }
        setSelectedItems(newSelected)
    }

    const handleBulkAvailability = async (isAvailable: boolean) => {
        if (!restaurantId) return
        
        const promises = Array.from(selectedItems).map(itemId =>
            updateItemAvailability.mutateAsync({
                restaurantId,
                itemId,
                data: { is_available: isAvailable }
            })
        )
        
        try {
            await Promise.all(promises)
            setSelectedItems(new Set())
            setBulkMode(false)
        } catch (error) {
            console.error('Bulk availability update failed:', error)
        }
    }

    const handleBulkDelete = async () => {
        if (!restaurantId) return
        
        if (confirm(`Are you sure you want to delete ${selectedItems.size} items? This action cannot be undone.`)) {
            const promises = Array.from(selectedItems).map(itemId =>
                deleteItem.mutateAsync({
                    restaurantId,
                    itemId
                })
            )
            
            try {
                await Promise.all(promises)
                setSelectedItems(new Set())
                setBulkMode(false)
            } catch (error) {
                console.error('Bulk delete failed:', error)
            }
        }
    }

    const exportMenuData = () => {
        if (!items || !categories) return

        const menuData = {
            restaurant_id: restaurantId,
            exported_at: new Date().toISOString(),
            categories: categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                description: cat.description,
                sort_order: cat.sort_order,
                is_active: cat.is_active
            })),
            items: items.map(item => ({
                id: item.id,
                category_id: item.category_id,
                name: item.name,
                description: item.description,
                price: item.price / 100, // Convert to cedis
                is_available: item.is_available,
                is_vegetarian: item.is_vegetarian,
                is_vegan: item.is_vegan,
                is_gluten_free: item.is_gluten_free,
                calories: item.calories,
                preparation_time: item.preparation_time,
                sort_order: item.sort_order
            }))
        }

        const blob = new Blob([JSON.stringify(menuData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `menu-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!restaurantId) {
        return (
            <EmptyState
                icon={Grid}
                title="No Restaurant Found"
                description="Please create a restaurant first to manage your menu."
            />
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Menu Management</h1>
                    <p className="text-gray-400">
                        Manage your menu categories and items
                        {selectedItems.size > 0 && ` • ${selectedItems.size} items selected`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedItems.size > 0 ? (
                        <>
                            <button
                                onClick={() => handleBulkAvailability(true)}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                Make Available
                            </button>
                            <button
                                onClick={() => handleBulkAvailability(false)}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <EyeOff className="w-4 h-4" />
                                Make Unavailable
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Selected
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedItems(new Set())
                                    setBulkMode(false)
                                }}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={exportMenuData}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export Menu
                            </button>
                            <button
                                onClick={() => setBulkMode(!bulkMode)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                    bulkMode 
                                        ? 'bg-orange-500 text-white' 
                                        : 'bg-white/5 hover:bg-white/10 text-white'
                                }`}
                            >
                                <CheckSquare className="w-4 h-4" />
                                Bulk Select
                            </button>
                            <button
                                onClick={() => setShowAddCategory(true)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Category
                            </button>
                            <button
                                onClick={() => setShowAddItem(true)}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Item
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Search and View Toggle */}
            <div className="flex items-center gap-4">
                {bulkMode && filteredItems && filteredItems.length > 0 && (
                    <button
                        onClick={handleSelectAll}
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {selectedItems.size === filteredItems.length ? (
                            <CheckSquare className="w-4 h-4 text-orange-400" />
                        ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-white">
                            Select All ({filteredItems.length})
                        </span>
                    </button>
                )}
                
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Categories and Items */}
            {!categories?.length ? (
                <EmptyState
                    icon={Grid}
                    title="No Categories Yet"
                    description="Create your first menu category to start adding items."
                    action={{
                        label: 'Add Category',
                        onClick: () => setShowAddCategory(true),
                    }}
                />
            ) : (
                <div className="space-y-8">
                    {sortedCategories.map((category) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                                draggable
                                onDragStart={() => setDragCatId(category.id)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={async () => {
                                    if (!dragCatId || dragCatId === category.id) return
                                    const fromIdx = sortedCategories.findIndex((c) => c.id === dragCatId)
                                    const toIdx = sortedCategories.findIndex((c) => c.id === category.id)
                                    if (fromIdx < 0 || toIdx < 0) return
                                    const reordered = sortedCategories.slice()
                                    const moved = reordered.splice(fromIdx, 1)[0]
                                    reordered.splice(toIdx, 0, moved)
                                    // assign sort_order in steps of 10
                                    for (let i = 0; i < reordered.length; i++) {
                                        const targetOrder = i * 10
                                        if (reordered[i].sort_order !== targetOrder) {
                                            await updateCategory.mutateAsync({ restaurantId: restaurantId!, categoryId: reordered[i].id, data: { sort_order: targetOrder } })
                                        }
                                    }
                                    setDragCatId(null)
                                }}
                            >
                                <MenuCategoryCard category={category} restaurantId={restaurantId} />

                                {/* Items in this category */}
                                {itemsByCategory?.[category.id]?.length ? (
                                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                                        {itemsByCategory[category.id]
                                            .slice()
                                            .sort((a, b) => a.sort_order - b.sort_order)
                                            .map((item) => (
                                                <div
                                                    key={item.id}
                                                    draggable
                                                    onDragStart={() => setDragItemId(item.id)}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={async () => {
                                                        if (!dragItemId || dragItemId === item.id) return
                                                        const list = itemsByCategory[category.id].slice().sort((a, b) => a.sort_order - b.sort_order)
                                                        const fromIdx = list.findIndex((it) => it.id === dragItemId)
                                                        const toIdx = list.findIndex((it) => it.id === item.id)
                                                        if (fromIdx < 0 || toIdx < 0) return
                                                        const reordered = list.slice()
                                                        const moved = reordered.splice(fromIdx, 1)[0]
                                                        reordered.splice(toIdx, 0, moved)
                                                        for (let i = 0; i < reordered.length; i++) {
                                                            const targetOrder = i * 10
                                                            if (reordered[i].sort_order !== targetOrder) {
                                                                await updateItem.mutateAsync({ restaurantId: restaurantId!, itemId: reordered[i].id, data: { sort_order: targetOrder } })
                                                            }
                                                        }
                                                        setDragItemId(null)
                                                    }}
                                                >
                                                    <MenuItemCard
                                                        item={item}
                                                        restaurantId={restaurantId}
                                                        viewMode={viewMode}
                                                        categories={categories}
                                                        bulkMode={bulkMode}
                                                        isSelected={selectedItems.has(item.id)}
                                                        onSelect={handleItemSelect}
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="p-8 bg-white/5 border border-white/5 rounded-xl text-center">
                                        <p className="text-gray-400 text-sm">No items in this category yet.</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                </div>
            )}

            {/* Modals */}
            {showAddCategory && (
                <AddCategoryModal
                    restaurantId={restaurantId}
                    onClose={() => setShowAddCategory(false)}
                />
            )}
            {showAddItem && (
                <AddItemModal
                    restaurantId={restaurantId}
                    categories={categories || []}
                    onClose={() => setShowAddItem(false)}
                />
            )}
        </div>
    )
}
