'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { authApi } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import { OTPInput } from './OTPInput'
import { useAuth } from '@/context/AuthContext'

type LoginMethod = 'phone' | 'email' | 'password'
type UserType = 'customer' | 'restaurant' | 'rider'

interface LoginFormProps {
    userType: UserType
    onSuccess?: () => void
}

export function LoginForm({ userType, onSuccess }: LoginFormProps) {
    const router = useRouter()
    const { login } = useAuth()
    const [method, setMethod] = useState<LoginMethod>('phone')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState<'input' | 'otp'>('input')
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        password: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (method === 'phone') {
                await authApi.sendLoginOTP(formData.phone, 'phone')
            } else {
                await authApi.sendLoginOTP(formData.email, 'email')
            }
            setStep('otp')
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (otp: string) => {
        setLoading(true)
        setError('')

        try {
            const identifier = method === 'phone' ? formData.phone : formData.email
            const response = await authApi.loginWithOTP(identifier, otp, method as 'phone' | 'email')
            handleLoginSuccess(response)
        } catch (err: any) {
            setError(err.message || 'Invalid OTP')
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await authApi.loginWithPassword(formData.email, formData.password)
            handleLoginSuccess(response)
        } catch (err: any) {
            setError(err.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    const handleLoginSuccess = (response: any) => {
        login(response.data.access_token, response.data.refresh_token, response.data.user)

        if (onSuccess) {
            onSuccess()
        } else {
            // Default redirects based on user type from backend
            const backendUserType = response.data.user.user_type
            const redirectMap: Record<string, string> = {
                customer: '/',
                restaurant_owner: '/dashboard/restaurant',
                restaurant_staff: '/dashboard/restaurant',
                rider: '/dashboard/rider'
            }
            router.push(redirectMap[backendUserType] || '/dashboard/restaurant')
        }
    }

    return (
        <div className="w-full space-y-6">
            {/* Method Tabs */}
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                <button
                    onClick={() => { setMethod('phone'); setStep('input'); setError('') }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${method === 'phone' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Phone OTP
                </button>
                <button
                    onClick={() => { setMethod('email'); setStep('input'); setError('') }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${method === 'email' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Email OTP
                </button>
                <button
                    onClick={() => { setMethod('password'); setStep('input'); setError('') }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${method === 'password' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Password
                </button>
            </div>

            <AnimatePresence mode="wait">
                {/* Phone Login */}
                {method === 'phone' && (
                    <motion.div
                        key="phone"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {step === 'input' ? (
                            <form onSubmit={handleSendOTP} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white placeholder-gray-500"
                                            placeholder="+233 XX XXX XXXX"
                                            required
                                        />
                                    </div>
                                </div>
                                {error && <div className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Code <ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6 text-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Verify Phone Number</h3>
                                    <p className="text-sm text-gray-400">Enter code sent to {formData.phone}</p>
                                </div>
                                <OTPInput onComplete={handleVerifyOTP} />
                                {loading && <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>}
                                {error && <div className="text-red-400 text-sm flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                <button onClick={() => setStep('input')} className="text-sm text-orange-400 hover:text-orange-300">Change phone number</button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Email Login */}
                {method === 'email' && (
                    <motion.div
                        key="email"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {step === 'input' ? (
                            <form onSubmit={handleSendOTP} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white placeholder-gray-500"
                                            placeholder="user@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                {error && <div className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Code <ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6 text-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Verify Email</h3>
                                    <p className="text-sm text-gray-400">Enter code sent to {formData.email}</p>
                                </div>
                                <OTPInput onComplete={handleVerifyOTP} />
                                {loading && <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>}
                                {error && <div className="text-red-400 text-sm flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                <button onClick={() => setStep('input')} className="text-sm text-orange-400 hover:text-orange-300">Change email</button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Password Login */}
                {method === 'password' && (
                    <motion.div
                        key="password"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <form onSubmit={handlePasswordLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white placeholder-gray-500"
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white placeholder-gray-500"
                                        placeholder="Enter password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="flex justify-end">
                                    <a href="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300">Forgot password?</a>
                                </div>
                            </div>
                            {error && <div className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
