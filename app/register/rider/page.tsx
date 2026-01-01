'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Lock, User, Bike, MapPin, ArrowRight, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ParticleCanvas } from '@/components/ParticleCanvas'
import { OTPInput } from '@/components/auth/OTPInput'
import { authApi } from '@/lib/api/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Step = 'email' | 'email_otp' | 'phone' | 'phone_otp' | 'details' | 'success'

export default function RiderRegister() {
    const router = useRouter()
    const [step, setStep] = useState<Step>('email')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        deliveryInstructions: '',
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
            await authApi.registerRider({
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                streetAddress: formData.streetAddress,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
                deliveryInstructions: formData.deliveryInstructions,
            })
            setStep('success')
            setTimeout(() => {
                router.push('/login/rider')
            }, 3000)
        } catch (err: any) {
            console.error('Registration error:', err)
            // Try to extract error message from different possible formats
            let errorMessage = 'Registration failed'
            if (err?.message) {
                errorMessage = err.message
            } else if (err?.error) {
                errorMessage = err.error
            } else if (typeof err === 'string') {
                errorMessage = err
            }
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <ParticleCanvas />
            <Header />

            <div className="pt-24 pb-16 px-6 min-h-screen flex items-center justify-center">
                <div className="max-w-3xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-3xl blur-xl" />

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
                                            <div key={s} className={`h-1 w-8 rounded-full transition-colors ${i <= mappedActiveIndex ? 'bg-blue-500' : 'bg-white/10'}`} />
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
                                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
                                                    placeholder="rider@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {error && <div className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
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
                                        {loading && <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>}
                                        {error && <div className="text-red-400 text-sm flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                        <button onClick={() => setStep('email')} className="text-sm text-blue-400 hover:text-blue-300">Change email</button>
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
                                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
                                                    placeholder="+233 XX XXX XXXX"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {error && <div className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
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
                                        {loading && <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>}
                                        {error && <div className="text-red-400 text-sm flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                        <button onClick={() => setStep('phone')} className="text-sm text-blue-400 hover:text-blue-300">Change phone number</button>
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
                                            <p className="text-gray-400">Complete your profile to start delivering.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">First Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
                                                        placeholder="John"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
                                                    placeholder="Doe"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Street Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="streetAddress"
                                                    value={formData.streetAddress}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
                                                    placeholder="123 Main St"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
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
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
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
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
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
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
                                                    placeholder="Ghana"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Delivery Instructions (Optional)</label>
                                            <textarea
                                                name="deliveryInstructions"
                                                value={formData.deliveryInstructions}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white resize-none"
                                                placeholder="Any special instructions for deliveries..."
                                                rows={3}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
                                                        placeholder="••••••••"
                                                        required
                                                        minLength={8}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
                                                        placeholder="••••••••"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {error && <div className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 mt-4"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Start Delivering <Bike className="w-4 h-4" /></>}
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
                                        <p className="text-gray-400 mb-8">Your rider account has been created successfully. Redirecting to login...</p>
                                        <Link href="/login/rider" className="text-blue-400 font-medium hover:text-blue-300">
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
