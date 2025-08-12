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

    // Transform facilities to include address field for display
    const transformedFacilities = facilities.map(facility => ({
      ...facility,
      address: facility.address || 'Location not specified'
    }))

    // Get court count, earnings, and bookings for each facility
    const facilitiesWithStats = await Promise.all(
      transformedFacilities.map(async (facility) => {
        const courtCount = await db.collection('courts').countDocuments({
          venueId: facility._id.toString()
        })

        // Get total bookings for this facility
        const totalBookings = await db.collection('bookings').countDocuments({
          venueId: facility._id.toString()
        })

        // Get total earnings for this facility
        const earningsResult = await db.collection('bookings').aggregate([
          {
            $match: {
              venueId: facility._id.toString(),
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

        return {
          ...facility,
          courtCount,
          totalBookings,
          totalEarnings
        }
      })
    )

    await client.close()

    return NextResponse.json({
      facilities: facilitiesWithStats
    })

  } catch (error) {
    console.error('Error fetching facilities:', error)
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 })
  }
}
