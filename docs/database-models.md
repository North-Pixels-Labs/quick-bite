# QuickBite Database Models

This document outlines the database schema and models for the QuickBite food delivery platform.

## Overview

The QuickBite platform requires a robust database structure to handle multiple user types (customers, restaurants, riders), orders, payments, and real-time tracking. The models are designed to support scalability, data integrity, and efficient querying.

## Core Models

### 1. User Management

#### Users
**Purpose**: Base user model for authentication and common user data
- `id` (UUID, Primary Key)
- `email` (String, Unique, Required)
- `password_hash` (String, Optional) - Optional for OTP-only registration
- `phone` (String, Required) - Required for Ghana mobile money
- `user_type` (Enum: 'customer', 'restaurant_owner', 'restaurant_staff', 'rider', 'super_admin')
- `is_active` (Boolean, Default: true)
- `is_verified` (Boolean, Default: false)
- `email_verified_at` (Timestamp, Optional)
- `phone_verified_at` (Timestamp, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `last_login` (Timestamp, Optional)

#### EmailVerifications
**Purpose**: Handle email OTP verification during registration
- `id` (UUID, Primary Key)
- `email` (String, Required)
- `otp_code` (String, Required) - 6-digit OTP
- `expires_at` (Timestamp, Required)
- `verified_at` (Timestamp, Optional)
- `attempts` (Integer, Default: 0)
- `created_at` (Timestamp)

#### PhoneVerifications
**Purpose**: Handle phone OTP verification
- `id` (UUID, Primary Key)
- `phone` (String, Required)
- `otp_code` (String, Required) - 6-digit OTP
- `expires_at` (Timestamp, Required)
- `verified_at` (Timestamp, Optional)
- `attempts` (Integer, Default: 0)
- `created_at` (Timestamp)

#### UserProfiles
**Purpose**: Extended profile information for all user types
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → Users)
- `first_name` (String, Optional)
- `last_name` (String, Optional)
- `avatar_url` (String, Optional)
- `date_of_birth` (Date, Optional)
- `preferences` (JSON, Optional) - dietary restrictions, favorite cuisines, etc.
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 2. Location Management

#### Addresses
**Purpose**: Store delivery and pickup addresses
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → Users, Optional)
- `label` (String, Optional) - "Home", "Work", etc.
- `street_address` (String, Required)
- `apartment` (String, Optional)
- `city` (String, Required)
- `state` (String, Required)
- `postal_code` (String, Required)
- `country` (String, Required)
- `latitude` (Decimal, Optional)
- `longitude` (Decimal, Optional)
- `delivery_instructions` (Text, Optional)
- `is_default` (Boolean, Default: false)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 3. Restaurant Management

