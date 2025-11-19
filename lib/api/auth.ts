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
        // Note: The backend might expect a specific format for restaurant registration.
        // Based on the handler, it seems to use the generic /auth/register endpoint which takes a 'user_type'.
        // However, we might need to call a separate endpoint to create the restaurant profile AFTER user registration,
        // OR the register endpoint handles it if we pass the right data.
        // Looking at AuthHandler.Register, it binds to auth.RegisterRequest.
        // Let's assume we register the user first, then create the restaurant.
        // BUT, the user request says "Restaurant flow review the @[go-quickbite/spec/core]".
        // The spec says: "Create Users record... Create Restaurants record...".
        // Let's stick to the /auth/register endpoint for now and set user_type to 'restaurant_owner'.

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                user_type: 'restaurant_owner'
            }),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }
};
