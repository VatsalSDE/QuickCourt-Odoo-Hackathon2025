import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'quickcourt'

// GET reviews for a specific venue
export async function GET(request, { params }) {
  try {
    const { id: venueId } = params

    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db(dbName)
    const reviewsCollection = db.collection('reviews')

    // Find all reviews for this venue
    const reviews = await reviewsCollection
      .find({ venueId: venueId })
      .sort({ createdAt: -1 })
      .toArray()

    await client.close()

    return NextResponse.json({ reviews })

  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST new review for a venue
export async function POST(request, { params }) {
  try {
    const { id: venueId } = params
    const { rating, comment, userName, userEmail } = await request.json()

    // Validation
    if (!rating || !comment || !userName) {
      return NextResponse.json(
        { message: 'Rating, comment, and user name are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db(dbName)
    const reviewsCollection = db.collection('reviews')
    const venuesCollection = db.collection('venues')

    // Create new review
    const newReview = {
      venueId,
      rating: parseInt(rating),
      comment,
      userName,
      userEmail: userEmail || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await reviewsCollection.insertOne(newReview)

    // Update venue rating (calculate new average)
    const allReviews = await reviewsCollection.find({ venueId }).toArray()
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / allReviews.length

    // Update venue with new rating and review count
    await venuesCollection.updateOne(
      { _id: venueId },
      { 
        $set: { 
          rating: Math.round(averageRating * 10) / 10,
          reviewCount: allReviews.length,
          updatedAt: new Date()
        } 
      }
    )

    await client.close()

    return NextResponse.json(
      { 
        message: 'Review added successfully',
        review: {
          ...newReview,
          _id: result.insertedId
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error adding review:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
