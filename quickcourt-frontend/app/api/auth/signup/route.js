import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'quickcourt'

export async function POST(request) {
  try {
    const { fullname, email, password, confirmPassword, role } = await request.json()

    // Validation
    if (!fullname || !email || !password || !confirmPassword || !role) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (!['user', 'facility_owner'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role selected' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db(dbName)
    const usersCollection = db.collection('users')

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      await client.close()
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user (inactive until email verification)
    const newUser = {
      fullname,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: false,
      emailVerified: false,
      profile: {
        avatar: null,
        phone: null,
        address: null,
        preferences: []
      }
    }

    const result = await usersCollection.insertOne(newUser)

    await client.close()

    // Send OTP for email verification
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), type: 'signup' })
      })
    } catch (otpError) {
      console.error('OTP sending error:', otpError)
    }

    return NextResponse.json(
      { 
        message: 'Account created successfully! Please check your email for verification code.',
        requiresVerification: true,
        email: email.toLowerCase()
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
