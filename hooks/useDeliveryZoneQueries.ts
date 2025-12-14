import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deliveryZoneApi } from '@/lib/api'
import type { CreateZoneRequest } from '@/types/restaurant.types'

// Query keys
export const deliveryZoneKeys = {
    all: ['deliveryZones'] as const,
    list: (restaurantId: string) => [...deliveryZoneKeys.all, 'list', restaurantId] as const,
}

// Fetch delivery zones
export function useDeliveryZones(restaurantId: string) {
    return useQuery({
        queryKey: deliveryZoneKeys.list(restaurantId),
        queryFn: async () => {
            const { data } = await deliveryZoneApi.list(restaurantId)
            return data.data
        },
        enabled: !!restaurantId,
    })
}

// Create delivery zone mutation
export function useCreateDeliveryZone() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ restaurantId, data }: { restaurantId: string; data: CreateZoneRequest }) =>
            deliveryZoneApi.create(restaurantId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: deliveryZoneKeys.list(variables.restaurantId) })
        },
    })
}

// Update delivery zone mutation
export function useUpdateDeliveryZone() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            restaurantId,
            zoneId,
            data
        }: {
            restaurantId: string
            zoneId: string
            data: CreateZoneRequest
        }) => deliveryZoneApi.update(restaurantId, zoneId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: deliveryZoneKeys.list(variables.restaurantId) })
        },
    })
}