#### Restaurants
**Purpose**: Restaurant business information and settings
- `id` (UUID, Primary Key)
- `owner_id` (UUID, Foreign Key → Users)
- `name` (String, Required)
- `description` (Text, Optional)
- `cuisine_type` (String, Required)
- `phone` (String, Required)
- `email` (String, Required)
- `address_id` (UUID, Foreign Key → Addresses)
- `logo_url` (String, Optional)
- `cover_image_url` (String, Optional)
- `rating` (Decimal, Default: 0.0)
- `total_reviews` (Integer, Default: 0)
- `is_active` (Boolean, Default: true)
- `is_verified` (Boolean, Default: false)
- `verified_by` (UUID, Foreign Key → Users, Optional) - Super admin who verified
- `verified_at` (Timestamp, Optional)
- `delivery_fee` (Decimal, Default: 0.00)
- `minimum_order` (Decimal, Default: 0.00)
- `estimated_delivery_time` (Integer) - in minutes
- `operating_hours` (JSON) - weekly schedule
- `has_own_delivery` (Boolean, Default: false) - Restaurant has own delivery staff
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### RestaurantStaff
**Purpose**: Manage restaurant staff/sales persons with limited access
- `id` (UUID, Primary Key)
- `restaurant_id` (UUID, Foreign Key → Restaurants)
- `user_id` (UUID, Foreign Key → Users)
- `role` (Enum: 'manager', 'staff', 'kitchen_staff')
- `permissions` (JSON) - Specific permissions array
- `is_active` (Boolean, Default: true)
- `hired_at` (Timestamp, Required)
- `created_by` (UUID, Foreign Key → Users) - Restaurant owner who added them
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### MenuCategories
**Purpose**: Organize menu items into categories
- `id` (UUID, Primary Key)
- `restaurant_id` (UUID, Foreign Key → Restaurants)
- `name` (String, Required)
- `description` (Text, Optional)
- `sort_order` (Integer, Default: 0)
- `is_active` (Boolean, Default: true)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### MenuItems
**Purpose**: Individual food items available for order
- `id` (UUID, Primary Key)
- `restaurant_id` (UUID, Foreign Key → Restaurants)
- `category_id` (UUID, Foreign Key → MenuCategories)
- `name` (String, Required)
- `description` (Text, Optional)
- `price` (Decimal, Required)
- `image_url` (String, Optional)
- `is_available` (Boolean, Default: true)
- `is_vegetarian` (Boolean, Default: false)
- `is_vegan` (Boolean, Default: false)
- `is_gluten_free` (Boolean, Default: false)
- `calories` (Integer, Optional)
- `preparation_time` (Integer, Optional) - in minutes
- `ingredients` (JSON, Optional)
- `allergens` (JSON, Optional)
- `sort_order` (Integer, Default: 0)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### MenuItemOptions
**Purpose**: Customization options for menu items (size, extras, etc.)
- `id` (UUID, Primary Key)
- `menu_item_id` (UUID, Foreign Key → MenuItems)
- `name` (String, Required) - "Size", "Extras", "Spice Level"
- `type` (Enum: 'single_select', 'multi_select')
- `is_required` (Boolean, Default: false)
- `sort_order` (Integer, Default: 0)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### MenuItemOptionValues
**Purpose**: Specific values for menu item options
- `id` (UUID, Primary Key)
- `option_id` (UUID, Foreign Key → MenuItemOptions)
- `name` (String, Required) - "Large", "Extra Cheese", "Spicy"
- `price_modifier` (Decimal, Default: 0.00)
- `is_default` (Boolean, Default: false)
- `sort_order` (Integer, Default: 0)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 4. Rider Management

