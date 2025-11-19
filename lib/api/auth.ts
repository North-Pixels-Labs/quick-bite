const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const authApi = {
    sendEmailOTP: async (email: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/email/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    verifyEmailOTP: async (email: string, otp: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/email/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    sendPhoneOTP: async (phone: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/phone/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    verifyPhoneOTP: async (phone: string, otp: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/phone/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, otp }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    registerRestaurant: async (data: any) => {
        // 1. Register User
        const registerRes = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: data.email,
                phone: data.phone,
                password: data.password,
                user_type: 'restaurant_owner'
            }),
        });

        if (!registerRes.ok) {
            const errorText = await registerRes.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error || 'Registration failed');
            } catch (e) {
                throw new Error(errorText || 'Registration failed');
            }
        }

        const registerData = await registerRes.json();
        const token = registerData.data.access_token;

        // 3. Create Restaurant Profile
        const restaurantRes = await fetch(`${API_BASE_URL}/restaurants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: data.restaurantName,
                cuisine_type: data.cuisineType || 'General', // Default if missing
                phone: data.phone,
                email: data.email,
                street_address: data.streetAddress,
                city: data.city,
                state: data.state,
                postal_code: data.postalCode,
                country: data.country,
                delivery_fee: 0,
                minimum_order: 0,
                estimated_delivery_time: 30,
                has_own_delivery: false
            })
        });

        if (!restaurantRes.ok) {
            const errorText = await restaurantRes.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error || 'Failed to create restaurant profile');
            } catch (e) {
                throw new Error(errorText || 'Failed to create restaurant profile');
            }
        }

        return restaurantRes.json();
    }
};
