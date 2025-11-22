import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export function assetUrl(path?: string) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const origin = API_URL.replace(/\/api\/v1$/, '')
  return `${origin}${path}`
}

export function wsUrl(path: string) {
  const origin = API_URL.replace(/\/api\/v1$/, '')
  const wsOrigin = origin.replace(/^http/, 'ws')
  return `${wsOrigin}${path}`
}
