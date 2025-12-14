import apiClient from './apiClient'
import type {
    Restaurant,
    MenuCategory,
    MenuItem,
    MenuItemOption,
    MenuItemOptionValue,
    RestaurantStaff,
    Order,
    OrderStatusHistory,
    DeliveryZone,
    DailyAnalytics,
    WeeklyAnalytics,
    MonthlyAnalytics,
    CreateRestaurantRequest,
    UpdateRestaurantRequest,
    CreateCategoryRequest,
    CreateItemRequest,
    UpdateItemAvailabilityRequest,
    UpdateItemPriceRequest,
    CreateStaffRequest,
    UpdateStaffRequest,
    CreateZoneRequest,
    UpdateOrderStatusRequest,
    OrderFilters,
    ApiResponse,
} from '@/types/restaurant.types'

// Restaurant APIs
export const restaurantApi = {
    list: () =>
        apiClient.get<ApiResponse<Restaurant[]>>('/restaurants'),

    get: (id: string) =>
        apiClient.get<ApiResponse<Restaurant>>(`/restaurants/${id}`),

    create: (data: CreateRestaurantRequest) =>
        apiClient.post<ApiResponse<Restaurant>>('/restaurants', data),

    update: (id: string, data: UpdateRestaurantRequest) =>
        apiClient.put<ApiResponse<Restaurant>>(`/restaurants/${id}`, data),
}

// Menu Category APIs
export const menuCategoryApi = {
    list: (restaurantId: string) =>
        apiClient.get<ApiResponse<MenuCategory[]>>(`/restaurants/${restaurantId}/menu/categories`),

    create: (restaurantId: string, data: CreateCategoryRequest) =>
        apiClient.post<ApiResponse<MenuCategory>>(`/restaurants/${restaurantId}/menu/categories`, data),

    update: (restaurantId: string, categoryId: string, data: Partial<CreateCategoryRequest>) =>
        apiClient.put<ApiResponse<MenuCategory>>(`/restaurants/${restaurantId}/menu/categories/${categoryId}`, data),

    delete: (restaurantId: string, categoryId: string) =>
        apiClient.delete<ApiResponse<void>>(`/restaurants/${restaurantId}/menu/categories/${categoryId}`),
}

