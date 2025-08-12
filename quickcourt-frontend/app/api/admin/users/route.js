import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')
    
    // Build query
    let query = {}
    
    if (role && role !== 'all') {
      query.role = role
    }
    
    if (status && status !== 'all') {
      query.isActive = status === 'active'
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Get users with pagination
    const users = await db.collection('users')
      .find(query)
      .sort({ createdAt: -1 })
      .project({ password: 0 }) // Exclude password
      .toArray()
    
    // Get counts for filters
    const totalUsers = await db.collection('users').countDocuments()
    const adminUsers = await db.collection('users').countDocuments({ role: 'admin' })
    const facilityOwners = await db.collection('users').countDocuments({ role: 'facility_owner' })
    const regularUsers = await db.collection('users').countDocuments({ role: 'user' })
    const activeUsers = await db.collection('users').countDocuments({ isActive: true })
    const inactiveUsers = await db.collection('users').countDocuments({ isActive: false })
    
    await client.close()
    
    return NextResponse.json({
      users: users.map(user => ({
        ...user,
        _id: user._id.toString()
      })),
      counts: {
        total: totalUsers,
        admin: adminUsers,
        facility_owner: facilityOwners,
        user: regularUsers,
        active: activeUsers,
        inactive: inactiveUsers
      }
    })
    
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { userId, action, data } = await request.json()
    
    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')
    
    let updateData = {}
    
    switch (action) {
      case 'toggle_status':
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
        if (!user) {
          await client.close()
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        updateData = { isActive: !user.isActive }
        break
        
      case 'update_role':
        if (!data.role || !['user', 'facility_owner', 'admin'].includes(data.role)) {
          await client.close()
          return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
        }
        updateData = { role: data.role }
        break
        
      case 'update_user':
        updateData = {
          name: data.name,
          phone: data.phone,
          updatedAt: new Date()
        }
        break
        
      default:
        await client.close()
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    )
    
    await client.close()
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'User updated successfully' 
    })
    
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')
    
    // Check if user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    if (!user) {
      await client.close()
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Prevent deletion of admin users
    if (user.role === 'admin') {
      await client.close()
      return NextResponse.json({ error: 'Cannot delete admin users' }, { status: 403 })
    }
    
    // Delete user
    await db.collection('users').deleteOne({ _id: new ObjectId(userId) })
    
    // If user was a facility owner, also delete their facilities
    if (user.role === 'facility_owner') {
      await db.collection('venues').deleteMany({ ownerId: userId })
    }
    
    await client.close()
    
    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    })
    
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
