import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, filters = {} } = body

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

    // Build the match query
    let matchQuery = {
      venueId: { $in: facilityIds }
    }

    // Add filters
    if (filters.status && filters.status !== 'all') {
      matchQuery.status = filters.status
    }

    if (filters.facility && filters.facility !== 'all') {
      const facilityObj = facilities.find(f => f._id.toString() === filters.facility)
      if (facilityObj) {
        matchQuery.venueId = facilityObj._id.toString()
      }
    }

    if (filters.dateFilter && filters.dateFilter !== 'all') {
      const today = new Date()
      const todayString = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`
      
      if (filters.dateFilter === 'today') {
        matchQuery.date = todayString
      }
    }

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
          userName: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
          userEmail: '$user.email',
          userPhone: '$user.phone',
          venueName: '$venue.name',
          courtName: '$courtInfo.name',
          sport: '$courtInfo.sport'
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray()

    // Apply additional date filtering for complex ranges
    let filteredBookings = bookings
    if (filters.dateFilter && filters.dateFilter !== 'all' && filters.dateFilter !== 'today') {
      filteredBookings = bookings.filter(booking => {
        try {
          const bookingDate = new Date(booking.date.split('/').reverse().join('-'))
          const today = new Date()
          
          switch (filters.dateFilter) {
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

    // Apply search filter if provided
    if (filters.searchQuery) {
      filteredBookings = filteredBookings.filter(booking => 
        booking.userName?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        booking.courtName?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        booking._id?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
    }

    // Generate CSV content
    const csvHeaders = [
      'Booking ID',
      'User Name',
      'User Email',
      'User Phone',
      'Facility',
      'Court',
      'Sport',
      'Date',
      'Time',
      'Status',
      'Payment Status',
      'Amount',
      'Booking Date'
    ]

    const csvRows = filteredBookings.map(booking => [
      booking._id.toString(),
      booking.userName || 'N/A',
      booking.userEmail || 'N/A',
      booking.userPhone || 'N/A',
      booking.venueName || 'N/A',
      booking.courtName || 'N/A',
      booking.sport || 'N/A',
      booking.date || 'N/A',
      `${booking.startTime} - ${booking.endTime}` || 'N/A',
      booking.status || 'N/A',
      booking.paymentStatus || 'N/A',
      booking.amount || 0,
      booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    await client.close()

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="bookings-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error('Error exporting bookings:', error)
    return NextResponse.json({ error: 'Failed to export bookings' }, { status: 500 })
  }
}