#### Riders
**Purpose**: Delivery rider information and status
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → Users)
- `license_number` (String, Optional) - Not all riders may have licenses
- `vehicle_type` (Enum: 'bicycle', 'motorcycle', 'car', 'walking')
- `vehicle_model` (String, Optional)
- `license_plate` (String, Optional)
- `is_online` (Boolean, Default: false)
- `is_available` (Boolean, Default: false)
- `current_latitude` (Decimal, Optional)
- `current_longitude` (Decimal, Optional)
- `rating` (Decimal, Default: 0.0)
- `total_deliveries` (Integer, Default: 0)
- `total_earnings` (Decimal, Default: 0.00)
- `verification_status` (Enum: 'pending', 'approved', 'rejected')
- `verified_by` (UUID, Foreign Key → Users, Optional) - Super admin who verified
- `verified_at` (Timestamp, Optional)
- `mobile_money_number` (String, Optional) - For payments
- `mobile_money_network` (Enum: 'mtn', 'vodafone', 'airtel', Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### RiderDocuments
**Purpose**: Store rider verification documents
- `id` (UUID, Primary Key)
- `rider_id` (UUID, Foreign Key → Riders)
- `document_type` (Enum: 'license', 'insurance', 'vehicle_registration')
- `document_url` (String, Required)
- `expiry_date` (Date, Optional)
- `verification_status` (Enum: 'pending', 'approved', 'rejected')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 5. Order Management

#### Orders
**Purpose**: Main order information and status tracking
- `id` (UUID, Primary Key)
- `customer_id` (UUID, Foreign Key → Users)
- `restaurant_id` (UUID, Foreign Key → Restaurants)
- `rider_id` (UUID, Foreign Key → Riders, Optional)
- `order_number` (String, Unique, Required)
- `delivery_code` (String, Required) - 4-digit delivery confirmation code
- `qr_code` (String, Required) - QR code for delivery confirmation
- `status` (Enum: 'pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled')
- `delivery_address_id` (UUID, Foreign Key → Addresses)
- `subtotal` (Decimal, Required)
- `delivery_fee` (Decimal, Required)
- `tax_amount` (Decimal, Required)
- `tip_amount` (Decimal, Default: 0.00)
- `total_amount` (Decimal, Required)
- `estimated_delivery_time` (Timestamp, Optional)
- `actual_delivery_time` (Timestamp, Optional)
- `special_instructions` (Text, Optional)
- `confirmed_by` (UUID, Foreign Key → Users, Optional) - Restaurant staff who confirmed
- `confirmed_at` (Timestamp, Optional)
- `ready_at` (Timestamp, Optional)
- `picked_up_at` (Timestamp, Optional)
- `delivered_at` (Timestamp, Optional)
- `delivery_confirmed_by` (Enum: 'code', 'qr_scan') - How delivery was confirmed
- `uses_platform_delivery` (Boolean, Default: true) - False if restaurant delivers own
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### OrderItems
**Purpose**: Individual items within an order
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → Orders)
- `menu_item_id` (UUID, Foreign Key → MenuItems)
- `quantity` (Integer, Required)
- `unit_price` (Decimal, Required)
- `total_price` (Decimal, Required)
- `special_instructions` (Text, Optional)
- `created_at` (Timestamp)

#### OrderItemOptions
**Purpose**: Selected options for order items
- `id` (UUID, Primary Key)
- `order_item_id` (UUID, Foreign Key → OrderItems)
- `option_value_id` (UUID, Foreign Key → MenuItemOptionValues)
- `price_modifier` (Decimal, Required)
- `created_at` (Timestamp)

#### OrderStatusHistory
**Purpose**: Track order status changes for transparency
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → Orders)
- `status` (String, Required)
- `notes` (Text, Optional)
- `updated_by` (UUID, Foreign Key → Users, Optional)
- `created_at` (Timestamp)

### 6. Payment Management

#### PaymentMethods
**Purpose**: Store customer payment methods (Ghana-focused)
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → Users)
- `type` (Enum: 'mobile_money', 'credit_card', 'debit_card', 'bank_transfer')
- `provider` (String, Required) - 'paystack', 'mtn_momo', 'vodafone_cash', 'airtel_money'
- `provider_payment_method_id` (String, Required)
- `phone_number` (String, Optional) - For mobile money
- `network` (Enum: 'mtn', 'vodafone', 'airtel', Optional) - Mobile money network
- `last_four_digits` (String, Optional) - For cards
- `expiry_month` (Integer, Optional)
- `expiry_year` (Integer, Optional)
- `cardholder_name` (String, Optional)
- `account_name` (String, Optional) - For mobile money
- `is_default` (Boolean, Default: false)
- `is_active` (Boolean, Default: true)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### Payments
**Purpose**: Track payment transactions
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → Orders)
- `payment_method_id` (UUID, Foreign Key → PaymentMethods)
- `amount` (Decimal, Required)
- `currency` (String, Default: 'USD')
- `status` (Enum: 'pending', 'processing', 'completed', 'failed', 'refunded')
- `provider_transaction_id` (String, Optional)
- `failure_reason` (Text, Optional)
- `processed_at` (Timestamp, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 7. Review and Rating System

#### Reviews
**Purpose**: Customer reviews for restaurants and riders
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → Orders)
- `reviewer_id` (UUID, Foreign Key → Users)
- `reviewee_type` (Enum: 'restaurant', 'rider')
- `reviewee_id` (UUID, Required) - Restaurant or Rider ID
- `rating` (Integer, Required) - 1-5 scale
- `comment` (Text, Optional)
- `is_anonymous` (Boolean, Default: false)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 8. Order Workflow Management

