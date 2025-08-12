import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export async function GET(request) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')
    
    // Get total users count by role
    const totalUsers = await db.collection('users').countDocuments()
    const adminUsers = await db.collection('users').countDocuments({ role: 'admin' })
    const facilityOwners = await db.collection('users').countDocuments({ role: 'facility_owner' })
    const regularUsers = await db.collection('users').countDocuments({ role: 'user' })
    
    // Get total facilities count by status
    const totalFacilities = await db.collection('venues').countDocuments()
    const approvedFacilities = await db.collection('venues').countDocuments({ status: 'approved' })
    const pendingFacilities = await db.collection('venues').countDocuments({ status: 'pending_approval' })
    const rejectedFacilities = await db.collection('venues').countDocuments({ status: 'rejected' })
    
    // Get total courts and bookings
    const totalCourts = await db.collection('courts').countDocuments()
    const totalBookings = await db.collection('bookings').countDocuments()
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const newUsersThisWeek = await db.collection('users').countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })
    const newBookingsThisWeek = await db.collection('bookings').countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })
    const newFacilitiesThisWeek = await db.collection('venues').countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })
    
    // Get revenue data (if available)
    const totalRevenue = await db.collection('bookings').aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: '$amount' } }
        }
      }
    ]).toArray()
    
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0
    
    await client.close()
    
    return NextResponse.json({
      stats: {
        totalUsers,
        adminUsers,
        facilityOwners,
        regularUsers,
        totalFacilities,
        approvedFacilities,
        pendingFacilities,
        rejectedFacilities,
        totalCourts,
        totalBookings,
        newUsersThisWeek,
        newBookingsThisWeek,
        newFacilitiesThisWeek,
        totalRevenue: revenue
      }
    })
    
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
