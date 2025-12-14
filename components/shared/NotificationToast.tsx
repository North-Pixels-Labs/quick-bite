import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { Notification } from '@/hooks/useNotifications'

interface NotificationToastProps {
    notifications: Notification[]
    onRemove: (id: string) => void
}

const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
}

const colorMap = {
    success: 'border-green-500/50 bg-green-500/10 text-green-400',
    error: 'border-red-500/50 bg-red-500/10 text-red-400',
    warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
    info: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
}

export function NotificationToast({ notifications, onRemove }: NotificationToastProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {notifications.map((notification) => {
                    const Icon = iconMap[notification.type]
                    const colorClass = colorMap[notification.type]

                    return (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 300, scale: 0.3 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
                            className={`max-w-sm w-full backdrop-blur-xl border rounded-lg p-4 shadow-lg ${colorClass}`}
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="ml-3 w-0 flex-1">
                                    <p className="text-sm font-medium">
                                        {notification.title}
                                    </p>
                                    <p className="mt-1 text-sm opacity-90">
                                        {notification.message}
                                    </p>
                                </div>
                                <div className="ml-4 flex-shrink-0 flex">
                                    <button
                                        className="inline-flex rounded-md p-1.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
                                        onClick={() => onRemove(notification.id)}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}