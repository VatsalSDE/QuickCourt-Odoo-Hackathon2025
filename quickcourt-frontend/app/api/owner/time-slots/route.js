import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const date = searchParams.get('date')
    const facilityId = searchParams.get('facilityId')
    const courtId = searchParams.get('courtId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')

    // First get all facilities owned by the user
    const facilities = await db.collection('venues').find({ 
      ownerId: userId 
    }).toArray()

    const facilityIds = facilities.map(f => f._id)

    // Build the match query for courts
    let courtMatchQuery = {
      venueId: { $in: facilityIds }
    }

    if (facilityId && facilityId !== 'all') {
      courtMatchQuery.venueId = new ObjectId(facilityId)
    }

    if (courtId && courtId !== 'all') {
      courtMatchQuery._id = new ObjectId(courtId)
    }

    // Get courts with venue details
    const courts = await db.collection('courts').aggregate([
      {
        $match: courtMatchQuery
      },
      {
        $lookup: {
          from: 'venues',
          localField: 'venueId',
          foreignField: '_id',
          as: 'venue'
        }
      },
      {
        $unwind: {
          path: '$venue',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          venueName: '$venue.name'
        }
      }
    ]).toArray()

    // Generate time slots (6 AM to 11 PM)
    const timeSlots = []
    for (let hour = 6; hour <= 23; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
    }

    // Get bookings for the selected date
    const dateString = date || new Date().toISOString().split('T')[0]
    const formattedDate = new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    const bookings = await db.collection('bookings').find({
      date: formattedDate,
      court: { $in: courts.map(c => c._id.toString()) }
    }).toArray()

    // Get maintenance schedules
    const maintenanceSchedules = await db.collection('maintenanceSchedules').find({
      date: formattedDate,
      courtId: { $in: courts.map(c => c._id.toString()) }
    }).toArray()

    // Build time slot data for each court
    const timeSlotData = {}
    
    courts.forEach(court => {
      timeSlotData[court._id.toString()] = {}
      
      timeSlots.forEach(time => {
        // Check if there's a booking for this time slot
        const booking = bookings.find(b => 
          b.court === court._id.toString() && 
          b.startTime === time
        )

        // Check if there's maintenance scheduled
        const maintenance = maintenanceSchedules.find(m => 
          m.courtId === court._id.toString() && 
          m.startTime === time
        )

        if (booking) {
          timeSlotData[court._id.toString()][time] = {
            status: 'booked',
            booking: {
              user: booking.userName || 'Unknown User',
              id: booking._id.toString(),
              userId: booking.userId
            }
          }
        } else if (maintenance) {
          timeSlotData[court._id.toString()][time] = {
            status: 'maintenance',
            maintenance: {
              reason: maintenance.reason,
              id: maintenance._id.toString()
            }
          }
        } else {
          timeSlotData[court._id.toString()][time] = {
            status: 'available',
            booking: null
          }
        }
      })
    })

    await client.close()

    return NextResponse.json({
      courts: courts.map(court => ({
        id: court._id.toString(),
        name: court.name,
        facility: court.venueName,
        facilityId: court.venueId.toString()
      })),
      facilities: facilities.map(f => ({
        id: f._id.toString(),
        name: f.name
      })),
      timeSlots,
      timeSlotData,
      selectedDate: formattedDate
    })

  } catch (error) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json({ error: 'Failed to fetch time slots' }, { status: 500 })
  }
}
