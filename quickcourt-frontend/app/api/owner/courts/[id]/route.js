import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 })
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')

    // Check if court exists and belongs to the user's venue
    const court = await db.collection('courts').findOne({
      _id: new ObjectId(id)
    })

    if (!court) {
      await client.close()
      return NextResponse.json({ 
        error: 'Court not found' 
      }, { status: 404 })
    }

    // Verify that the venue belongs to the user
    const venue = await db.collection('venues').findOne({
      _id: new ObjectId(court.venueId),
      ownerId: userId
    })

    if (!venue) {
      await client.close()
      return NextResponse.json({ 
        error: 'Access denied' 
      }, { status: 403 })
    }

    // Delete the court
    await db.collection('courts').deleteOne({
      _id: new ObjectId(id)
    })

    // Delete associated bookings
    await db.collection('bookings').deleteMany({
      court: id
    })

    await client.close()

    return NextResponse.json({
      success: true,
      message: 'Court deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting court:', error)
    return NextResponse.json({ 
      error: 'Failed to delete court' 
    }, { status: 500 })
  }
}
