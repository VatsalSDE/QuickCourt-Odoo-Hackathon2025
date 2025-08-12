import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { message: 'Missing payment verification data' },
        { status: 400 }
      )
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeySecret) {
      console.error('Razorpay key secret not found')
      return NextResponse.json(
        { message: 'Payment verification configuration error' },
        { status: 500 }
      )
    }

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      console.log('Payment verified successfully:', {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      })

      return NextResponse.json({
        message: 'Payment verified successfully',
        verified: true
      })
    } else {
      console.error('Payment verification failed:', {
        expected: expectedSignature,
        received: razorpay_signature
      })

      return NextResponse.json(
        { message: 'Payment verification failed' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { message: 'Payment verification error' },
      { status: 500 }
    )
  }
}