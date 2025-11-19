import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api'

// Query keys
export const analyticsKeys = {
    all: ['analytics'] as const,
    daily: (restaurantId: string, params?: { start_date?: string; end_date?: string }) =>
        [...analyticsKeys.all, 'daily', restaurantId, params] as const,
    weekly: (restaurantId: string, params?: { start_date?: string; end_date?: string }) =>
        [...analyticsKeys.all, 'weekly', restaurantId, params] as const,
    monthly: (restaurantId: string, params?: { year?: number; month?: number }) =>
        [...analyticsKeys.all, 'monthly', restaurantId, params] as const,
}

// Fetch daily analytics
export function useDailyAnalytics(
    restaurantId: string,
    params?: { start_date?: string; end_date?: string }
) {
    return useQuery({
        queryKey: analyticsKeys.daily(restaurantId, params),
        queryFn: async () => {
            const { data } = await analyticsApi.getDaily(restaurantId, params)
            return data.data
        },
        enabled: !!restaurantId,
    })
}

// Fetch weekly analytics
export function useWeeklyAnalytics(
    restaurantId: string,
    params?: { start_date?: string; end_date?: string }
) {
    return useQuery({
        queryKey: analyticsKeys.weekly(restaurantId, params),
        queryFn: async () => {
            const { data } = await analyticsApi.getWeekly(restaurantId, params)
            return data.data
        },
        enabled: !!restaurantId,
    })
}

// Fetch monthly analytics
export function useMonthlyAnalytics(
    restaurantId: string,
    params?: { year?: number; month?: number }
) {
    return useQuery({
        queryKey: analyticsKeys.monthly(restaurantId, params),
        queryFn: async () => {
            const { data } = await analyticsApi.getMonthly(restaurantId, params)
            return data.data
        },
        enabled: !!restaurantId,
    })
}
