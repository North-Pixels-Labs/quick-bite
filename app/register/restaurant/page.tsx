'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Lock, User, Store, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ParticleCanvas } from '@/components/ParticleCanvas'
import { OTPInput } from '@/components/auth/OTPInput'
import { authApi } from '@/lib/api/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Step = 'email' | 'email_otp' | 'phone' | 'phone_otp' | 'details' | 'success'

export default function RestaurantRegister() {
    const router = useRouter()
    const [step, setStep] = useState<Step>('email')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        restaurantName: '',
        ownerName: '',
        cuisineType: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    })

    // Step 1: Email
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await authApi.sendEmailOTP(formData.email)
            setStep('email_otp')
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleEmailVerify = async (otp: string) => {
        setLoading(true)
        setError('')
        try {
            await authApi.verifyEmailOTP(formData.email, otp)
            setStep('phone')
        } catch (err: any) {
            setError(err.message || 'Invalid OTP')
        } finally {
            setLoading(false)
        }
    }

    // Step 2: Phone
    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await authApi.sendPhoneOTP(formData.phone)
            setStep('phone_otp')
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handlePhoneVerify = async (otp: string) => {
        setLoading(true)
        setError('')
        try {
            await authApi.verifyPhoneOTP(formData.phone, otp)
            setStep('details')
        } catch (err: any) {
            setError(err.message || 'Invalid OTP')
        } finally {
            setLoading(false)
        }
    }

    // Step 3: Details & Final Registration
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        setLoading(true)
        setError('')
        try {
            await authApi.registerRestaurant({
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                // Additional fields would be handled by the backend or a separate profile update
                // For now, we just register the user. 
                // Ideally, we'd pass restaurant_name etc. if the API supports it, 
                // or redirect to an onboarding flow after login.
            })
            setStep('success')
            setTimeout(() => {
                router.push('/login/restaurant')
            }, 3000)
        } catch (err: any) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <ParticleCanvas />
            <Header />

            <div className="pt-24 pb-16 px-6 min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-600/10 rounded-3xl blur-xl" />

                        <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

                            {/* Progress Indicator */}
                            {step !== 'success' && (
                                <div className="flex justify-center mb-8 gap-2">
                                    {['email', 'phone', 'details'].map((s, i) => {
                                        const currentStepIndex = ['email', 'phone', 'details'].indexOf(s)
                                        const activeStepIndex = ['email', 'email_otp', 'phone', 'phone_otp', 'details'].indexOf(step)
                                        // Map sub-steps to main steps
                                        const mappedActiveIndex = activeStepIndex <= 1 ? 0 : activeStepIndex <= 3 ? 1 : 2

                                        return (
                                            <div key={s} className={`h-1 w-8 rounded-full transition-colors ${i <= mappedActiveIndex ? 'bg-orange-500' : 'bg-white/10'}`} />
                                        )
                                    })}
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {/* Step 1: Email */}
                                {step === 'email' && (
                                    <motion.form
                                        key="email"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleEmailSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="text-center mb-6">
                                            <h2 className="text-2xl font-bold mb-2">Let's start with your email</h2>
                                            <p className="text-gray-400">We'll send you a verification code.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
                                                    placeholder="restaurant@example.com"
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
                                    </motion.form>
                                )}

                                {/* Step 1.5: Email OTP */}
                                {step === 'email_otp' && (
                                    <motion.div
                                        key="email_otp"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6 text-center"
                                    >
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                                            <p className="text-gray-400">Enter the code sent to {formData.email}</p>
                                        </div>
                                        <OTPInput onComplete={handleEmailVerify} />
                                        {loading && <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>}
                                        {error && <div className="text-red-400 text-sm flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                        <button onClick={() => setStep('email')} className="text-sm text-orange-400 hover:text-orange-300">Change email</button>
                                    </motion.div>
                                )}

                                {/* Step 2: Phone */}
                                {step === 'phone' && (
                                    <motion.form
                                        key="phone"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handlePhoneSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="text-center mb-6">
                                            <h2 className="text-2xl font-bold mb-2">Add your phone number</h2>
                                            <p className="text-gray-400">We'll send a code to verify it.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
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
                                    </motion.form>
                                )}

                                {/* Step 2.5: Phone OTP */}
                                {step === 'phone_otp' && (
                                    <motion.div
                                        key="phone_otp"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6 text-center"
                                    >
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2">Check your phone</h2>
                                            <p className="text-gray-400">Enter the code sent to {formData.phone}</p>
                                        </div>
                                        <OTPInput onComplete={handlePhoneVerify} />
                                        {loading && <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>}
                                        {error && <div className="text-red-400 text-sm flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                        <button onClick={() => setStep('phone')} className="text-sm text-orange-400 hover:text-orange-300">Change phone number</button>
                                    </motion.div>
                                )}

                                {/* Step 3: Details */}
                                {step === 'details' && (
                                    <motion.form
                                        key="details"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleRegister}
                                        className="space-y-4"
                                    >
                                        <div className="text-center mb-6">
                                            <h2 className="text-2xl font-bold mb-2">Almost there!</h2>
                                            <p className="text-gray-400">Complete your profile to get started.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Restaurant Name</label>
                                                <div className="relative">
                                                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="restaurantName"
                                                        value={formData.restaurantName}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
                                                        placeholder="My Awesome Restaurant"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Cuisine Type</label>
                                                <input
                                                    type="text"
                                                    name="cuisineType"
                                                    value={formData.cuisineType}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
                                                    placeholder="e.g. Italian, Fast Food"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Owner Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="ownerName"
                                                    value={formData.ownerName}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Street Address</label>
                                            <input
                                                type="text"
                                                name="streetAddress"
                                                value={formData.streetAddress}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
                                                placeholder="123 Main St"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
                                                    placeholder="Accra"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">State/Region</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
                                                    placeholder="Greater Accra"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Postal Code</label>
                                                <input
                                                    type="text"
                                                    name="postalCode"
                                                    value={formData.postalCode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
                                                    placeholder="00233"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Country</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
                                                    placeholder="Ghana"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
                                                        placeholder="••••••••"
                                                        required
                                                        minLength={8}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-white"
                                                        placeholder="••••••••"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {error && <div className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 mt-4"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                                        </button>
                                    </motion.form>
                                )}

                                {/* Step 4: Success */}
                                {step === 'success' && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4">Registration Complete!</h2>
                                        <p className="text-gray-400 mb-8">Your account has been created successfully. Redirecting to login...</p>
                                        <Link href="/login/restaurant" className="text-orange-400 font-medium hover:text-orange-300">
                                            Click here if you are not redirected
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div >
            <Footer />
        </div >
    )
}
