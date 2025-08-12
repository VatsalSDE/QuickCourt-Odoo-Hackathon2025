const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

async function initOwnerDashboard() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')
    
    console.log('Connected to MongoDB')

    // Find existing facility owner user or create one
    let ownerUser = await db.collection('users').findOne({ 
      email: 'owner@quickcourt.com',
      role: 'facility_owner'
    })
    
    if (!ownerUser) {
      ownerUser = {
        _id: new ObjectId(),
        email: 'owner@quickcourt.com',
        password: '$2b$10$example.hash.for.testing',
        role: 'facility_owner',
        name: 'John Sports Owner',
        phone: '+91-9876543210',
        createdAt: new Date()
      }
      await db.collection('users').insertOne(ownerUser)
      console.log('✅ Created facility owner user')
    } else {
      console.log('✅ Found existing facility owner user')
    }

    // Create sample venues (facilities)
    const venues = [
      {
        _id: new ObjectId(),
        name: 'Elite Sports Complex',
        location: 'Downtown, Mumbai',
        location: {
          type: "Point",
          coordinates: [72.8777, 19.0760] // Mumbai coordinates
        },
        description: 'Premium sports facility with multiple courts',
        ownerId: ownerUser._id.toString(),
        rating: 4.5,
        reviewCount: 25,
        amenities: ['Parking', 'Cafeteria', 'Changing Rooms'],
        images: ['elite-sports-complex.png'],
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'Green Valley Courts',
        location: 'Andheri, Mumbai',
        location: {
          type: "Point",
          coordinates: [72.8697, 19.1197] // Andheri coordinates
        },
        description: 'Modern sports facility with natural surroundings',
        ownerId: ownerUser._id.toString(),
        rating: 4.2,
        reviewCount: 18,
        amenities: ['Parking', 'Garden', 'Equipment Rental'],
        images: ['green-turf-ground.png'],
        createdAt: new Date()
      }
    ]

    // Create sample courts
    const courts = [
      {
        _id: new ObjectId(),
        venueId: venues[0]._id.toString(),
        name: 'Badminton Court 1',
        type: 'Badminton',
        pricePerHour: 800,
        isActive: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        venueId: venues[0]._id.toString(),
        name: 'Badminton Court 2',
        type: 'Badminton',
        pricePerHour: 800,
        isActive: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        venueId: venues[0]._id.toString(),
        name: 'Tennis Court',
        type: 'Tennis',
        pricePerHour: 1200,
        isActive: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        venueId: venues[1]._id.toString(),
        name: 'Football Ground',
        type: 'Football',
        pricePerHour: 1500,
        isActive: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        venueId: venues[1]._id.toString(),
        name: 'Cricket Net',
        type: 'Cricket',
        pricePerHour: 600,
        isActive: true,
        createdAt: new Date()
      }
    ]

    // Create sample bookings
    const now = new Date()
    const bookings = []
    
    // Generate bookings for the last 30 days
    for (let i = 0; i < 50; i++) {
      const bookingDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - Math.floor(Math.random() * 30))
      const startHour = 6 + Math.floor(Math.random() * 14) // 6 AM to 8 PM
      const startTime = `${startHour.toString().padStart(2, '0')}:00`
      const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`
      
      const court = courts[Math.floor(Math.random() * courts.length)]
      const statuses = ['pending', 'confirmed', 'completed', 'cancelled']
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      
      bookings.push({
        _id: new ObjectId(),
        userId: new ObjectId().toString(), // Random user ID
        venueId: court.venueId,
        courtId: court._id.toString(),
        court: court._id.toString(), // Add this field for the index
        date: bookingDate.toLocaleDateString('en-GB'),
        startTime,
        endTime,
        amount: court.pricePerHour,
        status,
        bookingReference: `BK${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        createdAt: new Date(bookingDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random creation time
      })
    }

    // Insert or update venues
    for (const venue of venues) {
      const existingVenue = await db.collection('venues').findOne({ 
        name: venue.name,
        ownerId: ownerUser._id.toString()
      })
      
      if (!existingVenue) {
        await db.collection('venues').insertOne(venue)
        console.log(`✅ Created venue: ${venue.name}`)
      } else {
        console.log(`✅ Found existing venue: ${venue.name}`)
      }
    }
    
    // Insert or update courts
    for (const court of courts) {
      const existingCourt = await db.collection('courts').findOne({ 
        name: court.name,
        venueId: court.venueId
      })
      
      if (!existingCourt) {
        await db.collection('courts').insertOne(court)
        console.log(`✅ Created court: ${court.name}`)
      } else {
        console.log(`✅ Found existing court: ${court.name}`)
      }
    }
    
    // Insert sample bookings (only if none exist)
    const existingBookings = await db.collection('bookings').countDocuments({
      venueId: { $in: venues.map(v => v._id.toString()) }
    })
    
    if (existingBookings === 0) {
      // Insert bookings one by one to avoid duplicate key errors
      let insertedCount = 0
      for (const booking of bookings) {
        try {
          await db.collection('bookings').insertOne(booking)
          insertedCount++
        } catch (error) {
          if (error.code === 11000) {
            // Skip duplicate bookings
            continue
          } else {
            console.error('Error inserting booking:', error.message)
          }
        }
      }
      console.log(`✅ Created ${insertedCount} sample bookings`)
    } else {
      console.log(`✅ Found ${existingBookings} existing bookings`)
    }

    console.log('\n🎉 Owner dashboard data initialized successfully!')
    console.log(`\n📊 Dashboard will show:`)
    console.log(`   • Total Facilities: ${venues.length}`)
    console.log(`   • Active Courts: ${courts.length}`)
    console.log(`   • Total Bookings: ${bookings.length}`)
    console.log(`   • Interactive charts with real data`)
    
    console.log(`\n🔑 Login with: owner@quickcourt.com`)
    console.log(`   (You'll need to create a proper password in the auth system)`)

    await client.close()
    
  } catch (error) {
    console.error('❌ Error initializing owner dashboard:', error)
    process.exit(1)
  }
}

initOwnerDashboard()
