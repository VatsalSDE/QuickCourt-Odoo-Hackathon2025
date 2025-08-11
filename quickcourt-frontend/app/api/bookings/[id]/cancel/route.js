import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'quickcourt'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db(dbName)
    const bookingsCollection = db.collection('bookings')

    // Find the booking and verify ownership
    const booking = await bookingsCollection.findOne({
      _id: new ObjectId(id),
      userId: userId.toString()
    })

    if (!booking) {
      await client.close()
      return NextResponse.json(
        { message: 'Booking not found or access denied' },
        { status: 404 }
      )
    }

    // Check if booking can be cancelled
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      await client.close()
      return NextResponse.json(
        { message: 'This booking cannot be cancelled' },
        { status: 400 }
      )
    }

    // Check if booking is within cancellation window (2 hours before)
    const bookingDateTime = new Date(`${booking.date}T${booking.startTime}`)
    const now = new Date()
    const twoHoursBefore = new Date(bookingDateTime.getTime() - (2 * 60 * 60 * 1000))
    
    if (now >= twoHoursBefore) {
      await client.close()
      return NextResponse.json(
        { message: 'Booking cannot be cancelled within 2 hours of start time' },
        { status: 400 }
      )
    }

    // Update booking status to cancelled
    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'cancelled',
          updatedAt: new Date()
        }
      }
    )

    await client.close()

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Failed to cancel booking' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Booking cancelled successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
