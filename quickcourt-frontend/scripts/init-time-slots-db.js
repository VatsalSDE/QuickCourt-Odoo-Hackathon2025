const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

async function initTimeSlotsDB() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('quickcourt')
    
    console.log('🔧 Initializing Time Slots Database Collections...')

    // Create blockedSlots collection
    const blockedSlotsCollection = db.collection('blockedSlots')
    await blockedSlotsCollection.createIndex(
      { courtId: 1, date: 1, time: 1 },
      { unique: true }
    )
    console.log('✅ Created blockedSlots collection with unique index')

    // Create maintenanceSchedules collection
    const maintenanceSchedulesCollection = db.collection('maintenanceSchedules')
    await maintenanceSchedulesCollection.createIndex(
      { courtId: 1, date: 1, startTime: 1 },
      { unique: false }
    )
    await maintenanceSchedulesCollection.createIndex(
      { scheduledBy: 1, scheduledAt: -1 },
      { unique: false }
    )
    console.log('✅ Created maintenanceSchedules collection with indexes')

    // Check if we have any sample data to create
    const existingOwner = await db.collection('users').findOne({ 
      email: 'owner@quickcourt.com' 
    })

    if (existingOwner) {
      console.log('✅ Found existing owner user')
      
      // Check if we have any facilities
      const existingFacilities = await db.collection('venues').find({
        ownerId: existingOwner._id.toString()
      }).toArray()

      if (existingFacilities.length > 0) {
        console.log(`✅ Found ${existingFacilities.length} existing facilities`)
        
        // Check if we have any courts
        const existingCourts = await db.collection('courts').find({
          venueId: { $in: existingFacilities.map(f => f._id.toString()) }
        }).toArray()

        if (existingCourts.length > 0) {
          console.log(`✅ Found ${existingCourts.length} existing courts`)
          
          // Create some sample blocked slots for testing
          const today = new Date()
          const tomorrow = new Date(today)
          tomorrow.setDate(today.getDate() + 1)
          
          const sampleBlockedSlots = [
            {
              courtId: existingCourts[0]._id.toString(),
              date: today.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }),
              time: '10:00',
              reason: 'Sample blocked slot for testing',
              blockedBy: existingOwner._id.toString(),
              blockedAt: new Date()
            },
            {
              courtId: existingCourts[0]._id.toString(),
              date: tomorrow.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }),
              time: '14:00',
              reason: 'Sample blocked slot for testing',
              blockedBy: existingOwner._id.toString(),
              blockedAt: new Date()
            }
          ]

          for (const slot of sampleBlockedSlots) {
            try {
              await blockedSlotsCollection.insertOne(slot)
              console.log(`✅ Created sample blocked slot for ${slot.date} at ${slot.time}`)
            } catch (error) {
              if (error.code === 11000) {
                console.log(`ℹ️ Sample blocked slot already exists for ${slot.date} at ${slot.time}`)
              } else {
                console.error('❌ Error creating sample blocked slot:', error.message)
              }
            }
          }

          // Create some sample maintenance schedules
          const sampleMaintenanceSchedules = [
            {
              courtId: existingCourts[0]._id.toString(),
              date: today.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }),
              startTime: '11:00',
              endTime: '13:00',
              timeSlots: ['11:00', '12:00'],
              reason: 'equipment_repair',
              description: 'Sample maintenance schedule for testing',
              scheduledBy: existingOwner._id.toString(),
              scheduledAt: new Date(),
              status: 'scheduled'
            }
          ]

          for (const schedule of sampleMaintenanceSchedules) {
            try {
              await maintenanceSchedulesCollection.insertOne(schedule)
              console.log(`✅ Created sample maintenance schedule for ${schedule.date} from ${schedule.startTime} to ${schedule.endTime}`)
            } catch (error) {
              console.error('❌ Error creating sample maintenance schedule:', error.message)
            }
          }
        } else {
          console.log('ℹ️ No courts found - create courts first to test time slot management')
        }
      } else {
        console.log('ℹ️ No facilities found - create facilities first to test time slot management')
      }
    } else {
      console.log('ℹ️ No owner user found - create owner user first to test time slot management')
    }

    console.log('🎉 Time Slots Database initialization completed!')
    
  } catch (error) {
    console.error('❌ Error initializing time slots database:', error)
  } finally {
    await client.close()
  }
}

initTimeSlotsDB()
