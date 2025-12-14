import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { staffApi } from '@/lib/api'
import type { CreateStaffRequest, RegisterStaffRequest, UpdateStaffRequest } from '@/types/restaurant.types'

// Query keys
export const staffKeys = {
    all: ['staff'] as const,
    list: (restaurantId: string) => [...staffKeys.all, 'list', restaurantId] as const,
}

// Fetch staff list
export function useStaff(restaurantId: string) {
    return useQuery({
        queryKey: staffKeys.list(restaurantId),
        queryFn: async () => {
            const { data } = await staffApi.list(restaurantId)
            return data.data
        },
        enabled: !!restaurantId,
    })
}

// Create staff mutation (legacy - requires existing user)
export function useCreateStaff() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ restaurantId, data }: { restaurantId: string; data: CreateStaffRequest }) =>
            staffApi.create(restaurantId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: staffKeys.list(variables.restaurantId) })
        },
    })
}

// Register staff mutation (better UX - creates user and staff together)
export function useRegisterStaff() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ restaurantId, data }: { restaurantId: string; data: RegisterStaffRequest }) =>
            staffApi.register(restaurantId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: staffKeys.list(variables.restaurantId) })
        },
    })
}

// Update staff mutation
export function useUpdateStaff() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            restaurantId,
            staffId,
            data
        }: {
            restaurantId: string
            staffId: string
            data: UpdateStaffRequest
        }) => staffApi.update(restaurantId, staffId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: staffKeys.list(variables.restaurantId) })
        },
    })
}

// Delete staff mutation
export function useDeleteStaff() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            restaurantId,
            staffId
        }: {
            restaurantId: string
            staffId: string
        }) => staffApi.delete(restaurantId, staffId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: staffKeys.list(variables.restaurantId) })
        },
    })
}
