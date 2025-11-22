'use client'

import React, { useMemo, useState } from 'react'
import { useRestaurants } from '@/hooks/useRestaurantQueries'
import { useRestaurantOrders, useUpdateOrderStatus, useOrderStatusHistory } from '@/hooks/useOrderQueries'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const ORDER_STATUSES = ['pending','confirmed','preparing','ready','picked_up','out_for_delivery','delivered','cancelled']

export default function OrdersPage() {
    const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants()
    const restaurantId = restaurants?.[0]?.id
    const [filter, setFilter] = useState<string>('pending')
    const { data: orders, isLoading: loadingOrders, refetch } = useRestaurantOrders(restaurantId || '', filter === 'all' ? undefined : filter)
    const updateStatus = useUpdateOrderStatus()
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const { data: history } = useOrderStatusHistory(selectedOrderId || '')

    const isLoading = loadingRestaurants || loadingOrders

    const canUpdateTo = (current: string) => {
        const map: Record<string,string[]> = {
            pending: ['confirmed','cancelled'],
            confirmed: ['preparing','cancelled'],
            preparing: ['ready','cancelled'],
            ready: ['picked_up'],
            picked_up: ['out_for_delivery','delivered'],
            out_for_delivery: ['delivered'],
        }
        return map[current] || []
    }

    const filtered = useMemo(() => orders || [], [orders])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Order Management</h1>
                    <p className="text-gray-400">Track and update order statuses</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                    {(['all','pending','confirmed','preparing','ready','picked_up','out_for_delivery','delivered','cancelled'] as const).map((s) => (
                        <button key={s} onClick={() => { setFilter(s) }} className={`px-3 py-1.5 rounded ${filter===s?'bg-orange-500 text-white':'text-gray-400 hover:text-white'}`}>{s.replace('_',' ')}</button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size="lg" /></div>
            ) : !restaurantId ? (
                <div className="p-8 bg-[#1A1A1A] border border-white/5 rounded-2xl text-center">
                    <p className="text-gray-400">Please create a restaurant to manage orders.</p>
                </div>
            ) : !filtered.length ? (
                <div className="p-8 bg-[#1A1A1A] border border-white/5 rounded-2xl text-center">
                    <p className="text-gray-400">No orders for this filter.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((o) => (
                        <div key={o.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-white font-semibold">#{o.order_number}</div>
                                    <div className="text-sm text-gray-400">Status: {o.status}</div>
                                    <div className="text-sm text-gray-400">Total: ${(o.total_amount/100).toFixed(2)}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {canUpdateTo(o.status).map((next) => (
                                        <button key={next} onClick={async ()=>{
                                            await updateStatus.mutateAsync({ orderId: o.id, data: { status: next as any } })
                                            setSelectedOrderId(o.id)
                                            refetch()
                                        }} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-white text-sm">{next.replace('_',' ')}</button>
                                    ))}
                                    <button onClick={()=>setSelectedOrderId(o.id)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-white text-sm">History</button>
                                </div>
                            </div>
                            {selectedOrderId===o.id && (
                                <div className="mt-3 p-3 bg-white/5 rounded">
                                    <div className="text-sm text-gray-300 mb-2">Status History</div>
                                    {!history?.length ? (
                                        <div className="text-xs text-gray-500">No history</div>
                                    ) : (
                                        <ul className="text-xs text-gray-400 space-y-1">
                                            {history.map((h)=> (
                                                <li key={h.id}>• {h.status} at {new Date(h.created_at).toLocaleString()}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
