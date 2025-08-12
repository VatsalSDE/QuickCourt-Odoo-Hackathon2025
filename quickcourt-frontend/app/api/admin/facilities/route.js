import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')
    
    // Build query
    let query = {}
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Get facilities with owner details
    const facilities = await db.collection('venues').aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: {
          path: '$owner',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          ownerName: '$owner.name',
          ownerEmail: '$owner.email',
          ownerPhone: '$owner.phone'
        }
      },
      {
        $project: {
          owner: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray()
    
    // Get counts for filters
    const totalFacilities = await db.collection('venues').countDocuments()
    const approvedFacilities = await db.collection('venues').countDocuments({ status: 'approved' })
    const pendingFacilities = await db.collection('venues').countDocuments({ status: 'pending_approval' })
    const rejectedFacilities = await db.collection('venues').countDocuments({ status: 'rejected' })
    
    await client.close()
    
    return NextResponse.json({
      facilities: facilities.map(facility => ({
        ...facility,
        _id: facility._id.toString(),
        ownerId: facility.ownerId.toString()
      })),
      counts: {
        total: totalFacilities,
        approved: approvedFacilities,
        pending: pendingFacilities,
        rejected: rejectedFacilities
      }
    })
    
  } catch (error) {
    console.error('Error fetching facilities:', error)
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { facilityId, action, data } = await request.json()
    
    if (!facilityId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')
    
    let updateData = {}
    
    switch (action) {
      case 'approve':
        updateData = { 
          status: 'approved',
          approvedAt: new Date(),
          updatedAt: new Date()
        }
        break
        
      case 'reject':
        updateData = { 
          status: 'rejected',
          rejectedAt: new Date(),
          rejectionReason: data.reason || 'Rejected by admin',
          updatedAt: new Date()
        }
        break
        
      case 'update_facility':
        updateData = {
          name: data.name,
          description: data.description,
          address: data.address,
          amenities: data.amenities,
          sports: data.sports,
          updatedAt: new Date()
        }
        break
        
      default:
        await client.close()
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    
    const result = await db.collection('venues').updateOne(
      { _id: new ObjectId(facilityId) },
      { $set: updateData }
    )
    
    await client.close()
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Facility ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'updated'} successfully` 
    })
    
  } catch (error) {
    console.error('Error updating facility:', error)
    return NextResponse.json({ error: 'Failed to update facility' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const facilityId = searchParams.get('facilityId')
    
    if (!facilityId) {
      return NextResponse.json({ error: 'Facility ID is required' }, { status: 400 })
    }
    
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db('quickcourt')
    
    // Check if facility exists
    const facility = await db.collection('venues').findOne({ _id: new ObjectId(facilityId) })
    if (!facility) {
      await client.close()
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 })
    }
    
    // Delete facility and related data
    await db.collection('venues').deleteOne({ _id: new ObjectId(facilityId) })
    
    // Delete related courts
    await db.collection('courts').deleteMany({ venueId: facilityId })
    
    // Delete related bookings
    await db.collection('bookings').deleteMany({ venueId: facilityId })
    
    await client.close()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Facility deleted successfully' 
    })
    
  } catch (error) {
    console.error('Error deleting facility:', error)
    return NextResponse.json({ error: 'Failed to delete facility' }, { status: 500 })
  }
}
