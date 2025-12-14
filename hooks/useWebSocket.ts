import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'

interface WebSocketMessage {
    type: string
    data: any
    timestamp: string
}

interface UseWebSocketOptions {
    url: string
    onMessage?: (message: WebSocketMessage) => void
    onConnect?: () => void
    onDisconnect?: () => void
    onError?: (error: Event) => void
    reconnectAttempts?: number
    reconnectInterval?: number
}

export function useWebSocket({
    url,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 3000
}: UseWebSocketOptions) {
    const [isConnected, setIsConnected] = useState(false)
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const reconnectCountRef = useRef(0)
    const { user } = useAuth()

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return
        }

        try {
            setConnectionStatus('connecting')
            
            // Add auth token to WebSocket URL if available
            const token = localStorage.getItem('access_token')
            const wsUrl = token ? `${url}?token=${token}` : url
            
            wsRef.current = new WebSocket(wsUrl)

            wsRef.current.onopen = () => {
                setIsConnected(true)
                setConnectionStatus('connected')
                reconnectCountRef.current = 0
                onConnect?.()
            }

            wsRef.current.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data)
                    onMessage?.(message)
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error)
                }
            }

            wsRef.current.onclose = () => {
                setIsConnected(false)
                setConnectionStatus('disconnected')
                onDisconnect?.()

                // Attempt to reconnect
                if (reconnectCountRef.current < reconnectAttempts) {
                    reconnectCountRef.current++
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect()
                    }, reconnectInterval)
                }
            }

            wsRef.current.onerror = (error) => {
                setConnectionStatus('error')
                onError?.(error)
            }
        } catch (error) {
            setConnectionStatus('error')
            console.error('WebSocket connection error:', error)
        }
    }, [url, onMessage, onConnect, onDisconnect, onError, reconnectAttempts, reconnectInterval])

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
            reconnectTimeoutRef.current = null
        }
        
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
        
        setIsConnected(false)
        setConnectionStatus('disconnected')
    }, [])

    const sendMessage = useCallback((message: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message))
            return true
        }
        return false
    }, [])

    useEffect(() => {
        if (user) {
            connect()
        }

        return () => {
            disconnect()
        }
    }, [user, connect, disconnect])

    return {
        isConnected,
        connectionStatus,
        sendMessage,
        connect,
        disconnect
    }
}

// Hook specifically for order updates
export function useOrderWebSocket(restaurantId: string, onOrderUpdate?: (order: any) => void) {
    const wsUrl = `ws://localhost:8080/api/v1/ws/orders/${restaurantId}`
    
    return useWebSocket({
        url: wsUrl,
        onMessage: (message) => {
            if (message.type === 'order_update') {
                onOrderUpdate?.(message.data)
            }
        },
        onConnect: () => {
            console.log('Connected to order WebSocket')
        },
        onDisconnect: () => {
            console.log('Disconnected from order WebSocket')
        },
        onError: (error) => {
            console.error('Order WebSocket error:', error)
        }
    })
}

// Hook for real-time notifications
export function useNotificationWebSocket(onNotification?: (notification: any) => void) {
    const wsUrl = 'ws://localhost:8080/api/v1/ws/notifications'
    
    return useWebSocket({
        url: wsUrl,
        onMessage: (message) => {
            if (message.type === 'notification') {
                onNotification?.(message.data)
            }
        }
    })
}