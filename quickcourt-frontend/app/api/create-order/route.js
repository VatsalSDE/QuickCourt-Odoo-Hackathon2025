import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request) {
  try {
    const { amount } = await request.json()
    
    console.log('Create order request:', { amount, type: typeof amount })

    if (!amount || amount <= 0) {
      console.error('Invalid amount received:', amount)
      return NextResponse.json(
        { message: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Ensure amount is a number
    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error('Amount is not a valid number:', amount)
      return NextResponse.json(
        { message: 'Amount must be a valid positive number' },
        { status: 400 }
      )
    }
    
    // Razorpay amount limits (in paise)
    const amountInPaise = Math.round(numericAmount * 100)
    if (amountInPaise < 100) { // Less than ₹1
      console.error('Amount too small for Razorpay:', { amount: numericAmount, paise: amountInPaise })
      return NextResponse.json(
        { message: 'Amount must be at least ₹1' },
        { status: 400 }
      )
    }
    
    if (amountInPaise > 50000000) { // More than ₹5,00,000
      console.error('Amount too large for Razorpay:', { amount: numericAmount, paise: amountInPaise })
      return NextResponse.json(
        { message: 'Amount cannot exceed ₹5,00,000' },
        { status: 400 }
      )
    }

    // Check if Razorpay credentials are available
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not found')
      return NextResponse.json(
        { message: 'Payment gateway configuration error' },
        { status: 500 }
      )
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })

    // Create order with Razorpay
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    }

    const order = await razorpay.orders.create(options)
    
    console.log('Razorpay order created:', { 
      originalAmount: amount, 
      numericAmount, 
      amountInPaise: order.amount,
      orderId: order.id 
    })

    return NextResponse.json(order)

  } catch (error) {
    console.error('Error creating order:', error)
    
    // If Razorpay API fails, return a more specific error
    if (error.error && error.error.description) {
      return NextResponse.json(
        { message: error.error.description },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}