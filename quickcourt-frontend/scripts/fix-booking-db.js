// Database fix script for QuickCourt Booking System
// This script will drop existing collections and recreate them with the correct schema
// Run this if you encounter duplicate key errors

import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcourt'
const dbName = process.env.MONGODB_DB || 'quickcourt'

async function fixDatabase() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(dbName)
    
    // Drop existing collections to start fresh
    console.log('Dropping existing collections...')
    try {
      await db.collection('bookings').drop()
      console.log('Dropped bookings collection')
    } catch (e) {
      console.log('Bookings collection did not exist or could not be dropped')
    }
    
    try {
      await db.collection('courts').drop()
      console.log('Dropped courts collection')
    } catch (e) {
      console.log('Courts collection did not exist or could not be dropped')
    }
    
    try {
      await db.collection('timeSlots').drop()
      console.log('Dropped timeSlots collection')
    } catch (e) {
      console.log('TimeSlots collection did not exist or could not be dropped')
    }
    
    // Recreate collections with correct schema
    console.log('Creating collections with correct schema...')
    
    // Create courts collection
    await db.createCollection('courts', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['venueId', 'name', 'type', 'price', 'available'],
          properties: {
            venueId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            type: {
              bsonType: 'string',
              enum: ['Premium', 'Standard', 'Economy'],
              description: 'must be one of: Premium, Standard, Economy'
            },
            price: {
              bsonType: 'int',
              minimum: 100,
              description: 'must be an integer >= 100'
            },
            available: {
              bsonType: 'bool',
              description: 'must be a boolean'
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'must be a date'
            }
          }
        }
      }
    })
    
    // Create timeSlots collection
    await db.createCollection('timeSlots', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['venueId', 'startTime', 'endTime', 'time', 'available'],
          properties: {
            venueId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            startTime: {
              bsonType: 'string',
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              description: 'must be a time string in HH:MM format'
            },
            endTime: {
              bsonType: 'string',
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              description: 'must be a time string in HH:MM format'
            },
            time: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            available: {
              bsonType: 'bool',
              description: 'must be a boolean'
            },
            price: {
              bsonType: 'int',
              minimum: 100,
              description: 'must be an integer >= 100'
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'must be a date'
            }
          }
        }
      }
    })
    
    // Create bookings collection
    await db.createCollection('bookings', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['venueId', 'courtId', 'date', 'startTime', 'endTime', 'status'],
          properties: {
            venueId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            courtId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            courtName: {
              bsonType: 'string',
              description: 'must be a string'
            },
            courtType: {
              bsonType: 'string',
              description: 'must be a string'
            },
            courtPrice: {
              bsonType: 'int',
              minimum: 100,
              description: 'must be an integer >= 100'
            },
            date: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            startTime: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            endTime: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            timeSlot: {
              bsonType: 'string',
              description: 'must be a string'
            },
            amount: {
              bsonType: 'int',
              minimum: 100,
              description: 'must be an integer >= 100'
            },
            status: {
              bsonType: 'string',
              enum: ['pending', 'confirmed', 'cancelled', 'completed'],
              description: 'must be one of: pending, confirmed, cancelled, completed'
            },
            userId: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            userName: {
              bsonType: 'string',
              description: 'must be a string'
            },
            userEmail: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            paymentStatus: {
              bsonType: 'string',
              enum: ['pending', 'completed', 'failed', 'refunded'],
              description: 'must be one of: pending, completed, failed, refunded'
            },
            bookingReference: {
              bsonType: 'string',
              description: 'must be a string'
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'must be a date'
            }
          }
        }
      }
    })
    
    // Create indexes for better performance
    console.log('Creating indexes...')
    await db.collection('courts').createIndex({ venueId: 1 })
    await db.collection('courts').createIndex({ available: 1 })
    
    await db.collection('timeSlots').createIndex({ venueId: 1 })
    await db.collection('timeSlots').createIndex({ startTime: 1 })
    await db.collection('timeSlots').createIndex({ available: 1 })
    
    await db.collection('bookings').createIndex({ venueId: 1 })
    await db.collection('bookings').createIndex({ courtId: 1 })
    await db.collection('bookings').createIndex({ date: 1 })
    await db.collection('bookings').createIndex({ userId: 1 })
    await db.collection('bookings').createIndex({ status: 1 })
    await db.collection('bookings').createIndex({ createdAt: -1 })
    await db.collection('bookings').createIndex({ bookingReference: 1 }, { unique: true })
    
    // Create a compound index for preventing double bookings (NOT unique)
    await db.collection('bookings').createIndex(
      { courtId: 1, date: 1, startTime: 1, endTime: 1 },
      { 
        unique: false, // Not unique since multiple users can book different courts
        name: 'court_booking_time_index'
      }
    )
    
    console.log('Database fixed successfully!')
    console.log('Collections recreated: courts, timeSlots, bookings')
    console.log('Indexes created for better performance')
    
    // Insert sample data for testing
    await insertSampleData(db)
    
  } catch (error) {
    console.error('Error fixing database:', error)
  } finally {
    await client.close()
    console.log('Database connection closed')
  }
}

async function insertSampleData(db) {
  try {
    // Sample courts for venue 1
    const sampleCourts = [
      {
        venueId: "1",
        name: "Court A1",
        type: "Premium",
        price: 600,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        venueId: "1",
        name: "Court A2",
        type: "Premium",
        price: 600,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        venueId: "1",
        name: "Court B1",
        type: "Standard",
        price: 500,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        venueId: "1",
        name: "Court B2",
        type: "Standard",
        price: 500,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    await db.collection('courts').insertMany(sampleCourts)
    console.log('Sample courts inserted')
    
    // Sample time slots for venue 1
    const sampleTimeSlots = []
    for (let hour = 6; hour <= 22; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`
      sampleTimeSlots.push({
        venueId: "1",
        startTime,
        endTime,
        time: `${startTime} - ${endTime}`,
        available: true,
        price: 500,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    
    await db.collection('timeSlots').insertMany(sampleTimeSlots)
    console.log('Sample time slots inserted')
    
  } catch (error) {
    console.error('Error inserting sample data:', error)
  }
}

// Run the fix
fixDatabase().catch(console.error)
