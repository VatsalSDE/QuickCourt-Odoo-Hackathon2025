import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'quickcourt'

export async function POST(request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(dbName)
    const otpCollection = db.collection('otps')

    // Find the OTP record
    const otpRecord = await otpCollection.findOne({
      email: email.toLowerCase(),
      otp: otp.toString(),
      verified: false
    })

    if (!otpRecord) {
      await client.close()
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await client.close()
      return NextResponse.json(
        { message: 'OTP has expired' },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await otpCollection.updateOne(
      { _id: otpRecord._id },
      { 
        $set: { 
          verified: true,
          verifiedAt: new Date()
        }
      }
    )

    // If this is a signup OTP, activate the user account
    if (otpRecord.type === 'signup') {
      const usersCollection = db.collection('users')
      await usersCollection.updateOne(
        { email: email.toLowerCase() },
        { 
          $set: { 
            emailVerified: true,
            isActive: true,
            updatedAt: new Date()
          }
        }
      )
    }

    await client.close()

    return NextResponse.json({
      message: 'Email verified successfully',
      success: true
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { message: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}