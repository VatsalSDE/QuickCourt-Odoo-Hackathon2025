import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, courtId, date, startTime, endTime, reason, description } = body

    if (!userId || !courtId || !date || !startTime || !endTime || !reason) {
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

    // Generate time slots between start and end time
    const timeSlots = []
    const startHour = parseInt(startTime.split(':')[0])
    const endHour = parseInt(endTime.split(':')[0])
    
    for (let hour = startHour; hour < endHour; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
    }

    // Check for existing bookings in the maintenance time range
    const existingBookings = await db.collection('bookings').find({
      court: courtId,
      date: formattedDate,
      startTime: { $in: timeSlots }
    }).toArray()

    if (existingBookings.length > 0) {
      await client.close()
      return NextResponse.json({ 
        error: 'Cannot schedule maintenance during booked time slots',
        conflictingBookings: existingBookings
      }, { status: 400 })
    }

    // Create maintenance schedule
    const maintenanceSchedule = {
      courtId: courtId,
      date: formattedDate,
      startTime: startTime,
      endTime: endTime,
      timeSlots: timeSlots,
      reason: reason,
      description: description || '',
      scheduledBy: userId,
      scheduledAt: new Date(),
      status: 'scheduled'
    }

    const result = await db.collection('maintenanceSchedules').insertOne(maintenanceSchedule)

    await client.close()

    return NextResponse.json({
      success: true,
      message: 'Maintenance scheduled successfully',
      maintenanceId: result.insertedId
    })

  } catch (error) {
    console.error('Error scheduling maintenance:', error)
    return NextResponse.json({ error: 'Failed to schedule maintenance' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const maintenanceId = searchParams.get('maintenanceId')
    const userId = searchParams.get('userId')

    if (!maintenanceId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')

    // Verify ownership
    const maintenance = await db.collection('maintenanceSchedules').findOne({
      _id: new ObjectId(maintenanceId)
    })

    if (!maintenance) {
      await client.close()
      return NextResponse.json({ error: 'Maintenance schedule not found' }, { status: 404 })
    }

    const court = await db.collection('courts').findOne({
      _id: new ObjectId(maintenance.courtId)
    })

    const venue = await db.collection('venues').findOne({
      _id: new ObjectId(court.venueId),
      ownerId: userId
    })

    if (!venue) {
      await client.close()
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete maintenance schedule
    await db.collection('maintenanceSchedules').deleteOne({
      _id: new ObjectId(maintenanceId)
    })

    await client.close()

    return NextResponse.json({
      success: true,
      message: 'Maintenance schedule cancelled successfully'
    })

  } catch (error) {
    console.error('Error cancelling maintenance:', error)
    return NextResponse.json({ error: 'Failed to cancel maintenance' }, { status: 500 })
  }
}
