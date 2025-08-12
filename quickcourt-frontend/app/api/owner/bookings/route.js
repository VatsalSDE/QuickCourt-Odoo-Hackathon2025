import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const facility = searchParams.get('facility')
    const dateFilter = searchParams.get('dateFilter')
    const searchQuery = searchParams.get('searchQuery')

    console.log('API Debug - userId:', userId)
    console.log('API Debug - status:', status)
    console.log('API Debug - facility:', facility)
    console.log('API Debug - dateFilter:', dateFilter)
    console.log('API Debug - searchQuery:', searchQuery)

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')

    // First get all facilities owned by the user
    const facilities = await db.collection('venues').find({ 
      ownerId: userId 
    }).toArray()

    console.log('API Debug - facilities found:', facilities.length)
    console.log('API Debug - facilities:', facilities.map(f => ({ id: f._id, name: f.name, ownerId: f.ownerId })))

    const facilityIds = facilities.map(f => f._id)

    // Build the match query
    let matchQuery = {
      venueId: { $in: facilityIds }
    }

    // Add status filter
    if (status && status !== 'all') {
      matchQuery.status = status
    }

    // Add facility filter
    if (facility && facility !== 'all') {
      const facilityObj = facilities.find(f => f._id.toString() === facility)
      if (facilityObj) {
        matchQuery.venueId = facilityObj._id
      }
    }

    // Add date filter
    if (dateFilter && dateFilter !== 'all') {
      const today = new Date()
      const todayString = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`
      
      switch (dateFilter) {
        case 'today':
          matchQuery.date = todayString
          break
        case 'upcoming':
          // For upcoming, we need to compare dates
          // This is a simplified approach - in production you might want to use proper date comparison
          break
        case 'past':
          // For past bookings, we need to compare dates
          // This is a simplified approach - in production you might want to use proper date comparison
          break
        case 'this-week':
          // For this week, we need to calculate the date range
          // This is a simplified approach - in production you might want to use proper date comparison
          break
      }
    }

    console.log('API Debug - matchQuery:', JSON.stringify(matchQuery, null, 2))

    // Get bookings with user and venue details
    const bookings = await db.collection('bookings').aggregate([
      {
        $match: matchQuery
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
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
        $lookup: {
          from: 'courts',
          localField: 'court',
          foreignField: '_id',
          as: 'courtInfo'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$venue',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$courtInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          userDetails: {
            name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
            email: '$user.email',
            phone: '$user.phone'
          },
          venueName: '$venue.name',
          courtName: '$courtInfo.name',
          sport: '$courtInfo.sport'
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray()

    console.log('API Debug - bookings found:', bookings.length)
    console.log('API Debug - sample booking:', bookings[0])

    // Apply search filter if provided
    let filteredBookings = bookings
    if (searchQuery) {
      filteredBookings = bookings.filter(booking => 
        booking.userDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.courtName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking._id?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply date filtering for complex date ranges
    if (dateFilter && dateFilter !== 'all' && dateFilter !== 'today') {
      filteredBookings = filteredBookings.filter(booking => {
        try {
          const bookingDate = new Date(booking.date.split('/').reverse().join('-'))
          const today = new Date()
          
          switch (dateFilter) {
            case 'upcoming':
              return bookingDate >= today
            case 'past':
              return bookingDate < today
            case 'this-week':
              const weekFromNow = new Date()
              weekFromNow.setDate(today.getDate() + 7)
              return bookingDate >= today && bookingDate <= weekFromNow
            default:
              return true
          }
        } catch (error) {
          console.error('Error parsing date:', error)
          return true
        }
      })
    }

    await client.close()

    console.log('API Debug - final filtered bookings:', filteredBookings.length)

    return NextResponse.json({
      bookings: filteredBookings,
      facilities: facilities.map(f => ({ _id: f._id, name: f.name }))
    })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
