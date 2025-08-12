import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      name, 
      venueId, 
      sport, 
      pricePerHour, 
      description, 
      operatingHours, 
      weeklySchedule,
      userId 
    } = body

    // Validate required fields
    if (!name || !venueId || !sport || !pricePerHour || !userId) {
      return NextResponse.json({ 
        error: 'Name, venue, sport, price, and userId are required' 
      }, { status: 400 })
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')

    // Verify that the venue belongs to the user
    const venue = await db.collection('venues').findOne({
      _id: new ObjectId(venueId),
      ownerId: userId
    })

    if (!venue) {
      await client.close()
      return NextResponse.json({ 
        error: 'Venue not found or access denied' 
      }, { status: 404 })
    }

    // Create the court
    const court = {
      name,
      venueId: venueId,
      sport,
      pricePerHour: parseFloat(pricePerHour),
      description: description || '',
      operatingHours: operatingHours || { start: '06:00', end: '23:00' },
      weeklySchedule: weeklySchedule || {
        monday: { isOpen: true, start: '06:00', end: '23:00' },
        tuesday: { isOpen: true, start: '06:00', end: '23:00' },
        wednesday: { isOpen: true, start: '06:00', end: '23:00' },
        thursday: { isOpen: true, start: '06:00', end: '23:00' },
        friday: { isOpen: true, start: '06:00', end: '23:00' },
        saturday: { isOpen: true, start: '06:00', end: '23:00' },
        sunday: { isOpen: true, start: '06:00', end: '23:00' }
      },
      status: 'Active',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('courts').insertOne(court)

    await client.close()

    return NextResponse.json({
      success: true,
      court: {
        _id: result.insertedId,
        ...court
      },
      message: 'Court created successfully'
    })

  } catch (error) {
    console.error('Error creating court:', error)
    return NextResponse.json({ 
      error: 'Failed to create court' 
    }, { status: 500 })
  }
}
