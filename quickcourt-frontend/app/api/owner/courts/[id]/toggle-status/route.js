import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { userId, status } = body

    if (!userId || !status) {
      return NextResponse.json({ 
        error: 'User ID and status are required' 
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

    // Update the court status
    await db.collection('courts').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          isActive: status === 'Active',
          updatedAt: new Date()
        } 
      }
    )

    await client.close()

    return NextResponse.json({
      success: true,
      message: 'Court status updated successfully'
    })

  } catch (error) {
    console.error('Error updating court status:', error)
    return NextResponse.json({ 
      error: 'Failed to update court status' 
    }, { status: 500 })
  }
}
