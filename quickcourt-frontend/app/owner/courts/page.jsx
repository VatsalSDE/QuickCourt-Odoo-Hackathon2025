"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Filter, MapPin, Clock, ToggleLeft, ToggleRight, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function CourtManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [facilityFilter, setFacilityFilter] = useState("all")
  const [sportFilter, setSportFilter] = useState("all")
  const [courts, setCourts] = useState([])
  const [facilities, setFacilities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()

  const sports = ["Badminton", "Tennis", "Table Tennis", "Football", "Cricket", "Basketball", "Volleyball", "Squash"]

  // Fetch courts and facilities data
  useEffect(() => {
    if (user) {
      fetchCourts()
      fetchFacilities()
    }
  }, [user])

  const fetchCourts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/owner/courts?userId=${user?._id || user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setCourts(data.courts || [])
      } else {
        console.error('Failed to fetch courts')
        setCourts([])
      }
    } catch (error) {
      console.error('Error fetching courts:', error)
      setCourts([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFacilities = async () => {
    try {
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
    }
  }

  const handleDeleteCourt = async (courtId) => {
    if (!confirm('Are you sure you want to delete this court? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/owner/courts/${courtId}`, {
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
        setCourts(prev => prev.filter(c => c._id !== courtId))
        alert('Court deleted successfully!')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to delete court')
      }
    } catch (error) {
      console.error('Error deleting court:', error)
      alert('Failed to delete court. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleCourtStatus = async (courtId) => {
    try {
      setIsToggling(true)
      const court = courts.find(c => c._id === courtId)
      const newStatus = court.status === 'Active' ? 'Inactive' : 'Active'
      
      const response = await fetch(`/api/owner/courts/${courtId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id || user?.id,
          status: newStatus
        })
      })

      if (response.ok) {
        // Update local state
        setCourts(prev => prev.map(c => 
          c._id === courtId 
            ? { ...c, status: newStatus, isActive: newStatus === 'Active' }
            : c
        ))
        alert(`Court status updated to ${newStatus}!`)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to update court status')
      }
    } catch (error) {
      console.error('Error toggling court status:', error)
      alert('Failed to update court status. Please try again.')
    } finally {
      setIsToggling(false)
    }
  }

  const filteredCourts = courts.filter((court) => {
    const matchesSearch =
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (court.venueName && court.venueName.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFacility = facilityFilter === "all" || court.venueId === facilityFilter
    const matchesSport = sportFilter === "all" || court.sport === sportFilter

    return matchesSearch && matchesFacility && matchesSport
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Courts</h2>
          <p className="text-gray-600">Please wait while we fetch your courts...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Court Management</h1>
            <p className="text-gray-600 mt-2">Manage your courts, pricing, and availability</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => router.push('/owner/courts/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Court
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Facilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  {facilities.map((facility) => (
                    <SelectItem key={facility._id} value={facility._id}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setFacilityFilter("all")
                  setSportFilter("all")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Courts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map((court) => (
            <Card key={court._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{court.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{court.venueName || 'Unknown Facility'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(court.status)}>{court.status || 'Active'}</Badge>
                    <button 
                      onClick={() => toggleCourtStatus(court._id)}
                      disabled={isToggling}
                    >
                      {court.isActive ? (
                        <ToggleRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Sport & Pricing */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{court.sport}</Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">₹{court.pricePerHour || 0}</div>
                      <div className="text-xs text-gray-500">per hour</div>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  {court.operatingHours && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{court.operatingHours.start} - {court.operatingHours.end}</span>
                    </div>
                  )}

                  {/* Today's Stats */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{court.bookingsToday || 0}</div>
                      <div className="text-xs text-gray-600">Today's Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">₹{court.revenueToday || 0}</div>
                      <div className="text-xs text-gray-600">Today's Revenue</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-transparent"
                      onClick={() => router.push(`/owner/courts/${court._id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-transparent"
                      onClick={() => router.push(`/owner/courts/${court._id}/schedule`)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => handleDeleteCourt(court._id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || facilityFilter !== "all" || sportFilter !== "all"
                  ? "No courts found"
                  : "No courts yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || facilityFilter !== "all" || sportFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Get started by adding your first court."}
              </p>
              <Button onClick={() => router.push('/owner/courts/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Court
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {filteredCourts.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{filteredCourts.length}</div>
                  <div className="text-sm text-gray-600">Total Courts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredCourts.filter((c) => c.status === "Active").length}
                  </div>
                  <div className="text-sm text-gray-600">Active Courts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredCourts.reduce((sum, court) => sum + (court.bookingsToday || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Today's Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{filteredCourts.reduce((sum, court) => sum + (court.revenueToday || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Today's Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
