import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { restaurantApi } from '@/lib/api'
import type { CreateRestaurantRequest, UpdateRestaurantRequest } from '@/types/restaurant.types'

// Query keys
export const restaurantKeys = {
    all: ['restaurants'] as const,
    lists: () => [...restaurantKeys.all, 'list'] as const,
    list: (filters?: any) => [...restaurantKeys.lists(), filters] as const,
    details: () => [...restaurantKeys.all, 'detail'] as const,
    detail: (id: string) => [...restaurantKeys.details(), id] as const,
}

// Fetch all restaurants for the owner
export function useRestaurants() {
    return useQuery({
        queryKey: restaurantKeys.lists(),
        queryFn: async () => {
            const { data } = await restaurantApi.list()
            return data.data
        },
    })
}

// Fetch single restaurant
export function useRestaurant(id: string) {
    return useQuery({
        queryKey: restaurantKeys.detail(id),
        queryFn: async () => {
            const { data } = await restaurantApi.get(id)
            return data.data
        },
        enabled: !!id,
    })
}

// Create restaurant mutation
export function useCreateRestaurant() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateRestaurantRequest) => restaurantApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() })
        },
    })
}

// Update restaurant mutation
export function useUpdateRestaurant() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRestaurantRequest }) =>
            restaurantApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() })
        },
    })
}