// Menu Item APIs
export const menuItemApi = {
    list: (restaurantId: string) =>
        apiClient.get<ApiResponse<MenuItem[]>>(`/restaurants/${restaurantId}/menu/items`),

    create: (restaurantId: string, data: CreateItemRequest) =>
        apiClient.post<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu/items`, data),

    update: (restaurantId: string, itemId: string, data: Partial<CreateItemRequest>) =>
        apiClient.put<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu/items/${itemId}`, data),

    delete: (restaurantId: string, itemId: string) =>
        apiClient.delete<ApiResponse<void>>(`/restaurants/${restaurantId}/menu/items/${itemId}`),

    updateAvailability: (restaurantId: string, itemId: string, data: UpdateItemAvailabilityRequest) =>
        apiClient.put<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu/items/${itemId}/availability`, data),

    updatePrice: (restaurantId: string, itemId: string, data: UpdateItemPriceRequest) =>
        apiClient.put<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu/items/${itemId}/price`, data),

    uploadImage: (restaurantId: string, itemId: string, file: File) => {
        const formData = new FormData()
        formData.append('image', file)
        return apiClient.post<ApiResponse<MenuItem>>(
            `/restaurants/${restaurantId}/menu/items/${itemId}/image`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
    },

    deleteImage: (restaurantId: string, itemId: string) =>
        apiClient.delete<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu/items/${itemId}/image`),
}

// Menu Item Option APIs
export const menuOptionApi = {
    listOptions: (restaurantId: string, itemId: string) =>
        apiClient.get<ApiResponse<MenuItemOption[]>>(`/restaurants/${restaurantId}/menu/items/${itemId}/options`),

    createOption: (restaurantId: string, itemId: string, data: { name: string; type: string; is_required: boolean; sort_order: number }) =>
        apiClient.post<ApiResponse<MenuItemOption>>(`/restaurants/${restaurantId}/menu/items/${itemId}/options`, data),

    updateOption: (restaurantId: string, itemId: string, optionId: string, data: Partial<{ name: string; type: string; is_required: boolean; sort_order: number }>) =>
        apiClient.put<ApiResponse<MenuItemOption>>(`/restaurants/${restaurantId}/menu/items/${itemId}/options/${optionId}`, data),

    deleteOption: (restaurantId: string, itemId: string, optionId: string) =>
        apiClient.delete<ApiResponse<void>>(`/restaurants/${restaurantId}/menu/items/${itemId}/options/${optionId}`),

    listValues: (restaurantId: string, itemId: string, optionId: string) =>
        apiClient.get<ApiResponse<MenuItemOptionValue[]>>(`/restaurants/${restaurantId}/menu/items/${itemId}/options/${optionId}/values`),

    createValue: (restaurantId: string, itemId: string, optionId: string, data: { name: string; price_modifier: number; is_default: boolean; sort_order: number }) =>
        apiClient.post<ApiResponse<MenuItemOptionValue>>(`/restaurants/${restaurantId}/menu/items/${itemId}/options/${optionId}/values`, data),

    updateValue: (restaurantId: string, itemId: string, optionId: string, valueId: string, data: Partial<{ name: string; price_modifier: number; is_default: boolean; sort_order: number }>) =>
        apiClient.put<ApiResponse<MenuItemOptionValue>>(`/restaurants/${restaurantId}/menu/items/${itemId}/options/${optionId}/values/${valueId}`, data),

    deleteValue: (restaurantId: string, itemId: string, optionId: string, valueId: string) =>
        apiClient.delete<ApiResponse<void>>(`/restaurants/${restaurantId}/menu/items/${itemId}/options/${optionId}/values/${valueId}`),
}

// Staff APIs
export const staffApi = {
    list: (restaurantId: string) =>
        apiClient.get<ApiResponse<RestaurantStaff[]>>(`/restaurants/${restaurantId}/staff`),

    create: (restaurantId: string, data: CreateStaffRequest) =>
        apiClient.post<ApiResponse<RestaurantStaff>>(`/restaurants/${restaurantId}/staff`, data),

    // Better UX: Register staff with user creation
    register: (restaurantId: string, data: RegisterStaffRequest) =>
        apiClient.post<ApiResponse<{ staff: RestaurantStaff; user: any }>>(`/restaurants/${restaurantId}/staff/register`, data),

    update: (restaurantId: string, staffId: string, data: UpdateStaffRequest) =>
        apiClient.put<ApiResponse<RestaurantStaff>>(`/restaurants/${restaurantId}/staff/${staffId}`, data),

    delete: (restaurantId: string, staffId: string) =>
        apiClient.delete<ApiResponse<void>>(`/restaurants/${restaurantId}/staff/${staffId}`),
}

// Delivery Zone APIs
export const deliveryZoneApi = {
    list: (restaurantId: string) =>
        apiClient.get<ApiResponse<DeliveryZone[]>>(`/restaurants/${restaurantId}/zones`),

    create: (restaurantId: string, data: CreateZoneRequest) =>
        apiClient.post<ApiResponse<DeliveryZone>>(`/restaurants/${restaurantId}/zones`, data),

    update: (restaurantId: string, zoneId: string, data: CreateZoneRequest) =>
        apiClient.put<ApiResponse<DeliveryZone>>(`/restaurants/${restaurantId}/zones/${zoneId}`, data),
}

// Order APIs
export const orderApi = {
    // Get restaurant orders
    listRestaurantOrders: (restaurantId: string, params?: { status?: string }) =>
        apiClient.get<ApiResponse<Order[]>>(`/restaurants/${restaurantId}/orders`, { params }),

    // Get single order details
    getOrder: (orderId: string) =>
        apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`),

    updateStatus: (orderId: string, data: UpdateOrderStatusRequest) =>
        apiClient.put<ApiResponse<Order>>(`/orders/${orderId}/status`, data),

    getStatusHistory: (orderId: string) =>
        apiClient.get<ApiResponse<OrderStatusHistory[]>>(`/orders/${orderId}/status-history`),
}

// Analytics APIs
export const analyticsApi = {
    aggregateDaily: (restaurantId: string) =>
        apiClient.post<ApiResponse<void>>(`/analytics/restaurants/${restaurantId}/aggregate/daily`),

    getDaily: (restaurantId: string, params?: { start_date?: string; end_date?: string }) =>
        apiClient.get<ApiResponse<DailyAnalytics[]>>(`/analytics/restaurants/${restaurantId}/daily`, { params }),

    aggregateWeekly: (restaurantId: string) =>
        apiClient.post<ApiResponse<void>>(`/analytics/restaurants/${restaurantId}/aggregate/weekly`),

    getWeekly: (restaurantId: string, params?: { start_date?: string; end_date?: string }) =>
        apiClient.get<ApiResponse<WeeklyAnalytics[]>>(`/analytics/restaurants/${restaurantId}/weekly`, { params }),

    aggregateMonthly: (restaurantId: string) =>
        apiClient.post<ApiResponse<void>>(`/analytics/restaurants/${restaurantId}/aggregate/monthly`),

    getMonthly: (restaurantId: string, params?: { year?: number; month?: number }) =>
        apiClient.get<ApiResponse<MonthlyAnalytics[]>>(`/analytics/restaurants/${restaurantId}/monthly`, { params }),
}
