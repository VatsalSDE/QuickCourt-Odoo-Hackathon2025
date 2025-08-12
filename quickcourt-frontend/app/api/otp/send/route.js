import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'quickcourt'

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request) {
  try {
    const { email, type = 'signup' } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in database
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(dbName)
    const otpCollection = db.collection('otps')

    // Remove any existing OTPs for this email
    await otpCollection.deleteMany({ email: email.toLowerCase() })

    // Store new OTP
    await otpCollection.insertOne({
      email: email.toLowerCase(),
      otp,
      type,
      expiresAt,
      createdAt: new Date(),
      verified: false
    })

    await client.close()

    // Send OTP via email
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      })

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'QuickCourt - Email Verification OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">QuickCourt Email Verification</h2>
            <p>Hello,</p>
            <p>Thank you for signing up with QuickCourt! To complete your registration, please verify your email address using the OTP below:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              The QuickCourt Team
            </p>
          </div>
        `
      }

      await transporter.sendMail(mailOptions)
      console.log('OTP email sent successfully to:', email)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      console.log('OTP for testing:', otp)
      // Don't throw error, continue with OTP stored in DB
    }

    return NextResponse.json({
      message: 'OTP sent successfully to your email',
      success: true
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { message: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}