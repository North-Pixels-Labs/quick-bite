'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedUserTypes?: ('customer' | 'restaurant_owner' | 'rider')[]
    redirectTo?: string
}

export function ProtectedRoute({
    children,
    allowedUserTypes = ['customer', 'restaurant_owner', 'rider'],
    redirectTo
}: ProtectedRouteProps) {
    const { isAuthenticated, user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                // Redirect to login page based on the first allowed user type
                const loginPath = redirectTo || `/login/${allowedUserTypes[0]}`
                router.push(loginPath)
            } else if (user && !allowedUserTypes.includes(user.user_type)) {
                // User is authenticated but doesn't have the right user type
                // Redirect to their appropriate dashboard or home
                const userDashboard = user.user_type === 'customer'
                    ? '/'
                    : `/dashboard/${user.user_type}`
                router.push(userDashboard)
            }
        }
    }, [isAuthenticated, user, isLoading, router, allowedUserTypes, redirectTo])

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    // Don't render children if not authenticated or wrong user type
    if (!isAuthenticated || (user && !allowedUserTypes.includes(user.user_type))) {
        return null
    }

    return <>{children}</>
}
