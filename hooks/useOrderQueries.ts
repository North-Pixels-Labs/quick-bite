import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '@/lib/api'
import type { UpdateOrderStatusRequest, OrderStatus } from '@/types/restaurant.types'

// Query keys
export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    list: (restaurantId: string, filters?: { status?: string }) => [...orderKeys.lists(), restaurantId, filters] as const,
    detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
    statusHistory: (id: string) => [...orderKeys.all, 'statusHistory', id] as const,
}

// Fetch restaurant orders
export function useRestaurantOrders(restaurantId: string, filters?: { status?: string }) {
    return useQuery({
        queryKey: orderKeys.list(restaurantId, filters),
        queryFn: async () => {
            const { data } = await orderApi.listRestaurantOrders(restaurantId, filters)
            return data.data
        },
        enabled: !!restaurantId,
    })
}

// Fetch single order details
export function useOrder(orderId: string) {
    return useQuery({
        queryKey: orderKeys.detail(orderId),
        queryFn: async () => {
            const { data } = await orderApi.getOrder(orderId)
            return data.data
        },
        enabled: !!orderId,
    })
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
        onSuccess: (response, variables) => {
            const updatedOrder = response.data.data
            
            // Update the specific order in cache
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) })
            queryClient.invalidateQueries({ queryKey: orderKeys.statusHistory(variables.orderId) })
            
            // Update restaurant orders list
            if (updatedOrder?.restaurant_id) {
                queryClient.invalidateQueries({ 
                    queryKey: orderKeys.lists(),
                    predicate: (query) => {
                        const [, , restaurantId] = query.queryKey
                        return restaurantId === updatedOrder.restaurant_id
                    }
                })
            }
        },
    })
}