#### OrderNotifications
**Purpose**: Track notifications sent for order status changes
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → Orders)
- `recipient_id` (UUID, Foreign Key → Users)
- `recipient_type` (Enum: 'customer', 'restaurant', 'rider')
- `notification_type` (Enum: 'new_order', 'order_confirmed', 'order_ready', 'rider_assigned', 'picked_up', 'delivered')
- `channel` (Enum: 'in_app', 'sms', 'email', 'push')
- `status` (Enum: 'pending', 'sent', 'delivered', 'failed')
- `message` (Text, Required)
- `sent_at` (Timestamp, Optional)
- `delivered_at` (Timestamp, Optional)
- `created_at` (Timestamp)

#### RiderOrderRequests
**Purpose**: Track which riders were notified about available orders
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → Orders)
- `rider_id` (UUID, Foreign Key → Riders)
- `status` (Enum: 'sent', 'viewed', 'accepted', 'declined', 'expired')
- `sent_at` (Timestamp, Required)
- `responded_at` (Timestamp, Optional)
- `expires_at` (Timestamp, Required)
- `created_at` (Timestamp)

#### DeliveryConfirmations
**Purpose**: Log delivery confirmation attempts and methods
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → Orders)
- `rider_id` (UUID, Foreign Key → Riders)
- `confirmation_method` (Enum: 'code_entry', 'qr_scan')
- `code_entered` (String, Optional) - What the rider entered
- `is_successful` (Boolean, Required)
- `attempt_count` (Integer, Default: 1)
- `confirmed_at` (Timestamp, Optional)
- `created_at` (Timestamp)

### 9. Super Admin Management

#### SuperAdminActions
**Purpose**: Audit trail for super admin actions
- `id` (UUID, Primary Key)
- `admin_id` (UUID, Foreign Key → Users)
- `action_type` (Enum: 'verify_restaurant', 'verify_rider', 'suspend_user', 'approve_document', 'system_config')
- `target_type` (Enum: 'user', 'restaurant', 'rider', 'order', 'system')
- `target_id` (UUID, Optional)
- `details` (JSON, Optional) - Additional action details
- `ip_address` (String, Optional)
- `user_agent` (String, Optional)
- `created_at` (Timestamp)

#### SystemSettings
**Purpose**: Configurable system settings managed by super admin
- `id` (UUID, Primary Key)
- `key` (String, Unique, Required)
- `value` (Text, Required)
- `description` (Text, Optional)
- `data_type` (Enum: 'string', 'number', 'boolean', 'json')
- `is_public` (Boolean, Default: false) - Can be accessed by frontend
- `updated_by` (UUID, Foreign Key → Users)
- `updated_at` (Timestamp)
- `created_at` (Timestamp)

### 10. Location and Proximity

#### UserLocations
**Purpose**: Store user's saved locations with Ghana-specific addressing
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → Users)
- `label` (String, Optional) - "Home", "Work", "School"
- `address_line_1` (String, Required)
- `address_line_2` (String, Optional)
- `landmark` (String, Optional) - Important for Ghana addressing
- `area` (String, Optional) - Neighborhood/Area name
- `city` (String, Required)
- `region` (String, Required) - Ghana regions
- `latitude` (Decimal, Required)
- `longitude` (Decimal, Required)
- `is_default` (Boolean, Default: false)
- `delivery_instructions` (Text, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### DeliveryZones
**Purpose**: Define delivery coverage areas for restaurants
- `id` (UUID, Primary Key)
- `restaurant_id` (UUID, Foreign Key → Restaurants)
- `zone_name` (String, Required)
- `polygon_coordinates` (JSON, Required) - GeoJSON polygon
- `delivery_fee_override` (Decimal, Optional) - Zone-specific delivery fee
- `estimated_delivery_time` (Integer, Optional) - Zone-specific delivery time
- `is_active` (Boolean, Default: true)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 11. Notification System

#### Notifications
**Purpose**: Store and track user notifications
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → Users)
- `type` (Enum: 'order_update', 'promotion', 'system', 'reminder')
- `title` (String, Required)
- `message` (Text, Required)
- `data` (JSON, Optional) - Additional notification data
- `is_read` (Boolean, Default: false)
- `read_at` (Timestamp, Optional)
- `created_at` (Timestamp)

