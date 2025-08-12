import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')

    // Check if we can connect to the database
    const bookingsCount = await db.collection('bookings').countDocuments()
    const venuesCount = await db.collection('venues').countDocuments()
    const usersCount = await db.collection('users').countDocuments()
    const courtsCount = await db.collection('courts').countDocuments()

    // Get a sample booking to see the structure
    const sampleBooking = await db.collection('bookings').findOne()
    
    // Get a sample venue to see the structure
    const sampleVenue = await db.collection('venues').findOne()

    await client.close()

    return NextResponse.json({
      success: true,
      counts: {
        bookings: bookingsCount,
        venues: venuesCount,
        users: usersCount,
        courts: courtsCount
      },
      sampleBooking,
      sampleVenue
    })

  } catch (error) {
    console.error('Error testing database:', error)
    return NextResponse.json({ 
      error: 'Failed to test database',
      details: error.message 
    }, { status: 500 })
  }
}
