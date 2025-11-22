import React from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute allowedUserTypes={['restaurant_owner', 'restaurant_staff']}>
            <div className="min-h-screen bg-black text-white">
                <Sidebar />
                <Header />
                <main className="pl-64 pt-16 min-h-screen">
                    <div className="p-6 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
