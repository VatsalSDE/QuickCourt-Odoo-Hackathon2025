import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, courtId, time, date, status, reason } = body

    if (!userId || !courtId || !time || !date || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')

    // Verify that the court belongs to the user's facility
    const court = await db.collection('courts').findOne({
      _id: new ObjectId(courtId)
    })

    if (!court) {
      await client.close()
      return NextResponse.json({ error: 'Court not found' }, { status: 404 })
    }

    const venue = await db.collection('venues').findOne({
      _id: new ObjectId(court.venueId),
      ownerId: userId
    })

    if (!venue) {
      await client.close()
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Format date
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    if (status === 'blocked') {
      // Create or update blocked slot
      await db.collection('blockedSlots').updateOne(
        {
          courtId: courtId,
          date: formattedDate,
          time: time
        },
        {
          $set: {
            courtId: courtId,
            date: formattedDate,
            time: time,
            reason: reason || 'Blocked by owner',
            blockedBy: userId,
            blockedAt: new Date()
          }
        },
        { upsert: true }
      )
    } else if (status === 'available') {
      // Remove blocked slot
      await db.collection('blockedSlots').deleteOne({
        courtId: courtId,
        date: formattedDate,
        time: time
      })
    }

    await client.close()

    return NextResponse.json({
      success: true,
      message: `Time slot ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`
    })

  } catch (error) {
    console.error('Error updating time slot:', error)
    return NextResponse.json({ error: 'Failed to update time slot' }, { status: 500 })
  }
}
