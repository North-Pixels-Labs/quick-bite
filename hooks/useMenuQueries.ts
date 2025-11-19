import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { menuCategoryApi, menuItemApi, menuOptionApi } from '@/lib/api'
import type {
    CreateCategoryRequest,
    CreateItemRequest,
    UpdateItemAvailabilityRequest,
    UpdateItemPriceRequest,
} from '@/types/restaurant.types'

// Query keys
export const menuKeys = {
    all: ['menu'] as const,
    categories: (restaurantId: string) => [...menuKeys.all, 'categories', restaurantId] as const,
    items: (restaurantId: string) => [...menuKeys.all, 'items', restaurantId] as const,
    options: (restaurantId: string, itemId: string) => [...menuKeys.all, 'options', restaurantId, itemId] as const,
    optionValues: (restaurantId: string, itemId: string, optionId: string) =>
        [...menuKeys.all, 'optionValues', restaurantId, itemId, optionId] as const,
}

// Fetch menu categories
export function useMenuCategories(restaurantId: string) {
    return useQuery({
        queryKey: menuKeys.categories(restaurantId),
        queryFn: async () => {
            const { data } = await menuCategoryApi.list(restaurantId)
            return data.data
        },
        enabled: !!restaurantId,
    })
}

// Fetch menu items
export function useMenuItems(restaurantId: string) {
    return useQuery({
        queryKey: menuKeys.items(restaurantId),
        queryFn: async () => {
            const { data } = await menuItemApi.list(restaurantId)
            return data.data
        },
        enabled: !!restaurantId,
    })
}

// Create category mutation
export function useCreateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ restaurantId, data }: { restaurantId: string; data: CreateCategoryRequest }) =>
            menuCategoryApi.create(restaurantId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: menuKeys.categories(variables.restaurantId) })
        },
    })
}

// Create item mutation
export function useCreateItem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ restaurantId, data }: { restaurantId: string; data: CreateItemRequest }) =>
            menuItemApi.create(restaurantId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: menuKeys.items(variables.restaurantId) })
        },
    })
}

// Update item availability mutation
export function useUpdateItemAvailability() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            restaurantId,
            itemId,
            data
        }: {
            restaurantId: string
            itemId: string
            data: UpdateItemAvailabilityRequest
        }) => menuItemApi.updateAvailability(restaurantId, itemId, data),
        onMutate: async ({ restaurantId, itemId, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: menuKeys.items(restaurantId) })

            // Snapshot previous value
            const previousItems = queryClient.getQueryData(menuKeys.items(restaurantId))

            // Optimistically update
            queryClient.setQueryData(menuKeys.items(restaurantId), (old: any) =>
                old?.map((item: any) =>
                    item.id === itemId ? { ...item, is_available: data.is_available } : item
                )
            )

            return { previousItems }
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousItems) {
                queryClient.setQueryData(menuKeys.items(variables.restaurantId), context.previousItems)
            }
        },
        onSettled: (_, __, variables) => {
            queryClient.invalidateQueries({ queryKey: menuKeys.items(variables.restaurantId) })
        },
    })
}

// Update item price mutation
export function useUpdateItemPrice() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            restaurantId,
            itemId,
            data
        }: {
            restaurantId: string
            itemId: string
            data: UpdateItemPriceRequest
        }) => menuItemApi.updatePrice(restaurantId, itemId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: menuKeys.items(variables.restaurantId) })
        },
    })
}

// Upload item image mutation
export function useUploadItemImage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            restaurantId,
            itemId,
            file
        }: {
            restaurantId: string
            itemId: string
            file: File
        }) => menuItemApi.uploadImage(restaurantId, itemId, file),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: menuKeys.items(variables.restaurantId) })
        },
    })
}

// Delete item image mutation
export function useDeleteItemImage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            restaurantId,
            itemId
        }: {
            restaurantId: string
            itemId: string
        }) => menuItemApi.deleteImage(restaurantId, itemId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: menuKeys.items(variables.restaurantId) })
        },
    })
}

// Fetch menu item options
export function useMenuItemOptions(restaurantId: string, itemId: string) {
    return useQuery({
        queryKey: menuKeys.options(restaurantId, itemId),
        queryFn: async () => {
            const { data } = await menuOptionApi.listOptions(restaurantId, itemId)
            return data.data
        },
        enabled: !!restaurantId && !!itemId,
    })
}

// Fetch option values
export function useMenuItemOptionValues(restaurantId: string, itemId: string, optionId: string) {
    return useQuery({
        queryKey: menuKeys.optionValues(restaurantId, itemId, optionId),
        queryFn: async () => {
            const { data } = await menuOptionApi.listValues(restaurantId, itemId, optionId)
            return data.data
        },
        enabled: !!restaurantId && !!itemId && !!optionId,
    })
}
