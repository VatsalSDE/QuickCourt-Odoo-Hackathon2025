const { MongoClient, ObjectId } = require('mongodb')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

async function initAdminUser() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('quickcourt')
    
    console.log('🔧 Initializing Admin User...')

    // Check if admin user already exists
    const existingAdmin = await db.collection('users').findOne({ 
      email: 'admin@quickcourt.com',
      role: 'admin'
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      console.log(`📧 Email: admin@quickcourt.com`)
      console.log(`🔑 Role: ${existingAdmin.role}`)
      console.log(`📅 Created: ${existingAdmin.createdAt}`)
      console.log('\n💡 To reset admin password, delete the user and run this script again')
      return
    }

    // Create admin user
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash('admin123', saltRounds)

    const adminUser = {
      _id: new ObjectId(),
      email: 'admin@quickcourt.com',
      password: hashedPassword,
      role: 'admin',
      name: 'QuickCourt Administrator',
      phone: '+91-9999999999',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    }

    await db.collection('users').insertOne(adminUser)
    
    console.log('✅ Admin user created successfully!')
    console.log('\n📋 Admin Login Details:')
    console.log(`📧 Email: admin@quickcourt.com`)
    console.log(`🔑 Password: admin123`)
    console.log(`👑 Role: admin`)
    console.log(`📅 Created: ${adminUser.createdAt}`)
    
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:')
    console.log('• Change the default password immediately after first login')
    console.log('• Use a strong, unique password for production')
    console.log('• Consider enabling 2FA for admin accounts')
    console.log('• Regularly rotate admin passwords')
    
    console.log('\n🚀 You can now login to the admin dashboard at:')
    console.log('   http://localhost:3000/auth/login')
    console.log('   Then navigate to: http://localhost:3000/admin/dashboard')

    // Also create some sample data for admin dashboard
    console.log('\n📊 Creating sample data for admin dashboard...')
    
    // Create sample users for admin to manage
    const sampleUsers = [
      {
        _id: new ObjectId(),
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', saltRounds),
        role: 'user',
        name: 'John Doe',
        phone: '+91-9876543210',
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        updatedAt: new Date(),
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        _id: new ObjectId(),
        email: 'user2@example.com',
        password: await bcrypt.hash('password123', saltRounds),
        role: 'user',
        name: 'Jane Smith',
        phone: '+91-9876543211',
        isActive: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        updatedAt: new Date(),
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        _id: new ObjectId(),
        email: 'owner2@quickcourt.com',
        password: await bcrypt.hash('password123', saltRounds),
        role: 'facility_owner',
        name: 'Sarah Wilson',
        phone: '+91-9876543212',
        isActive: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        updatedAt: new Date(),
        lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ]

    for (const user of sampleUsers) {
      const existingUser = await db.collection('users').findOne({ email: user.email })
      if (!existingUser) {
        await db.collection('users').insertOne(user)
        console.log(`✅ Created sample user: ${user.name} (${user.email})`)
      } else {
        console.log(`ℹ️ Sample user already exists: ${user.name} (${user.email})`)
      }
    }

    // Create sample facilities for admin to approve
    const sampleFacilities = [
      {
        _id: new ObjectId(),
        name: 'Elite Sports Complex',
        description: 'Premium sports facility with multiple courts',
        address: 'Mumbai, Maharashtra',
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760]
        },
        ownerId: sampleUsers[2]._id.toString(), // Sarah Wilson
        status: 'pending_approval',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        amenities: ['Parking', 'Cafeteria', 'Changing Rooms'],
        sports: ['Badminton', 'Tennis', 'Football']
      },
      {
        _id: new ObjectId(),
        name: 'Green Turf Arena',
        description: 'Outdoor sports facility with natural grass',
        address: 'Pune, Maharashtra',
        location: {
          type: 'Point',
          coordinates: [73.8567, 18.5204]
        },
        ownerId: sampleUsers[2]._id.toString(), // Sarah Wilson
        status: 'approved',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        amenities: ['Parking', 'Equipment Rental', 'First Aid'],
        sports: ['Cricket', 'Football', 'Athletics']
      }
    ]

    for (const facility of sampleFacilities) {
      const existingFacility = await db.collection('venues').findOne({ 
        name: facility.name,
        ownerId: facility.ownerId
      })
      if (!existingFacility) {
        await db.collection('venues').insertOne(facility)
        console.log(`✅ Created sample facility: ${facility.name} (${facility.status})`)
      } else {
        console.log(`ℹ️ Sample facility already exists: ${facility.name}`)
      }
    }

    console.log('\n🎉 Admin initialization completed!')
    console.log('\n📈 Admin Dashboard will show:')
    console.log('   • User management and statistics')
    console.log('   • Facility approval requests')
    console.log('   • Platform analytics and reports')
    console.log('   • System monitoring and maintenance')

    await client.close()
    
  } catch (error) {
    console.error('❌ Error initializing admin user:', error)
  } finally {
    await client.close()
  }
}

initAdminUser()
