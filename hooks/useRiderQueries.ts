import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { riderApi } from '@/lib/api'

// Query keys
export const riderKeys = {
    all: ['rider'] as const,
    profile: () => [...riderKeys.all, 'profile'] as const,
    requests: () => [...riderKeys.all, 'requests'] as const,
    documents: () => [...riderKeys.all, 'documents'] as const,
    orders: () => [...riderKeys.all, 'orders'] as const,
    order: (id: string) => [...riderKeys.all, 'order', id] as const,
}

// Fetch rider profile
export function useRiderProfile() {
    return useQuery({
        queryKey: riderKeys.profile(),
        queryFn: async () => {
            const { data } = await riderApi.getProfile()
            return data.data
        },
    })
}

// Update online status
export function useUpdateRiderOnline() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (online: boolean) => riderApi.setOnline(online),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: riderKeys.profile() })
        },
    })
}

// Update availability
export function useUpdateRiderAvailability() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (available: boolean) => riderApi.setAvailability(available),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: riderKeys.profile() })
        },
    })
}

// Update location
export function useUpdateRiderLocation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ latitude, longitude }: { latitude: number; longitude: number }) =>
            riderApi.updateLocation(latitude, longitude),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: riderKeys.profile() })
        },
    })
}

// Fetch assignment requests
export function useRiderRequests() {
    return useQuery({
        queryKey: riderKeys.requests(),
        queryFn: async () => {
            const { data } = await riderApi.getRequests()
            return data.data
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    })
}

// Mark request as viewed
export function useMarkRequestViewed() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (requestId: string) => riderApi.markRequestViewed(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: riderKeys.requests() })
        },
    })
}

// Decline request
export function useDeclineRequest() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (requestId: string) => riderApi.declineRequest(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: riderKeys.requests() })
        },
    })
}

// Accept assignment
export function useAcceptAssignment() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (orderId: string) => riderApi.acceptAssignment(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: riderKeys.requests() })
            queryClient.invalidateQueries({ queryKey: riderKeys.orders() })
        },
    })
}

// Confirm delivery by code
export function useConfirmDeliveryByCode() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ orderId, code }: { orderId: string; code: string }) =>
            riderApi.confirmDeliveryByCode(orderId, code),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: riderKeys.order(variables.orderId) })
            queryClient.invalidateQueries({ queryKey: riderKeys.orders() })
        },
    })
}

// Confirm delivery by QR
export function useConfirmDeliveryByQr() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ orderId, qr }: { orderId: string; qr: string }) =>
            riderApi.confirmDeliveryByQr(orderId, qr),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: riderKeys.order(variables.orderId) })
            queryClient.invalidateQueries({ queryKey: riderKeys.orders() })
        },
    })
}

// Upload document
export function useUploadRiderDocument() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (formData: FormData) => riderApi.uploadDocument(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: riderKeys.documents() })
        },
    })
}

// Fetch rider documents
export function useRiderDocuments() {
    return useQuery({
        queryKey: riderKeys.documents(),
        queryFn: async () => {
            const { data } = await riderApi.getDocuments()
            return data.data
        },
    })
}

// Fetch active deliveries
export function useRiderActiveDeliveries() {
    return useQuery({
        queryKey: [...riderKeys.orders(), 'active'],
        queryFn: async () => {
            const { data } = await riderApi.getActiveDeliveries()
            return data.data
        },
    })
}

// Fetch earnings summary
export function useRiderEarningsSummary(params?: { period?: string; start?: string; end?: string }) {
    return useQuery({
        queryKey: [...riderKeys.all, 'earnings', params],
        queryFn: async () => {
            const { data } = await riderApi.getEarningsSummary(params)
            return data.data
        },
    })
}

// Fetch rider shifts
export function useRiderShifts() {
    return useQuery({
        queryKey: [...riderKeys.all, 'shifts'],
        queryFn: async () => {
            const { data } = await riderApi.getShifts()
            return data.data
        },
    })
}
