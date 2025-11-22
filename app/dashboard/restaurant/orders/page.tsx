'use client'

import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useRestaurants } from '@/hooks/useRestaurantQueries'
import { useRestaurantOrders, useUpdateOrderStatus, useOrderStatusHistory, useOrderDetail, useNotifyRiders } from '@/hooks/useOrderQueries'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const ORDER_STATUSES = ['pending','confirmed','preparing','ready','picked_up','out_for_delivery','delivered','cancelled']

export default function OrdersPage() {
    const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants()
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null)
    const restaurantId = selectedRestaurantId || restaurants?.[0]?.id
    const [filter, setFilter] = useState<string>('pending')
    const { data: orders, isLoading: loadingOrders, refetch } = useRestaurantOrders(restaurantId || '', filter === 'all' ? undefined : filter)
    const updateStatus = useUpdateOrderStatus()
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const { data: history } = useOrderStatusHistory(selectedOrderId || '')
    const { data: orderDetail } = useOrderDetail(selectedOrderId || '')
    const notifyRiders = useNotifyRiders()

    const isLoading = loadingRestaurants || loadingOrders
    const [search, setSearch] = useState('')
    const [selectedIds, setSelectedIds] = useState<string[]>([])

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
    const searched = useMemo(() => filtered.filter(o => (
        o.order_number.toLowerCase().includes(search.toLowerCase())
    )), [filtered, search])

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Order Management</h1>
                        <p className="text-gray-400">Track and update order statuses</p>
                    </div>
                    <div>
                        <select value={restaurantId || ''} onChange={(e)=> setSelectedRestaurantId(e.target.value)} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white">
                            {(restaurants||[]).map(r=> (
                                <option key={r.id} value={r.id} className="bg-[#1A1A1A]">{r.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input value={search} onChange={(e)=> setSearch(e.target.value)} placeholder="Search by order #" className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                        {(['all','pending','confirmed','preparing','ready','picked_up','out_for_delivery','delivered','cancelled'] as const).map((s) => (
                            <button key={s} onClick={() => { setFilter(s) }} className={`px-3 py-1.5 rounded ${filter===s?'bg-orange-500 text-white':'text-gray-400 hover:text-white'}`}>{s.replace('_',' ')}</button>
                        ))}
                    </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {(['pending','preparing','ready'] as const).map((col) => (
                        <div key={col} className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                                <span className="text-sm font-semibold text-white">{col.replace('_',' ')}</span>
                                <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">{searched.filter(o=>o.status===col).length}</span>
                            </div>
                            <div className="p-3 space-y-3">
                                {searched.filter(o=>o.status===col).map((o)=> (
                                    <div key={o.id} className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-white font-semibold">#{o.order_number}</div>
                                                <div className="text-xs text-gray-500">Total ${(o.total_amount/100).toFixed(2)}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="flex items-center gap-1 text-gray-400 text-xs">
                                                    <input type="checkbox" checked={selectedIds.includes(o.id)} onChange={(e)=>{
                                                        setSelectedIds((ids)=> e.target.checked ? [...new Set([...ids, o.id])] : ids.filter(x=>x!==o.id))
                                                    }} /> Select
                                                </label>
                                                <button onClick={()=>setSelectedOrderId(o.id)} className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded text-white">History</button>
                                                <button onClick={async ()=>{ await notifyRiders.mutateAsync({ orderId: o.id }); }} className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded text-white">Notify</button>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                                            {canUpdateTo(o.status).map((next)=> (
                                                <button key={next} onClick={async ()=>{
                                                    await updateStatus.mutateAsync({ orderId: o.id, data: { status: next as any } })
                                                    setSelectedOrderId(o.id)
                                                    refetch()
                                                }} className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded text-xs">
                                                    {next.replace('_',' ')}
                                                </button>
                                            ))}
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
                                                {orderDetail?.items?.length ? (
                                                    <div className="mt-3">
                                                        <div className="text-sm text-gray-300 mb-2">Items</div>
                                                        <ul className="text-xs text-gray-400 space-y-1">
                                                            {orderDetail.items.map((di)=> (
                                                                <li key={di.item.id}>
                                                                    {di.item.quantity}× {di.item.menu_item_id}
                                                                    {di.options?.length ? (
                                                                        <span className="ml-2 text-gray-500">[options: {di.options.length}]</span>
                                                                    ) : null}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        {orderDetail.order.special_instructions && (
                                                            <div className="mt-2 text-xs text-gray-400">Notes: {orderDetail.order.special_instructions}</div>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {!searched.filter(o=>o.status===col).length && (
                                    <div className="p-6 text-center text-gray-500 bg-white/5 rounded-lg">No orders</div>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">Delivery</span>
                            <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">{searched.filter(o=>['picked_up','out_for_delivery'].includes(o.status)).length}</span>
                        </div>
                        <div className="p-3 space-y-3">
                            {searched.filter(o=>['picked_up','out_for_delivery'].includes(o.status)).map((o)=> (
                                <div key={o.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-white font-semibold">#{o.order_number}</div>
                                            <div className="text-xs text-gray-500">Total ${(o.total_amount/100).toFixed(2)}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={()=>setSelectedOrderId(o.id)} className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded text-white">History</button>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                                        {canUpdateTo(o.status).map((next)=> (
                                            <button key={next} onClick={async ()=>{
                                                await updateStatus.mutateAsync({ orderId: o.id, data: { status: next as any } })
                                                setSelectedOrderId(o.id)
                                                refetch()
                                            }} className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded text-xs">
                                                {next.replace('_',' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {!searched.filter(o=>['picked_up','out_for_delivery'].includes(o.status)).length && (
                                <div className="p-6 text-center text-gray-500 bg-white/5 rounded-lg">No orders</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">Completed</span>
                            <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">{searched.filter(o=>['delivered','cancelled'].includes(o.status)).length}</span>
                        </div>
                        <div className="p-3 space-y-3">
                            {searched.filter(o=>['delivered','cancelled'].includes(o.status)).map((o)=> (
                                <div key={o.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-white font-semibold">#{o.order_number}</div>
                                            <div className="text-xs text-gray-500">Total ${(o.total_amount/100).toFixed(2)}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={()=>setSelectedOrderId(o.id)} className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded text-white">History</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!searched.filter(o=>['delivered','cancelled'].includes(o.status)).length && (
                                <div className="p-6 text-center text-gray-500 bg-white/5 rounded-lg">No orders</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