### 9. Promotional System

#### Promotions
**Purpose**: Manage discounts and promotional campaigns
- `id` (UUID, Primary Key)
- `code` (String, Unique, Optional)
- `name` (String, Required)
- `description` (Text, Optional)
- `type` (Enum: 'percentage', 'fixed_amount', 'free_delivery')
- `value` (Decimal, Required)
- `minimum_order_amount` (Decimal, Optional)
- `maximum_discount` (Decimal, Optional)
- `usage_limit` (Integer, Optional)
- `usage_count` (Integer, Default: 0)
- `user_usage_limit` (Integer, Optional)
- `applicable_to` (Enum: 'all', 'new_users', 'specific_restaurants')
- `start_date` (Timestamp, Required)
- `end_date` (Timestamp, Required)
- `is_active` (Boolean, Default: true)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### PromotionUsage
**Purpose**: Track promotion usage by users
- `id` (UUID, Primary Key)
- `promotion_id` (UUID, Foreign Key → Promotions)
- `user_id` (UUID, Foreign Key → Users)
- `order_id` (UUID, Foreign Key → Orders)
- `discount_amount` (Decimal, Required)
- `created_at` (Timestamp)

### 10. Analytics and Reporting

#### OrderAnalytics
**Purpose**: Store aggregated order data for reporting
- `id` (UUID, Primary Key)
- `date` (Date, Required)
- `restaurant_id` (UUID, Foreign Key → Restaurants, Optional)
- `rider_id` (UUID, Foreign Key → Riders, Optional)
- `total_orders` (Integer, Default: 0)
- `total_revenue` (Decimal, Default: 0.00)
- `average_order_value` (Decimal, Default: 0.00)
- `average_delivery_time` (Integer, Default: 0) - in minutes
- `cancellation_rate` (Decimal, Default: 0.00)
- `created_at` (Timestamp)

## Relationships Summary

### One-to-Many Relationships
- Users → UserProfiles
- Users → Addresses
- Users → Restaurants (owner)
- Users → PaymentMethods
- Users → Notifications
- Restaurants → MenuCategories
- Restaurants → MenuItems
- MenuCategories → MenuItems
- MenuItems → MenuItemOptions
- MenuItemOptions → MenuItemOptionValues
- Orders → OrderItems
- OrderItems → OrderItemOptions
- Orders → OrderStatusHistory
- Orders → Payments
- Orders → Reviews

### Many-to-Many Relationships
- Users ↔ Promotions (through PromotionUsage)

### Polymorphic Relationships
- Reviews can reference either Restaurants or Riders

## Indexing Strategy

### Primary Indexes
- All `id` fields (Primary Keys)
- All foreign key fields
- `email` in Users table (unique)
- `order_number` in Orders table (unique)
- `code` in Promotions table (unique)

### Performance Indexes
- `(restaurant_id, is_available)` on MenuItems
- `(customer_id, created_at)` on Orders
- `(rider_id, created_at)` on Orders
- `(status, created_at)` on Orders
- `(user_id, is_read)` on Notifications
- `(latitude, longitude)` on Addresses and Riders
- `(date, restaurant_id)` on OrderAnalytics

