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

    // Get total bookings for user's facilities
    const totalBookings = await db.collection('bookings').countDocuments({
      venueId: { $in: facilityIds }
    })

    // Get active courts count
    const activeCourts = await db.collection('courts').countDocuments({
      venueId: { $in: facilityIds },
      isActive: true
    })

    // Get total earnings
    const earningsResult = await db.collection('bookings').aggregate([
      {
        $match: {
          venueId: { $in: facilityIds },
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount' }
        }
      }
    ]).toArray()

    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0

    await client.close()

    return NextResponse.json({
      totalBookings,
      activeCourts,
      totalEarnings,
      totalFacilities: facilities.length
    })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
