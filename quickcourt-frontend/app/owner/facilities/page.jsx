"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Edit, Trash2, Plus, Search, Star, Users, Clock, Wifi, Car, Coffee, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function FacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [facilities, setFacilities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()

  // Fetch facilities data
  useEffect(() => {
    if (user) {
      fetchFacilities()
    }
  }, [user])

  const fetchFacilities = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/owner/facilities?userId=${user?._id || user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setFacilities(data.facilities || [])
      } else {
        console.error('Failed to fetch facilities')
        setFacilities([])
      }
    } catch (error) {
      console.error('Error fetching facilities:', error)
      setFacilities([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFacility = async (facilityId) => {
    if (!confirm('Are you sure you want to delete this facility? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/owner/facilities/${facilityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id || user?.id
        })
      })

      if (response.ok) {
        // Remove from local state
        setFacilities(prev => prev.filter(f => f._id !== facilityId))
        alert('Facility deleted successfully!')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to delete facility')
      }
    } catch (error) {
      console.error('Error deleting facility:', error)
      alert('Failed to delete facility. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "cafeteria":
        return <Coffee className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (facility.address && facility.address.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Facilities</h2>
          <p className="text-gray-600">Please wait while we fetch your facilities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Facilities</h1>
            <p className="text-gray-600 mt-2">Manage your sports facilities and their details</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => router.push('/owner/facilities/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Facility
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search facilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFacilities.map((facility) => (
            <Card key={facility._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={facility.images?.[0] || "/placeholder.svg"}
                  alt={facility.name}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={`absolute top-4 right-4 ${
                    facility.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {facility.status || "Active"}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{facility.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{facility.address || 'Location not specified'}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{facility.description}</p>
                  </div>
                  <div className="flex items-center ml-4">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{facility.rating || 0}</span>
                    <span className="ml-1 text-xs text-gray-500">({facility.reviewCount || 0})</span>
                  </div>
                </div>

                {/* Sports */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {facility.sports?.map((sport) => (
                      <Badge key={sport} variant="secondary" className="text-xs">
                        {sport}
                      </Badge>
                    )) || (
                      <span className="text-sm text-gray-500">No sports specified</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{facility.courtCount || 0}</div>
                    <div className="text-xs text-gray-600">Courts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">₹{(facility.totalEarnings || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{facility.totalBookings || 0}</div>
                    <div className="text-xs text-gray-600">Bookings</div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {facility.amenities?.slice(0, 4).map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-1 text-xs text-gray-600 bg-white px-2 py-1 rounded border"
                      >
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                    {facility.amenities?.length > 4 && (
                      <div className="text-xs text-gray-500 px-2 py-1">+{facility.amenities.length - 4} more</div>
                    )}
                  </div>
                </div>

                {/* Operating Hours */}
                {facility.operatingHours && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Operating Hours: {facility.operatingHours.start} - {facility.operatingHours.end}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-transparent"
                    onClick={() => router.push(`/owner/facilities/${facility._id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-transparent"
                    onClick={() => router.push(`/owner/facilities/${facility._id}/courts`)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Manage Courts
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => handleDeleteFacility(facility._id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredFacilities.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No facilities found' : 'No facilities yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms or add a new facility.'
                  : 'Get started by adding your first sports facility.'
                }
              </p>
              <Button onClick={() => router.push('/owner/facilities/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Facility
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