## Data Integrity Considerations

### Constraints
- Email uniqueness across Users
- Order number uniqueness
- Promotion code uniqueness (when not null)
- Rating values between 1-5
- Positive values for prices and amounts
- Valid enum values for status fields

### Cascading Rules
- Soft delete for Users (set is_active = false)
- Cascade delete for UserProfiles when User is deleted
- Restrict delete for Restaurants with active Orders
- Restrict delete for MenuItems referenced in OrderItems

## Security Considerations

### Sensitive Data
- Password hashes should use bcrypt or similar
- Payment method details should be tokenized
- PII should be encrypted at rest
- Audit trails for sensitive operations

### Access Control
- Row-level security for multi-tenant data
- API rate limiting by user type
- Role-based permissions for admin operations
- Data anonymization for analytics

## Scalability Considerations

### Partitioning Strategy
- Orders table by date (monthly partitions)
- OrderAnalytics by date (yearly partitions)
- Notifications by user_id (hash partitioning)

### Caching Strategy
- Restaurant and menu data (frequently accessed)
- User profiles and preferences
- Active promotions
- Real-time rider locations

### Archive Strategy
- Move completed orders older than 2 years to archive
- Compress old notification data
- Aggregate old analytics data into summary tables

This database design provides a solid foundation for the QuickBite platform while maintaining flexibility for future enhancements and scalability requirements.
## 
Field Explanations

### 1. cuisine_type (in Restaurants table)

**Purpose**: Categorizes restaurants by the type of food they serve for filtering and search functionality.

**Expected Values**:
- `"Italian"` - Pizza, pasta, risotto restaurants
- `"Chinese"` - Chinese takeout, dim sum, noodle houses
- `"Mexican"` - Tacos, burritos, Mexican grill
- `"Indian"` - Curry houses, tandoori, Indian street food
- `"American"` - Burgers, BBQ, comfort food
- `"Japanese"` - Sushi, ramen, Japanese cuisine
- `"Thai"` - Thai curry, pad thai, Thai street food
- `"Mediterranean"` - Greek, Middle Eastern, Lebanese
- `"Fast Food"` - Quick service chains
- `"Healthy"` - Salads, smoothies, health-focused
- `"Desserts"` - Ice cream, bakeries, sweet treats
- `"Coffee & Tea"` - Coffee shops, tea houses
- `"Breakfast"` - Breakfast and brunch spots
- `"Seafood"` - Fish, shellfish, ocean cuisine
- `"Vegetarian"` - Plant-based restaurants
- `"Fusion"` - Mixed or fusion cuisines

**Usage**:
- Customers can filter restaurants by cuisine type
- Search functionality can match cuisine preferences
- Analytics can track popular cuisine types by region
- Recommendation algorithms can suggest similar cuisines

### 2. delivery_fee (in Restaurants table)

**Purpose**: The base delivery charge that the restaurant sets for orders from their establishment.

**Expected Values**:
- `0.00` - Free delivery (promotional or restaurant absorbs cost)
- `2.99` - Standard low delivery fee
- `4.99` - Average delivery fee
- `7.99` - Higher delivery fee (premium restaurants or distant locations)
- `12.00` - Premium delivery fee (specialty items, long distance)

**Usage**:
- Added to the customer's total order cost
- Can vary by restaurant based on their business model
- May be waived during promotions or for orders above minimum_order
- Helps restaurants cover delivery logistics costs
- Displayed to customers before they place orders

**Business Logic**:
```
Total Order Cost = Subtotal + Delivery Fee + Tax + Tip
```

### 3. minimum_order (in Restaurants table)

**Purpose**: The minimum order value required before a customer can place an order from this restaurant.

**Expected Values**:
- `0.00` - No minimum order requirement
- `15.00` - Low minimum for casual dining
- `25.00` - Standard minimum for most restaurants
- `35.00` - Higher minimum for premium restaurants
- `50.00` - High minimum for specialty or bulk orders

