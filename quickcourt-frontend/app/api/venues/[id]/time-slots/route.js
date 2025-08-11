import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'quickcourt'

// GET time slots for a specific venue and date
export async function GET(request, { params }) {
  try {
    const { id: venueId } = params
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const courtId = searchParams.get('courtId')

    if (!date) {
      return NextResponse.json(
        { message: 'Date parameter is required' },
        { status: 400 }
      )
    }

    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db(dbName)
    const timeSlotsCollection = db.collection('timeSlots')
    const bookingsCollection = db.collection('bookings')

    // Get all time slots for the venue
    let timeSlots = await timeSlotsCollection
      .find({ venueId: venueId })
      .sort({ startTime: 1 })
      .toArray()

    // If no time slots found, create default ones
    if (timeSlots.length === 0) {
      const defaultTimeSlots = []
      for (let hour = 6; hour <= 22; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`
        defaultTimeSlots.push({
          id: hour,
          time: `${startTime} - ${endTime}`,
          startTime,
          endTime,
          available: true,
          venueId,
          price: 500 // Default price per hour
        })
      }
      timeSlots = defaultTimeSlots
    }

    // If courtId is provided, check existing bookings for that court on that date
    if (courtId) {
      const existingBookings = await bookingsCollection
        .find({
          venueId,
          courtId,
          date: date,
          status: { $in: ['confirmed', 'pending'] }
        })
        .toArray()

      // Mark time slots as unavailable if they're already booked
      timeSlots = timeSlots.map(slot => {
        const isBooked = existingBookings.some(booking => {
          const bookingStart = new Date(`2000-01-01T${booking.startTime}`)
          const bookingEnd = new Date(`2000-01-01T${booking.endTime}`)
          const slotStart = new Date(`2000-01-01T${slot.startTime}`)
          const slotEnd = new Date(`2000-01-01T${slot.endTime}`)
          
          // Check if there's any overlap
          return (slotStart < bookingEnd && slotEnd > bookingStart)
        })
        
        return {
          ...slot,
          available: !isBooked
        }
      })
    }

    await client.close()

    return NextResponse.json({ timeSlots })

  } catch (error) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
