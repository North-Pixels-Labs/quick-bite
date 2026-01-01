"use client"

import React from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SidebarProvider, useSidebar } from '@/context/SidebarContext'
import { motion } from "framer-motion"

export const dynamic = 'force-dynamic'

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar()

    return (
        <div className="relative flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content - with dynamic spacing for desktop sidebar */}
            <div
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
                    isCollapsed ? 'md:ml-16' : 'md:ml-64'
                }`}
            >
                {/* Top Bar */}
                <Header />

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="p-4 md:p-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute allowedUserTypes={['customer']}>
            <SidebarProvider>
                <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900">
                    {/* Background Pattern */}
                    <div className="fixed inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 20% 80%, #10b981 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, #059669 0%, transparent 50%),
                               radial-gradient(circle at 40% 40%, #047857 0%, transparent 50%)`
                        }} />
                    </div>
                    <DashboardContent>{children}</DashboardContent>
                </div>
            </SidebarProvider>
        </ProtectedRoute>
    )
}
