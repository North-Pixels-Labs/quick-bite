// Restaurant Types
export interface Restaurant {
    id: string
    owner_id: string
    name: string
    description?: string
    cuisine_type: string
    phone: string
    email: string
    address_id: string
    logo_url?: string
    cover_image_url?: string
    rating: number
    total_reviews: number
    is_active: boolean
    is_verified: boolean
    verified_by?: string
    verified_at?: string
    delivery_fee: number
    minimum_order: number
    estimated_delivery_time: number
    operating_hours?: string
    has_own_delivery: boolean
    created_at: string
    updated_at: string
}

// Menu Types
export interface MenuCategory {
    id: string
    restaurant_id: string
    name: string
    description?: string
    sort_order: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface MenuItem {
    id: string
    restaurant_id: string
    category_id: string
    name: string
    description?: string
    price: number
    image_url?: string
    is_available: boolean
    is_vegetarian: boolean
    is_vegan: boolean
    is_gluten_free: boolean
    calories?: number
    preparation_time?: number
    ingredients?: string
    allergens?: string
    sort_order: number
    created_at: string
    updated_at: string
}

export interface MenuItemOption {
    id: string
    menu_item_id: string
    name: string
    type: 'single_select' | 'multi_select'
    is_required: boolean
    sort_order: number
    created_at: string
    updated_at: string
}

export interface MenuItemOptionValue {
    id: string
    option_id: string
    name: string
    price_modifier: number
    is_default: boolean
    sort_order: number
    created_at: string
    updated_at: string
}

// Staff Types
export interface RestaurantStaff {
    id: string
    restaurant_id: string
    user_id: string
    role: 'manager' | 'staff' | 'kitchen_staff'
    permissions?: string
    is_active: boolean
    hired_at: string
    created_by: string
    created_at: string
    updated_at: string
}

// Order Types
export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'picked_up'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'

export interface Order {
    id: string
    customer_id: string
    restaurant_id: string
    rider_id?: string
    order_number: string
    delivery_code: string
    qr_code: string
    status: OrderStatus
    delivery_address_id: string
    subtotal: number
    delivery_fee: number
    tax_amount: number
    tip_amount: number
    total_amount: number
    estimated_delivery_time?: string
    actual_delivery_time?: string
    special_instructions?: string
    confirmed_by?: string
    confirmed_at?: string
    ready_at?: string
    picked_up_at?: string
    delivered_at?: string
    delivery_confirmed_by?: string
    uses_platform_delivery: boolean
    created_at: string
    updated_at: string
}

export interface OrderItem {
    id: string
    order_id: string
    menu_item_id: string
    quantity: number
    unit_price: number
    total_price: number
    special_instructions?: string
    created_at: string
}

export interface OrderStatusHistory {
    id: string
    order_id: string
    status: string
    notes?: string
    updated_by?: string
    created_at: string
}

// Delivery Zone Types
export interface DeliveryZone {
    id: string
    restaurant_id: string
    zone_name: string
    polygon_coordinates: string
    delivery_fee_override?: number
    estimated_delivery_time?: number
    is_active: boolean
    created_at: string
    updated_at: string
}

// Analytics Types
export interface DailyAnalytics {
    id: string
    date: string
    restaurant_id?: string
    total_orders: number
    total_revenue: number
    average_order_value: number
    average_delivery_time: number
    cancellation_rate: number
    created_at: string
}

export interface WeeklyAnalytics extends DailyAnalytics {
    week_start: string
    week_end: string
}

export interface MonthlyAnalytics extends DailyAnalytics {
    month: string
    year: number
}

// API Request/Response Types
export interface CreateRestaurantRequest {
    name: string
    description?: string
    cuisine_type: string
    phone: string
    email: string
    address_id?: string
    street_address?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
    delivery_fee: number
    minimum_order: number
    estimated_delivery_time: number
    has_own_delivery: boolean
}

export interface UpdateRestaurantRequest {
    description?: string
    delivery_fee?: number
    minimum_order?: number
    estimated_delivery_time?: number
    operating_hours?: string
    is_active?: boolean
}

export interface CreateCategoryRequest {
    name: string
    description?: string
    sort_order: number
}

export interface CreateItemRequest {
    category_id: string
    name: string
    description?: string
    price: number
    image_url?: string
    is_vegetarian: boolean
    is_vegan: boolean
    is_gluten_free: boolean
    calories?: number
    preparation_time?: number
    ingredients?: string
    allergens?: string
    sort_order: number
}

export interface UpdateItemAvailabilityRequest {
    is_available: boolean
}

export interface UpdateItemPriceRequest {
    price: number
}

export interface CreateStaffRequest {
    user_id: string
    role: string
    permissions?: string
}

export interface RegisterStaffRequest {
    email: string
    phone: string
    password?: string
    first_name: string
    last_name: string
    role: 'manager' | 'staff' | 'kitchen_staff'
    permissions: string[]
}

export interface UpdateStaffRequest {
    role?: string
    permissions?: string
    is_active?: boolean
}

// Permission definitions for better UX
export interface StaffPermission {
    key: string
    label: string
    description: string
    defaultForRoles: string[]
}

export const STAFF_PERMISSIONS: StaffPermission[] = [
    {
        key: 'orders',
        label: 'Order Management',
        description: 'View and manage restaurant orders',
        defaultForRoles: ['manager', 'staff', 'kitchen_staff']
    },
    {
        key: 'menu',
        label: 'Menu Management',
        description: 'Create, edit, and manage menu items and categories',
        defaultForRoles: ['manager']
    },
    {
        key: 'zones',
        label: 'Delivery Zones',
        description: 'Manage delivery zones and settings',
        defaultForRoles: ['manager']
    },
    {
        key: 'staff',
        label: 'Staff Management',
        description: 'Add, edit, and manage staff members',
        defaultForRoles: ['manager']
    },
    {
        key: 'analytics',
        label: 'Analytics & Reports',
        description: 'View restaurant analytics and reports',
        defaultForRoles: ['manager']
    },
    {
        key: 'settings',
        label: 'Restaurant Settings',
        description: 'Modify restaurant settings and configuration',
        defaultForRoles: ['manager']
    }
]

export const STAFF_ROLES = [
    {
        value: 'staff',
        label: 'Staff',
        description: 'General staff member with basic permissions'
    },
    {
        value: 'kitchen_staff',
        label: 'Kitchen Staff',
        description: 'Kitchen staff focused on order preparation'
    },
    {
        value: 'manager',
        label: 'Manager',
        description: 'Manager with full access to restaurant operations'
    }
] as const

export interface CreateZoneRequest {
    zone_name: string
    polygon_coordinates: string
    delivery_fee_override?: number
    estimated_delivery_time?: number
    is_active?: boolean
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus
}

export interface OrderFilters {
    status?: OrderStatus
    start_date?: string
    end_date?: string
    search?: string
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface ApiError {
    success: false
    message: string
    error?: string
}
