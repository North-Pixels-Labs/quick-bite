import { useQuery } from '@tanstack/react-query'
import { discoveryApi, customerApi } from '@/lib/api'
import type { Restaurant } from '@/types/restaurant.types'

// Query keys
export const customerKeys = {
    all: ['customer'] as const,
    discovery: () => [...customerKeys.all, 'discovery'] as const,
    orders: () => [...customerKeys.all, 'orders'] as const,
    cart: () => [...customerKeys.all, 'cart'] as const,
    favorites: () => [...customerKeys.all, 'favorites'] as const,
    notifications: () => [...customerKeys.all, 'notifications'] as const,
    restaurantsByCity: (city: string) => [...customerKeys.discovery(), 'restaurants', 'city', city] as const,
    restaurantsNearby: (lat: number, lng: number, radius: number) => [...customerKeys.discovery(), 'restaurants', 'nearby', lat, lng, radius] as const,
    restaurantsNearMe: () => [...customerKeys.discovery(), 'restaurants', 'near-me'] as const,
}

// Discovery hooks
// Fetch restaurants by city
export function useRestaurantsByCity(city: string) {
    return useQuery({
        queryKey: customerKeys.restaurantsByCity(city),
        queryFn: async () => {
            const { data } = await discoveryApi.restaurantsByCity(city)
            return data.data
        },
        enabled: !!city,
    })
}

// Fetch restaurants nearby using coordinates
export function useRestaurantsNearby(lat: number, lng: number, radiusKm: number = 10) {
    return useQuery({
        queryKey: customerKeys.restaurantsNearby(lat, lng, radiusKm),
        queryFn: async () => {
            const { data } = await discoveryApi.restaurantsNearby(lat, lng, radiusKm)
            return data.data
        },
        enabled: lat !== 0 && lng !== 0,
    })
}

// Fetch restaurants near me (requires authentication)
export function useRestaurantsNearMe() {
    return useQuery({
        queryKey: customerKeys.restaurantsNearMe(),
        queryFn: async () => {
            const { data } = await discoveryApi.restaurantsNearMe()
            return data.data
        },
    })
}

// Customer-specific hooks
// Orders
export function useCustomerOrders() {
    return useQuery({
        queryKey: customerKeys.orders(),
        queryFn: async () => {
            const { data } = await customerApi.getOrders()
            return data.data
        },
    })
}

export function useCustomerOrder(orderId: string) {
    return useQuery({
        queryKey: [...customerKeys.orders(), orderId],
        queryFn: async () => {
            const { data } = await customerApi.getOrder(orderId)
            return data.data
        },
        enabled: !!orderId,
    })
}

export function useCustomerOrderStatusHistory(orderId: string) {
    return useQuery({
        queryKey: [...customerKeys.orders(), orderId, 'status-history'],
        queryFn: async () => {
            const { data } = await customerApi.getOrderStatusHistory(orderId)
            return data.data
        },
        enabled: !!orderId,
    })
}

// Cart
export function useCustomerCart() {
    return useQuery({
        queryKey: customerKeys.cart(),
        queryFn: async () => {
            const { data } = await customerApi.getCart()
            return data.data
        },
    })
}

// Favorites
export function useCustomerFavorites() {
    return useQuery({
        queryKey: customerKeys.favorites(),
        queryFn: async () => {
            const { data } = await customerApi.getFavorites()
            return data.data
        },
    })
}

// Notifications
export function useCustomerNotifications() {
    return useQuery({
        queryKey: customerKeys.notifications(),
        queryFn: async () => {
            const { data } = await customerApi.getNotifications()
            return data.data
        },
    })
}
