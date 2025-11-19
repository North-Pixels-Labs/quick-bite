'use client'

import React, { useRef, useState, useEffect } from 'react'

interface OTPInputProps {
    length?: number
    onComplete: (otp: string) => void
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete }) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    }, [])

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return

        const newOtp = [...otp]
        // Allow only one digit
        newOtp[index] = value.substring(value.length - 1)
        setOtp(newOtp)

        // Trigger onComplete if all fields are filled
        const combinedOtp = newOtp.join('')
        if (combinedOtp.length === length) {
            onComplete(combinedOtp)
        }

        // Move to next input if value is entered
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text/plain').slice(0, length)
        if (!/^\d+$/.test(pastedData)) return

        const newOtp = [...otp]
        pastedData.split('').forEach((char, index) => {
            if (index < length) newOtp[index] = char
        })
        setOtp(newOtp)

        if (pastedData.length === length) {
            onComplete(pastedData)
        }

        // Focus the last filled input or the next empty one
        const nextIndex = Math.min(pastedData.length, length - 1)
        inputRefs.current[nextIndex]?.focus()
    }

    return (
        <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }} // Correctly assign ref
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white"
                />
            ))}
        </div>
    )
}
