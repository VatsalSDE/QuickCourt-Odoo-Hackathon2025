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

    // First get all facilities owned by the user
    const facilities = await db.collection('venues').find({ 
      ownerId: userId 
    }).toArray()

    const facilityIds = facilities.map(f => f._id.toString())

    // Get all courts for these facilities
    const courts = await db.collection('courts').find({
      venueId: { $in: facilityIds }
    }).toArray()

    // Get today's date in DD/MM/YYYY format
    const today = new Date()
    const todayString = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`

    // Enrich courts with venue names and today's stats
    const courtsWithStats = await Promise.all(
      courts.map(async (court) => {
        // Get venue name
        const venue = facilities.find(f => f._id.toString() === court.venueId)
        const venueName = venue ? venue.name : 'Unknown Facility'

        // Get today's bookings for this court
        const todayBookings = await db.collection('bookings').countDocuments({
          court: court._id.toString(),
          date: todayString,
          status: { $in: ['confirmed', 'completed'] }
        })

        // Get today's revenue for this court
        const todayRevenueResult = await db.collection('bookings').aggregate([
          {
            $match: {
              court: court._id.toString(),
              date: todayString,
              status: { $in: ['confirmed', 'completed'] }
            }
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$amount' }
            }
          }
        ]).toArray()

        const todayRevenue = todayRevenueResult.length > 0 ? todayRevenueResult[0].totalRevenue : 0

        return {
          ...court,
          venueName,
          bookingsToday: todayBookings,
          revenueToday: todayRevenue,
          isActive: court.status === 'Active'
        }
      })
    )

    await client.close()

    return NextResponse.json({
      courts: courtsWithStats
    })

  } catch (error) {
    console.error('Error fetching courts:', error)
    return NextResponse.json({ error: 'Failed to fetch courts' }, { status: 500 })
  }
}
