// Utility script to update booking statuses
// This can be run as a cron job to automatically mark past bookings as completed

import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcourt'
const dbName = process.env.MONGODB_DB || 'quickcourt'

async function updateBookingStatuses() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(dbName)
    const bookingsCollection = db.collection('bookings')
    
    const now = new Date()
    
    // Find all confirmed/pending bookings that have passed their time
    const pastBookings = await bookingsCollection.find({
      status: { $in: ['confirmed', 'pending'] },
      $expr: {
        $lt: [
          { $dateFromString: { dateString: { $concat: ['$date', 'T', '$endTime', ':00'] } } },
          now
        ]
      }
    }).toArray()
    
    if (pastBookings.length === 0) {
      console.log('No past bookings found to update')
      return
    }
    
    console.log(`Found ${pastBookings.length} past bookings to update`)
    
    // Update status to completed
    const result = await bookingsCollection.updateMany(
      {
        status: { $in: ['confirmed', 'pending'] },
        $expr: {
          $lt: [
            { $dateFromString: { dateString: { $concat: ['$date', 'T', '$endTime', ':00'] } } },
            now
          ]
        }
      },
      {
        $set: {
          status: 'completed',
          updatedAt: now
        }
      }
    )
    
    console.log(`Updated ${result.modifiedCount} bookings to completed status`)
    
  } catch (error) {
    console.error('Error updating booking statuses:', error)
  } finally {
    await client.close()
    console.log('Database connection closed')
  }
}

// Run the update
updateBookingStatuses().catch(console.error)
