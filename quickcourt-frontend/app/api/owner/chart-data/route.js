import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const period = searchParams.get('period') || 'weekly'

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

    // Get current date and calculate date ranges
    const now = new Date()
    let startDate, endDate, labels, groupBy

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        endDate = now
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        groupBy = { $dateToString: { format: "%a", date: "$createdAt" } }
        break
      case 'weekly':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 28)
        endDate = now
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        groupBy = { $week: "$createdAt" }
        break
      case 'monthly':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = now
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        groupBy = { $month: "$createdAt" }
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 28)
        endDate = now
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        groupBy = { $week: "$createdAt" }
    }

    // Get booking trends
    const bookingTrends = await db.collection('bookings').aggregate([
      {
        $match: {
          venueId: { $in: facilityIds },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray()

    // Get earnings data
    const earningsData = await db.collection('bookings').aggregate([
      {
        $match: {
          venueId: { $in: facilityIds },
          status: { $in: ['confirmed', 'completed'] },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray()

    // Get peak booking hours
    const peakHoursData = await db.collection('bookings').aggregate([
      {
        $match: {
          venueId: { $in: facilityIds }
        }
      },
      {
        $group: {
          _id: { $substr: ["$startTime", 0, 2] },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray()

    await client.close()

    // Process booking trends data
    const processedBookingTrends = labels.map((label, index) => {
      const trend = bookingTrends.find(t => {
        if (period === 'daily') {
          return t._id === label
        } else if (period === 'weekly') {
          return t._id === index + 1
        } else {
          return t._id === index + 1
        }
      })
      return {
        label,
        value: trend ? trend.count : 0
      }
    })

    // Process earnings data
    const processedEarningsData = labels.map((label, index) => {
      const earning = earningsData.find(e => {
        if (period === 'daily') {
          return e._id === label
        } else if (period === 'weekly') {
          return e._id === index + 1
        } else {
          return e._id === index + 1
        }
      })
      return {
        label,
        value: earning ? earning.total : 0
      }
    })

    // Process peak hours data
    const processedPeakHoursData = peakHoursData.map(hour => ({
      hour: `${hour._id}:00`,
      count: hour.count
    }))

    return NextResponse.json({
      bookingTrends: processedBookingTrends,
      earningsData: processedEarningsData,
      peakHoursData: processedPeakHoursData
    })

  } catch (error) {
    console.error('Error fetching chart data:', error)
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
  }
}
