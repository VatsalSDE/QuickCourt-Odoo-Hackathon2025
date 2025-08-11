"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PhoneVerification({ 
  phone, 
  userId, 
  onVerificationSuccess, 
  onVerificationError,
  onResendOTP 
}) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleVerification = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          otp: otp,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Phone number verified successfully!')
        if (onVerificationSuccess) {
          onVerificationSuccess(data)
        }
      } else {
        setError(data.message || 'OTP verification failed')
        if (onVerificationError) {
          onVerificationError(data.message)
        }
      }
    } catch (err) {
      const errorMsg = 'Network error. Please try again.'
      setError(errorMsg)
      if (onVerificationError) {
        onVerificationError(errorMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        if (onResendOTP) {
          onResendOTP(data)
        }
      } else {
        setError(data.message || 'Failed to resend OTP')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Verify Your Phone Number</CardTitle>
        <p className="text-center text-gray-600">We've sent a verification code to {phone}</p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
        <form onSubmit={handleVerification} className="space-y-6">
          <div>
            <Label htmlFor="otp">Enter 6-digit code</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              maxLength="6"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="mt-1 text-center text-2xl tracking-widest"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Phone Number"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-500 text-sm"
              onClick={handleResend}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Didn't receive the code? Resend"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
