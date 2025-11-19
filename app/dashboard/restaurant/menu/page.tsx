'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Grid, List } from 'lucide-react'
import { useRestaurants } from '@/hooks/useRestaurantQueries'
import { useMenuCategories, useMenuItems } from '@/hooks/useMenuQueries'
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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    // Fetch restaurants and get the first one (assuming single restaurant for now)
    const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants()
    const restaurantId = restaurants?.[0]?.id

    // Fetch menu data
    const { data: categories, isLoading: loadingCategories } = useMenuCategories(restaurantId || '')
    const { data: items, isLoading: loadingItems } = useMenuItems(restaurantId || '')

    const isLoading = loadingRestaurants || loadingCategories || loadingItems

    // Filter items by search query
    const filteredItems = items?.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Group items by category
    const itemsByCategory = filteredItems?.reduce((acc, item) => {
        if (!acc[item.category_id]) {
            acc[item.category_id] = []
        }
        acc[item.category_id].push(item)
        return acc
    }, {} as Record<string, typeof items>)

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
                    <p className="text-gray-400">Manage your menu categories and items</p>
                </div>
                <div className="flex items-center gap-3">
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
                </div>
            </div>

            {/* Search and View Toggle */}
            <div className="flex items-center gap-4">
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
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
                            }`}
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
                    {categories
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((category) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <MenuCategoryCard category={category} restaurantId={restaurantId} />

                                {/* Items in this category */}
                                {itemsByCategory?.[category.id]?.length ? (
                                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                                        {itemsByCategory[category.id]
                                            .sort((a, b) => a.sort_order - b.sort_order)
                                            .map((item) => (
                                                <MenuItemCard
                                                    key={item.id}
                                                    item={item}
                                                    restaurantId={restaurantId}
                                                    viewMode={viewMode}
                                                />
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
