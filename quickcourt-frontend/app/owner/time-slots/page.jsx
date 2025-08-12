"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Clock, Settings, CheckCircle, XCircle, CalendarIcon, Wrench, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import MaintenanceModal from "@/components/MaintenanceModal"
import BulkActionsModal from "@/components/BulkActionsModal"

export default function TimeSlotsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedCourt, setSelectedCourt] = useState("all")
  const [selectedFacility, setSelectedFacility] = useState("all")
  const [courts, setCourts] = useState([])
  const [facilities, setFacilities] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [timeSlotData, setTimeSlotData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false)
  const [selectedCourtForMaintenance, setSelectedCourtForMaintenance] = useState(null)
  const [isUpdatingSlot, setIsUpdatingSlot] = useState(false)

  const { user } = useAuth()

  // Fetch time slots data
  useEffect(() => {
    if (user) {
      fetchTimeSlots()
    }
  }, [user, selectedDate, selectedFacility, selectedCourt])

  const fetchTimeSlots = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        userId: user?._id || user?.id,
        date: selectedDate.toISOString(),
        facilityId: selectedFacility,
        courtId: selectedCourt
      })

      const response = await fetch(`/api/owner/time-slots?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCourts(data.courts || [])
        setFacilities(data.facilities || [])
        setTimeSlots(data.timeSlots || [])
        setTimeSlotData(data.timeSlotData || {})
      } else {
        console.error('Failed to fetch time slots')
        setCourts([])
        setFacilities([])
        setTimeSlots([])
        setTimeSlotData({})
      }
    } catch (error) {
      console.error('Error fetching time slots:', error)
      setCourts([])
      setFacilities([])
      setTimeSlots([])
      setTimeSlotData({})
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchTimeSlots()
    setIsRefreshing(false)
  }

  const getSlotStatus = (courtId, time) => {
    return timeSlotData[courtId]?.[time] || { status: "available", booking: null }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "booked":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "blocked":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />
      case "booked":
        return <CalendarIcon className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      case "blocked":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const toggleSlotStatus = async (courtId, time, currentStatus) => {
    if (currentStatus === 'booked') {
      alert('Cannot modify booked time slots')
      return
    }

    if (!confirm(`Are you sure you want to ${currentStatus === 'available' ? 'block' : 'unblock'} this time slot?`)) {
      return
    }

    try {
      setIsUpdatingSlot(true)
      
      const newStatus = currentStatus === 'available' ? 'blocked' : 'available'
      const reason = currentStatus === 'available' ? 'Blocked by owner' : ''

      const response = await fetch('/api/owner/time-slots/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id || user?.id,
          courtId,
          time,
          date: selectedDate,
          status: newStatus,
          reason
        })
      })

      if (response.ok) {
        // Update local state
        setTimeSlotData(prev => ({
          ...prev,
          [courtId]: {
            ...prev[courtId],
            [time]: {
              status: newStatus,
              booking: null
            }
          }
        }))
        alert(`Time slot ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to update time slot')
      }
    } catch (error) {
      console.error('Error updating time slot:', error)
      alert('Failed to update time slot. Please try again.')
    } finally {
      setIsUpdatingSlot(false)
    }
  }

  const handleScheduleMaintenance = (court) => {
    setSelectedCourtForMaintenance(court)
    setShowMaintenanceModal(true)
  }

  const handleMaintenanceScheduled = () => {
    fetchTimeSlots()
  }

  const handleBulkActionCompleted = () => {
    fetchTimeSlots()
  }

  const filteredCourts = courts.filter((court) => {
    const matchesFacility = selectedFacility === "all" || court.facilityId === selectedFacility
    const matchesCourt = selectedCourt === "all" || court.id === selectedCourt
    return matchesFacility && matchesCourt
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Time Slots</h2>
          <p className="text-gray-600">Please wait while we fetch your time slots...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Time Slot Management</h1>
          <p className="text-gray-600 mt-2">Manage court availability and maintenance schedules</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Facility</label>
                  <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Facilities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Court</label>
                  <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courts</SelectItem>
                      {courts.map((court) => (
                        <SelectItem key={court.id} value={court.id}>
                          {court.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Available
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Booked
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Wrench className="h-3 w-3 mr-1" />
                    Maintenance
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    <XCircle className="h-3 w-3 mr-1" />
                    Blocked
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Time Slots for {selectedDate?.toLocaleDateString()}</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowBulkActionsModal(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Bulk Actions
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowMaintenanceModal(true)}
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      Schedule Maintenance
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredCourts.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courts selected</h3>
                    <p className="text-gray-600">Select a facility or court to view time slots.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredCourts.map((court) => (
                      <div key={court.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{court.name}</h3>
                            <p className="text-sm text-gray-600">{court.facility}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleScheduleMaintenance(court)}
                            >
                              <Wrench className="h-4 w-4 mr-2" />
                              Schedule Maintenance
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                          {timeSlots.map((time) => {
                            const slot = getSlotStatus(court.id, time)
                            return (
                              <button
                                key={time}
                                onClick={() => toggleSlotStatus(court.id, time, slot.status)}
                                disabled={slot.status === "booked" || isUpdatingSlot}
                                className={`p-2 rounded-lg border text-xs font-medium transition-all hover:scale-105 ${getStatusColor(slot.status)} ${
                                  slot.status === "booked" || isUpdatingSlot ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                                }`}
                              >
                                <div className="flex flex-col items-center space-y-1">
                                  {getStatusIcon(slot.status)}
                                  <span>{time}</span>
                                  {slot.booking && (
                                    <span className="text-xs truncate w-full">{slot.booking.user.split(" ")[0]}</span>
                                  )}
                                </div>
                              </button>
                            )
                          })}
                        </div>

                        {/* Court Summary */}
                        <div className="mt-4 grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm font-bold text-green-600">
                              {timeSlots.filter((time) => getSlotStatus(court.id, time).status === "available").length}
                            </div>
                            <div className="text-xs text-gray-600">Available</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-blue-600">
                              {timeSlots.filter((time) => getSlotStatus(court.id, time).status === "booked").length}
                            </div>
                            <div className="text-xs text-gray-600">Booked</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-yellow-600">
                              {
                                timeSlots.filter((time) => getSlotStatus(court.id, time).status === "maintenance")
                                  .length
                              }
                            </div>
                            <div className="text-xs text-gray-600">Maintenance</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-gray-600">
                              {Math.round(
                                (timeSlots.filter((time) => getSlotStatus(court.id, time).status === "booked").length /
                                  timeSlots.length) *
                                  100,
                              )}
                              %
                            </div>
                            <div className="text-xs text-gray-600">Utilization</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <MaintenanceModal
          isOpen={showMaintenanceModal}
          onClose={() => setShowMaintenanceModal(false)}
          court={selectedCourtForMaintenance}
          selectedDate={selectedDate}
          onMaintenanceScheduled={handleMaintenanceScheduled}
        />

        <BulkActionsModal
          isOpen={showBulkActionsModal}
          onClose={() => setShowBulkActionsModal(false)}
          courts={filteredCourts}
          timeSlots={timeSlots}
          selectedDate={selectedDate}
          onBulkActionCompleted={handleBulkActionCompleted}
        />
      </div>
    </div>
  )
}
