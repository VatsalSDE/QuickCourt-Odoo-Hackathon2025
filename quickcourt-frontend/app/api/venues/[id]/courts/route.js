import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'quickcourt'

// GET courts for a specific venue
export async function GET(request, { params }) {
  try {
    const { id: venueId } = params

    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db(dbName)
    const courtsCollection = db.collection('courts')

    // Find all courts for this venue
    const courts = await courtsCollection
      .find({ venueId: venueId })
      .sort({ name: 1 })
      .toArray()

    await client.close()

    // If no courts found, return default courts for demo
    if (courts.length === 0) {
      const defaultCourts = [
        { id: 1, name: "Court A1", type: "Premium", price: 600, available: true, venueId },
        { id: 2, name: "Court A2", type: "Premium", price: 600, available: true, venueId },
        { id: 3, name: "Court B1", type: "Standard", price: 500, available: true, venueId },
        { id: 4, name: "Court B2", type: "Standard", price: 500, available: true, venueId },
        { id: 5, name: "Court C1", type: "Economy", price: 400, available: true, venueId },
        { id: 6, name: "Court C2", type: "Economy", price: 400, available: true, venueId },
      ]
      return NextResponse.json({ courts: defaultCourts })
    }

    return NextResponse.json({ courts })

  } catch (error) {
    console.error('Error fetching courts:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
