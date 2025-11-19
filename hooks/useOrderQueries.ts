import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '@/lib/api'
import type { UpdateOrderStatusRequest } from '@/types/restaurant.types'

// Query keys
export const orderKeys = {
    all: ['orders'] as const,
    detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
    statusHistory: (id: string) => [...orderKeys.all, 'statusHistory', id] as const,
}

// Fetch order status history
export function useOrderStatusHistory(orderId: string) {
    return useQuery({
        queryKey: orderKeys.statusHistory(orderId),
        queryFn: async () => {
            const { data } = await orderApi.getStatusHistory(orderId)
            return data.data
        },
        enabled: !!orderId,
    })
}

// Update order status mutation
export function useUpdateOrderStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ orderId, data }: { orderId: string; data: UpdateOrderStatusRequest }) =>
            orderApi.updateStatus(orderId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) })
            queryClient.invalidateQueries({ queryKey: orderKeys.statusHistory(variables.orderId) })
        },
    })
}
