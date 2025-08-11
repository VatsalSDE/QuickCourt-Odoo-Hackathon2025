import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'quickcourt'

// POST create new booking
export async function POST(request) {
  try {
    const {
      venueId,
      courtId,
      courtName,
      courtType,
      courtPrice,
      date,
      timeSlots,
      totalAmount,
      userId,
      userName,
      userEmail
    } = await request.json()

    // Validation
    if (!venueId || !courtId || !date || !timeSlots || timeSlots.length === 0) {
      return NextResponse.json(
        { message: 'Missing required booking information' },
        { status: 400 }
      )
    }

    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db(dbName)
    const bookingsCollection = db.collection('bookings')

    // Check if any of the selected time slots are already booked
    const existingBookings = await bookingsCollection
      .find({
        venueId,
        courtId,
        date: date,
        status: { $in: ['confirmed', 'pending'] }
      })
      .toArray()

    // Check for conflicts with selected time slots
    const hasConflict = timeSlots.some(selectedSlot => {
      return existingBookings.some(existingBooking => {
        const existingStart = new Date(`2000-01-01T${existingBooking.startTime}`)
        const existingEnd = new Date(`2000-01-01T${existingBooking.endTime}`)
        const selectedStart = new Date(`2000-01-01T${selectedSlot.startTime}`)
        const selectedEnd = new Date(`2000-01-01T${selectedSlot.endTime}`)
        
        // Check if there's any overlap
        return (selectedStart < existingEnd && selectedEnd > existingStart)
      })
    })

    if (hasConflict) {
      await client.close()
      return NextResponse.json(
        { message: 'Some selected time slots are no longer available' },
        { status: 409 }
      )
    }

    // Create booking records for each time slot
    const bookingRecords = timeSlots.map(slot => ({
      venueId,
      courtId: courtId.toString(), // Ensure courtId is string
      courtName,
      courtType,
      courtPrice,
      date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      timeSlot: slot.time,
      amount: slot.price || courtPrice,
      status: 'pending',
      userId: userId ? userId.toString() : null, // Ensure userId is string if present
      userName: userName || 'Guest User',
      userEmail: userEmail || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentStatus: 'pending',
      bookingReference: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    }))

    // Insert all booking records
    const result = await bookingsCollection.insertMany(bookingRecords)

    await client.close()

    return NextResponse.json(
      { 
        message: 'Booking created successfully',
        bookingIds: result.insertedIds,
        totalAmount,
        bookingReference: bookingRecords[0].bookingReference
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET user bookings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const venueId = searchParams.get('venueId')

    if (!userId && !venueId) {
      return NextResponse.json(
        { message: 'User ID or Venue ID is required' },
        { status: 400 }
      )
    }

    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db(dbName)
    const bookingsCollection = db.collection('bookings')

    let query = {}
    if (userId) query.userId = userId
    if (venueId) query.venueId = venueId

    const bookings = await bookingsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    await client.close()

    return NextResponse.json({ bookings })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
