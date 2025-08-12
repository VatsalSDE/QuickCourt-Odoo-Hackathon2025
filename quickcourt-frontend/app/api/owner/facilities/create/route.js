import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      name, 
      location, 
      description, 
      sports, 
      amenities, 
      operatingHours, 
      images,
      userId 
    } = body

    // Validate required fields
    if (!name || !location || !userId) {
      return NextResponse.json({ 
        error: 'Name, location, and userId are required' 
      }, { status: 400 })
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')

    // Create the facility
    const facility = {
      name,
      location: {
        type: "Point",
        coordinates: [0, 0] // Default coordinates - can be updated later
      },
      address: location, // Store the actual address as a separate field
      description: description || '',
      sports: sports || [],
      amenities: amenities || [],
      operatingHours: operatingHours || { start: '06:00', end: '22:00' },
      images: images || [],
      ownerId: userId,
      rating: 0,
      reviewCount: 0,
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('venues').insertOne(facility)

    await client.close()

    return NextResponse.json({
      success: true,
      facility: {
        _id: result.insertedId,
        ...facility
      },
      message: 'Facility created successfully'
    })

  } catch (error) {
    console.error('Error creating facility:', error)
    return NextResponse.json({ 
      error: 'Failed to create facility' 
    }, { status: 500 })
  }
}