**Usage**:
- Prevents small orders that aren't profitable for restaurants
- Encourages customers to order more items
- Helps restaurants maintain delivery efficiency
- Displayed prominently on restaurant pages
- Order validation prevents checkout below minimum

**Business Logic**:
```
if (order_subtotal < restaurant.minimum_order) {
    show_error("Minimum order is $" + minimum_order)
    disable_checkout()
}
```

### 4. sort_order (in MenuCategories table)

**Purpose**: Controls the display order of menu categories on the restaurant's menu page.

**Expected Values**:
- `0` - First category (usually "Popular" or "Featured")
- `10` - Second category (often "Appetizers" or "Starters")
- `20` - Third category (typically "Main Courses" or "Entrees")
- `30` - Fourth category (like "Sides" or "Salads")
- `40` - Fifth category (such as "Desserts")
- `50` - Last category (often "Beverages" or "Drinks")

**Usage**:
- Categories are displayed in ascending sort_order
- Allows restaurants to prioritize high-margin items
- Can be easily reordered without changing IDs
- Gaps in numbering (10, 20, 30) allow easy insertion of new categories

**Example Menu Structure**:
```
sort_order: 0  → "Chef's Specials"
sort_order: 10 → "Appetizers"
sort_order: 20 → "Pizza"
sort_order: 30 → "Pasta"
sort_order: 40 → "Salads"
sort_order: 50 → "Desserts"
sort_order: 60 → "Beverages"
```

### 5. sort_order (in MenuItems table)

**Purpose**: Controls the display order of individual menu items within their category.

**Expected Values**:
- `0` - First item in category (featured/popular item)
- `10` - Second item
- `20` - Third item
- `30` - Fourth item
- And so on...

**Usage**:
- Items displayed in ascending sort_order within each category
- Restaurants can highlight bestsellers or high-profit items first
- Seasonal items can be temporarily moved to top
- New items can be easily inserted without renumbering

**Example Within "Pizza" Category**:
```
sort_order: 0  → "Margherita Pizza" (most popular)
sort_order: 10 → "Pepperoni Pizza" (classic favorite)
sort_order: 20 → "Supreme Pizza" (high-margin item)
sort_order: 30 → "Vegetarian Pizza"
sort_order: 40 → "Hawaiian Pizza"
sort_order: 50 → "Meat Lovers Pizza"
```

**Best Practices for sort_order**:
- Use increments of 10 to allow easy insertion
- Lower numbers appear first
- Reserve 0 for featured/promoted items
- Update based on sales data and seasonality
- Consider customer preferences and profit margins

**Database Query Example**:
```sql
-- Get menu categories in display order
SELECT * FROM MenuCategories 
WHERE restaurant_id = ? AND is_active = true 
ORDER BY sort_order ASC

-- Get menu items within a category in display order
SELECT * FROM MenuItems 
WHERE category_id = ? AND is_available = true 
ORDER BY sort_order ASC
```

## Ghana-Specific Workflow Implementation

### 1. Customer Registration Flow

**Step 1: Email Collection & OTP**
```
1. Customer enters email
2. System generates 6-digit OTP and stores in EmailVerifications
3. OTP sent via email
4. Customer enters OTP for verification
5. Email marked as verified
```

**Step 2: Phone Number & OTP**
```
1. Customer enters phone number
2. System generates 6-digit SMS OTP and stores in PhoneVerifications
3. OTP sent via SMS
4. Customer enters OTP for verification
5. Phone marked as verified
```

**Step 3: Location Setup**
```
1. Request location permission OR
2. Manual location selection via map
3. Store in UserLocations with Ghana-specific fields (landmark, area, region)
```

### 2. Order Processing Workflow

**Order Placement**
```
1. Customer browses restaurants (prioritized by proximity)
2. Adds items to cart
3. Order created with unique delivery_code and qr_code
4. Payment processed via Paystack (Mobile Money/Card)
5. Order status: 'pending'
```

