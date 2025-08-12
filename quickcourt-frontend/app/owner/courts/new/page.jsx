"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function NewCourtPage() {
  const [formData, setFormData] = useState({
    name: "",
    venueId: "",
    sport: "",
    pricePerHour: "",
    description: "",
    operatingHours: {
      start: "06:00",
      end: "23:00",
    },
    weeklySchedule: {
      monday: { isOpen: true, start: "06:00", end: "23:00" },
      tuesday: { isOpen: true, start: "06:00", end: "23:00" },
      wednesday: { isOpen: true, start: "06:00", end: "23:00" },
      thursday: { isOpen: true, start: "06:00", end: "23:00" },
      friday: { isOpen: true, start: "06:00", end: "23:00" },
      saturday: { isOpen: true, start: "06:00", end: "23:00" },
      sunday: { isOpen: true, start: "06:00", end: "23:00" },
    },
  })

  const [facilities, setFacilities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()

  const sports = ["Badminton", "Tennis", "Table Tennis", "Football", "Cricket", "Basketball", "Volleyball", "Squash"]

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ]

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleScheduleChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          [field]: value,
        },
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please login to create a court')
      return
    }

    if (!formData.name || !formData.venueId || !formData.sport || !formData.pricePerHour) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      
      const courtData = {
        name: formData.name,
        venueId: formData.venueId,
        sport: formData.sport,
        pricePerHour: formData.pricePerHour,
        description: formData.description,
        operatingHours: formData.operatingHours,
        weeklySchedule: formData.weeklySchedule,
        userId: user._id || user.id
      }

      const response = await fetch('/api/owner/courts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courtData)
      })

      if (response.ok) {
        const result = await response.json()
        alert('Court created successfully!')
        router.push('/owner/courts')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to create court')
      }
    } catch (error) {
      console.error('Error creating court:', error)
      alert('Failed to create court. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Court</h1>
          <p className="text-gray-600 mt-2">Create a new court for your facility</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="venueId">Select Facility *</Label>
                    <Select
                      value={formData.venueId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, venueId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility._id} value={facility._id}>
                            {facility.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="name">Court Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Badminton Court A1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sport">Sport Type *</Label>
                    <Select
                      value={formData.sport}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, sport: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport type" />
                      </SelectTrigger>
                      <SelectContent>
                        {sports.map((sport) => (
                          <SelectItem key={sport} value={sport}>
                            {sport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Additional details about the court..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="pricePerHour">Price per Hour (₹) *</Label>
                    <Input
                      id="pricePerHour"
                      name="pricePerHour"
                      type="number"
                      value={formData.pricePerHour}
                      onChange={handleInputChange}
                      placeholder="Enter price per hour"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-time">Default Opening Time</Label>
                        <Input
                          id="start-time"
                          name="operatingHours.start"
                          type="time"
                          value={formData.operatingHours.start}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-time">Default Closing Time</Label>
                        <Input
                          id="end-time"
                          name="operatingHours.end"
                          type="time"
                          value={formData.operatingHours.end}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Weekly Schedule */}
                    <div className="mt-6">
                      <h4 className="font-medium mb-4">Weekly Schedule</h4>
                      <div className="space-y-3">
                        {days.map((day) => (
                          <div key={day.key} className="flex items-center space-x-4 p-3 border rounded-lg">
                            <div className="w-20">
                              <Checkbox
                                id={day.key}
                                checked={formData.weeklySchedule[day.key].isOpen}
                                onCheckedChange={(checked) => handleScheduleChange(day.key, "isOpen", checked)}
                              />
                              <Label htmlFor={day.key} className="ml-2 text-sm font-medium">
                                {day.label}
                              </Label>
                            </div>

                            {formData.weeklySchedule[day.key].isOpen && (
                              <div className="flex items-center space-x-2 flex-1">
                                <Input
                                  type="time"
                                  value={formData.weeklySchedule[day.key].start}
                                  onChange={(e) => handleScheduleChange(day.key, "start", e.target.value)}
                                  className="w-32"
                                />
                                <span className="text-gray-500">to</span>
                                <Input
                                  type="time"
                                  value={formData.weeklySchedule[day.key].end}
                                  onChange={(e) => handleScheduleChange(day.key, "end", e.target.value)}
                                  className="w-32"
                                />
                              </div>
                            )}

                            {!formData.weeklySchedule[day.key].isOpen && (
                              <div className="flex-1">
                                <Badge variant="secondary">Closed</Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Court Name</p>
                      <p className="font-medium">{formData.name || "Enter court name"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Facility</p>
                      <p className="font-medium">
                        {facilities.find(f => f._id === formData.venueId)?.name || "Select facility"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sport</p>
                      <p className="font-medium">{formData.sport || "Select sport"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price per Hour</p>
                      <p className="font-medium text-blue-600">
                        {formData.pricePerHour ? `₹${formData.pricePerHour}` : "Enter price"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Operating Hours</p>
                      <p className="font-medium">
                        {formData.operatingHours.start} - {formData.operatingHours.end}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Court'
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full bg-transparent"
                      onClick={() => router.push('/owner/courts')}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Use clear, descriptive court names</li>
                    <li>• Set competitive pricing for your area</li>
                    <li>• Configure accurate operating hours</li>
                    <li>• You can modify schedules later</li>
                    <li>• Consider peak hour pricing</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
