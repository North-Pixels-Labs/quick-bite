'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    Save, 
    MapPin, 
    Clock, 
    DollarSign, 
    Truck, 
    Settings, 
    Image as ImageIcon,
    Loader2,
    CheckCircle
} from 'lucide-react'
import { useRestaurants, useUpdateRestaurant } from '@/hooks/useRestaurantQueries'
import { useDeliveryZones, useCreateDeliveryZone, useUpdateDeliveryZone } from '@/hooks/useDeliveryZoneQueries'
import { Restaurant, UpdateRestaurantRequest } from '@/types/restaurant.types'

const formatCurrency = (amount: number) => {
    return (amount / 100).toFixed(2)
}

const parseCurrency = (value: string) => {
    return Math.round(parseFloat(value || '0') * 100)
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general')
    const [formData, setFormData] = useState<UpdateRestaurantRequest>({})
    const [operatingHours, setOperatingHours] = useState({
        monday: { open: '09:00', close: '22:00', closed: false },
        tuesday: { open: '09:00', close: '22:00', closed: false },
        wednesday: { open: '09:00', close: '22:00', closed: false },
        thursday: { open: '09:00', close: '22:00', closed: false },
        friday: { open: '09:00', close: '22:00', closed: false },
        saturday: { open: '09:00', close: '22:00', closed: false },
        sunday: { open: '09:00', close: '22:00', closed: false },
    })

    // Fetch restaurants and get the first one
    const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants()
    const currentRestaurant = restaurants?.[0]
    
    const { data: deliveryZones, isLoading: loadingZones } = useDeliveryZones(currentRestaurant?.id || '')
    const updateRestaurant = useUpdateRestaurant()

    // Initialize form data when restaurant loads
    useEffect(() => {
        if (currentRestaurant) {
            setFormData({
                description: currentRestaurant.description || '',
                delivery_fee: currentRestaurant.delivery_fee,
                minimum_order: currentRestaurant.minimum_order,
                estimated_delivery_time: currentRestaurant.estimated_delivery_time,
                is_active: currentRestaurant.is_active,
            })

            // Parse operating hours if available
            if (currentRestaurant.operating_hours) {
                try {
                    const hours = JSON.parse(currentRestaurant.operating_hours)
                    setOperatingHours(prev => ({ ...prev, ...hours }))
                } catch (error) {
                    console.error('Failed to parse operating hours:', error)
                }
            }
        }
    }, [currentRestaurant])

    const handleSaveGeneral = async () => {
        if (!currentRestaurant) return

        try {
            const updateData: UpdateRestaurantRequest = {
                ...formData,
                operating_hours: JSON.stringify(operatingHours),
            }

            await updateRestaurant.mutateAsync({
                id: currentRestaurant.id,
                data: updateData
            })
        } catch (error) {
            console.error('Failed to update restaurant:', error)
        }
    }

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'delivery', label: 'Delivery', icon: Truck },
        { id: 'hours', label: 'Operating Hours', icon: Clock },
    ]

    if (loadingRestaurants) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    if (!currentRestaurant) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No restaurant found. Please create a restaurant first.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Restaurant Settings</h1>
                    <p className="text-gray-400">Manage your restaurant configuration and preferences</p>
                </div>
                {updateRestaurant.isSuccess && (
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm">Settings saved successfully</span>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-orange-500 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                {activeTab === 'general' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-lg font-semibold text-white mb-4">General Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Restaurant Name
                                </label>
                                <input
                                    type="text"
                                    value={currentRestaurant.name}
                                    disabled
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Restaurant name cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Cuisine Type
                                </label>
                                <input
                                    type="text"
                                    value={currentRestaurant.cuisine_type}
                                    disabled
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                rows={3}
                                placeholder="Describe your restaurant..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Delivery Fee (GHS)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formatCurrency(formData.delivery_fee || 0)}
                                    onChange={(e) => setFormData({ ...formData, delivery_fee: parseCurrency(e.target.value) })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Minimum Order (GHS)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formatCurrency(formData.minimum_order || 0)}
                                    onChange={(e) => setFormData({ ...formData, minimum_order: parseCurrency(e.target.value) })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Estimated Delivery Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={formData.estimated_delivery_time || ''}
                                    onChange={(e) => setFormData({ ...formData, estimated_delivery_time: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active || false}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 text-orange-500 bg-white/5 border-white/10 rounded focus:ring-orange-500"
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-300">
                                Restaurant is active and accepting orders
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveGeneral}
                                disabled={updateRestaurant.isPending}
                                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {updateRestaurant.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'hours' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-lg font-semibold text-white mb-4">Operating Hours</h2>
                        
                        <div className="space-y-4">
                            {Object.entries(operatingHours).map(([day, hours]) => (
                                <div key={day} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                                    <div className="w-24">
                                        <p className="text-sm font-medium text-white capitalize">{day}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 flex-1">
                                        <input
                                            type="checkbox"
                                            checked={!hours.closed}
                                            onChange={(e) => setOperatingHours(prev => ({
                                                ...prev,
                                                [day]: { ...prev[day as keyof typeof prev], closed: !e.target.checked }
                                            }))}
                                            className="w-4 h-4 text-orange-500 bg-white/5 border-white/10 rounded focus:ring-orange-500"
                                        />
                                        
                                        {!hours.closed ? (
                                            <>
                                                <input
                                                    type="time"
                                                    value={hours.open}
                                                    onChange={(e) => setOperatingHours(prev => ({
                                                        ...prev,
                                                        [day]: { ...prev[day as keyof typeof prev], open: e.target.value }
                                                    }))}
                                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                />
                                                <span className="text-gray-400">to</span>
                                                <input
                                                    type="time"
                                                    value={hours.close}
                                                    onChange={(e) => setOperatingHours(prev => ({
                                                        ...prev,
                                                        [day]: { ...prev[day as keyof typeof prev], close: e.target.value }
                                                    }))}
                                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                />
                                            </>
                                        ) : (
                                            <span className="text-gray-400">Closed</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveGeneral}
                                disabled={updateRestaurant.isPending}
                                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {updateRestaurant.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                <Save className="w-4 h-4" />
                                Save Hours
                            </button>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'delivery' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-lg font-semibold text-white mb-4">Delivery Zones</h2>
                        
                        {loadingZones ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                            </div>
                        ) : deliveryZones?.length ? (
                            <div className="space-y-4">
                                {deliveryZones.map((zone) => (
                                    <div key={zone.id} className="p-4 bg-white/5 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium text-white">{zone.zone_name}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                zone.is_active 
                                                    ? 'bg-green-500/20 text-green-400' 
                                                    : 'bg-red-500/20 text-red-400'
                                            }`}>
                                                {zone.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-400">Delivery Fee: </span>
                                                <span className="text-white">
                                                    {zone.delivery_fee_override 
                                                        ? formatCurrency(zone.delivery_fee_override) + ' GHS'
                                                        : 'Default'
                                                    }
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Est. Time: </span>
                                                <span className="text-white">
                                                    {zone.estimated_delivery_time 
                                                        ? zone.estimated_delivery_time + ' min'
                                                        : 'Default'
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-400 mb-4">No delivery zones configured</p>
                                <p className="text-sm text-gray-500">
                                    Delivery zones help you manage different areas with custom fees and delivery times.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
