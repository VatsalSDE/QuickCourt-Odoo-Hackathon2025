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

    // Check if facility exists and belongs to the user
    const facility = await db.collection('venues').findOne({
      _id: new ObjectId(id),
      ownerId: userId
    })

    if (!facility) {
      await client.close()
      return NextResponse.json({ 
        error: 'Facility not found or access denied' 
      }, { status: 404 })
    }

    // Delete the facility
    await db.collection('venues').deleteOne({
      _id: new ObjectId(id)
    })

    // Delete associated courts
    await db.collection('courts').deleteMany({
      venueId: id
    })

    // Delete associated bookings
    await db.collection('bookings').deleteMany({
      venueId: id
    })

    await client.close()

    return NextResponse.json({
      success: true,
      message: 'Facility deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting facility:', error)
    return NextResponse.json({ 
      error: 'Failed to delete facility' 
    }, { status: 500 })
  }
}
