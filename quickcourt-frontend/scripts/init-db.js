// Database initialization script for QuickCourt
// Run this script to set up the initial database structure

import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcourt'
const dbName = process.env.MONGODB_DB || 'quickcourt'

async function initDatabase() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(dbName)
    
    // Create collections with validation
    await db.createCollection('reviews', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['venueId', 'rating', 'comment', 'userName'],
          properties: {
            venueId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            rating: {
              bsonType: 'int',
              minimum: 1,
              maximum: 5,
              description: 'must be an integer between 1 and 5 and is required'
            },
            comment: {
              bsonType: 'string',
              minLength: 1,
              description: 'must be a string and is required'
            },
            userName: {
              bsonType: 'string',
              minLength: 1,
              description: 'must be a string and is required'
            },
            userEmail: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
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
    await db.collection('reviews').createIndex({ venueId: 1 })
    await db.collection('reviews').createIndex({ createdAt: -1 })
    
    console.log('Database initialized successfully!')
    console.log('Collections created: reviews')
    console.log('Indexes created for better performance')
    
  } catch (error) {
    console.error('Error initializing database:', error)
  } finally {
    await client.close()
    console.log('Database connection closed')
  }
}

// Run the initialization
initDatabase().catch(console.error)
