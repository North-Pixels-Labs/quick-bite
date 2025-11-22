'use client'

import { useParams, useRouter } from 'next/navigation'
import { useRestaurants } from '@/hooks/useRestaurantQueries'
import { useMenuItems, useMenuItemOptions } from '@/hooks/useMenuQueries'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { assetUrl } from '@/lib/utils'

export default function ItemDetailsPage() {
  const params = useParams() as { itemId: string }
  const router = useRouter()
  const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants()
  const restaurantId = restaurants?.[0]?.id
  const { data: items, isLoading: loadingItems } = useMenuItems(restaurantId || '')
  const item = items?.find((i) => i.id === params.itemId)
  const { data: options, isLoading: loadingOptions } = useMenuItemOptions(restaurantId || '', params.itemId)

  if (loadingRestaurants || loadingItems) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!restaurantId || !item) {
    return (
      <div className="space-y-4">
        <p className="text-gray-400">Item not found.</p>
        <button onClick={() => router.push('/dashboard/restaurant/menu')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-white">Back to Menu</button>
      </div>
    )
  }

  const formatPrice = (p: number) => `$${(p / 100).toFixed(2)}`

  return (
    <div className="space-y-6">
      <div className="relative h-64 bg-white/5 rounded-xl overflow-hidden">
        {item.image_url ? (
          <img src={assetUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
        ) : null}
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{item.name}</h1>
          {item.description && <p className="text-gray-400 mt-2">{item.description}</p>}
        </div>
        <div className="text-3xl font-bold text-white">{formatPrice(item.price)}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {item.calories && (
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Calories</div>
            <div className="text-white font-semibold">{item.calories}</div>
          </div>
        )}
        {item.preparation_time && (
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Prep Time</div>
            <div className="text-white font-semibold">{item.preparation_time} min</div>
          </div>
        )}
      </div>

      {item.ingredients && (
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Ingredients</h3>
          <p className="text-gray-400">{item.ingredients}</p>
        </div>
      )}
      {item.allergens && (
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Allergens</h3>
          <p className="text-red-400">{item.allergens}</p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Customization Options</h3>
        {loadingOptions ? (
          <div className="flex items-center justify-center py-8"><LoadingSpinner /></div>
        ) : options && options.length ? (
          <div className="space-y-3">
            {options.map((opt) => (
              <div key={opt.id} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{opt.name}</span>
                  <span className="text-xs text-gray-400">{opt.type === 'single_select' ? 'Choose one' : 'Choose multiple'}</span>
                </div>
                {opt.is_required && <span className="text-xs text-orange-400">Required</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No options</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/dashboard/restaurant/menu')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-white">Back to Menu</button>
      </div>
    </div>
  )
}