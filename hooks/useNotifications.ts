import { useState, useCallback } from 'react'

export interface Notification {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: Date
    duration?: number
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            duration: notification.duration || 5000
        }

        setNotifications(prev => [...prev, newNotification])

        // Auto remove after duration
        if (newNotification.duration > 0) {
            setTimeout(() => {
                removeNotification(newNotification.id)
            }, newNotification.duration)
        }

        return newNotification.id
    }, [])

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }, [])

    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    return {
        notifications,
        addNotification,
        removeNotification,
        clearAll
    }
}