'use client'

import { useParams, useRouter } from 'next/navigation'
import { useRestaurants } from '@/hooks/useRestaurantQueries'
import { useOrderDetail, useUpdateOrderStatus, useNotifyRiders, useOrderStatusHistory } from '@/hooks/useOrderQueries'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function OrderDetailsPage() {
  const params = useParams() as { orderId: string }
  const router = useRouter()
  const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants()
  const { data: detail, isLoading: loadingDetail } = useOrderDetail(params.orderId)
  const { data: history } = useOrderStatusHistory(params.orderId)
  const updateStatus = useUpdateOrderStatus()
  const notifyRiders = useNotifyRiders()

  if (loadingRestaurants || loadingDetail) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!detail?.order) {
    return (
      <div className="space-y-4">
        <p className="text-gray-400">Order not found.</p>
        <button onClick={() => router.push('/dashboard/restaurant/orders')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-white">Back to Orders</button>
      </div>
    )
  }

  const o = detail.order
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Order #{o.order_number}</h1>
          <p className="text-gray-400">Status: {o.status} • Total ${(o.total_amount/100).toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-2">
          {canUpdateTo(o.status).map((next)=>(
            <button key={next} onClick={async ()=>{ await updateStatus.mutateAsync({ orderId: o.id, data: { status: next as any } }) }} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-white text-sm">{next.replace('_',' ')}</button>
          ))}
          <button onClick={async ()=>{ await notifyRiders.mutateAsync({ orderId: o.id }) }} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-white text-sm">Notify Riders</button>
        </div>
      </div>

      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
        <div className="text-sm text-gray-300 mb-2">Items</div>
        <ul className="text-sm text-gray-400 space-y-1">
          {detail.items.map((di)=> (
            <li key={di.item.id}>
              {di.item.quantity}× {di.item.menu_item_id}
              {di.options?.length ? (
                <span className="ml-2 text-gray-500">[options: {di.options.length}]</span>
              ) : null}
            </li>
          ))}
        </ul>
        {o.special_instructions && (
          <div className="mt-2 text-sm text-gray-400">Notes: {o.special_instructions}</div>
        )}
      </div>

      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
        <div className="text-sm text-gray-300 mb-2">Timeline</div>
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

      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/dashboard/restaurant/orders')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-white">Back to Orders</button>
      </div>
    </div>
  )
}