import { NextResponse } from 'next/server'

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

    // Generate a mock order ID for demo purposes
    // In production, you would integrate with Razorpay API to create actual orders
    // Razorpay expects order IDs to be unique and follow their format
    let orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Ensure the order ID is valid for Razorpay (max 40 characters)
    if (orderId.length > 40) {
      orderId = orderId.substring(0, 40);
    }
    
    const order = {
      id: orderId,
      amount: amountInPaise, // Already calculated and validated above
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      status: 'created',
      created_at: Date.now()
    }
    
    console.log('Order created:', { 
      originalAmount: amount, 
      numericAmount, 
      amountInPaise: order.amount,
      orderId: order.id 
    })

    return NextResponse.json(order)

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}