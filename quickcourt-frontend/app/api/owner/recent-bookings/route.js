import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')

    // Get user's facilities
    const facilities = await db.collection('venues').find({ 
      ownerId: userId 
    }).toArray()

    const facilityIds = facilities.map(f => f._id.toString())

    // Get recent bookings for user's facilities
    const recentBookings = await db.collection('bookings')
      .find({
        venueId: { $in: facilityIds }
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    // Get court and venue details for each booking
    const enrichedBookings = await Promise.all(
      recentBookings.map(async (booking) => {
        const court = await db.collection('courts').findOne({ 
          _id: new ObjectId(booking.courtId) 
        })
        const venue = await db.collection('venues').findOne({ 
          _id: new ObjectId(booking.venueId) 
        })

        return {
          ...booking,
          courtName: court?.name || 'Unknown Court',
          venueName: venue?.name || 'Unknown Venue',
          courtType: court?.type || 'Unknown Type'
        }
      })
    )

    await client.close()

    return NextResponse.json({
      bookings: enrichedBookings
    })

  } catch (error) {
    console.error('Error fetching recent bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch recent bookings' }, { status: 500 })
  }
}