**Restaurant Notification & Confirmation**
```
1. OrderNotifications created for restaurant staff
2. Notifications sent via: in_app, SMS, email
3. Restaurant staff (RestaurantStaff) sees order in dashboard
4. Staff confirms order → status: 'confirmed'
5. Staff updates to preparing → status: 'preparing'
6. Staff marks ready → status: 'ready'
```

**Delivery Assignment Logic**
```
IF restaurant.has_own_delivery = true:
    - No rider notification needed
    - Restaurant handles delivery internally
ELSE:
    - Create RiderOrderRequests for available riders
    - Send notifications to nearby riders
    - First rider to accept gets the order
    - Order status: 'picked_up' when rider confirms pickup
```

**Delivery Confirmation**
```
1. Rider arrives at delivery location
2. Customer shows 4-digit delivery_code OR QR code
3. Rider enters code or scans QR
4. System validates in DeliveryConfirmations
5. If valid → Order status: 'delivered'
6. Delivery timestamp recorded
```

### 3. Multi-User Restaurant Management

**Restaurant Owner Setup**
```
1. Restaurant owner registers (user_type: 'restaurant_owner')
2. Creates restaurant profile
3. Awaits super admin verification
4. Once verified, can add menu items
```

**Staff Management**
```
1. Owner creates staff accounts (user_type: 'restaurant_staff')
2. Assigns roles: 'manager', 'staff', 'kitchen_staff'
3. Sets permissions in RestaurantStaff.permissions JSON
4. Staff can only see orders, cannot access financial data
```

**Permission Examples**:
```json
{
  "can_view_orders": true,
  "can_confirm_orders": true,
  "can_update_menu": false,
  "can_view_analytics": false,
  "can_manage_staff": false
}
```

### 4. Super Admin Functions

**Restaurant Verification**
```
1. Super admin reviews restaurant application
2. Verifies documents and business details
3. Updates restaurant.is_verified = true
4. Records action in SuperAdminActions
```

**Rider Verification**
```
1. Super admin reviews rider application and documents
2. Verifies identity and vehicle information
3. Updates rider.verification_status = 'approved'
4. Records action in SuperAdminActions
```

**System Management**
```
1. Configure delivery fees, tax rates via SystemSettings
2. Manage promotional campaigns
3. Monitor platform performance
4. Handle disputes and customer service escalations
```

### 5. Ghana Mobile Money Integration

**Supported Networks**
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money

**Payment Flow**
```
1. Customer selects Mobile Money payment
2. Enters phone number and network
3. Paystack initiates mobile money prompt
4. Customer approves on phone
5. Payment confirmed and order processed
```

**Rider Payments**
```
1. Riders receive earnings via mobile money
2. Weekly/daily payouts to rider.mobile_money_number
3. Payment history tracked in separate earnings table
```

### 6. Location-Based Features

**Restaurant Discovery**
```
1. Use customer's UserLocations.latitude/longitude
2. Calculate distance to restaurants
3. Filter by DeliveryZones coverage
4. Sort by proximity and rating
```

**Delivery Zone Management**
```
1. Restaurants define coverage areas using polygon coordinates
2. System checks if delivery address falls within zones
3. Applies zone-specific delivery fees and times
4. Prevents orders outside coverage areas
```

### 7. Notification Channels Priority

**Order Notifications Priority**:
1. **In-App**: Real-time dashboard updates
2. **SMS**: Critical status changes (confirmed, ready, delivered)
3. **Email**: Order confirmations and receipts
4. **Push**: Mobile app notifications

**Ghana-Specific Considerations**:
- SMS preferred for immediate notifications (high mobile penetration)
- WhatsApp integration for customer support
- Local language support (Twi, Ga, Ewe) for SMS templates

This enhanced database model supports the complete Ghana-focused workflow while maintaining scalability and data integrity.