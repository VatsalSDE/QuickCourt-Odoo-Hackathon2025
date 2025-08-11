"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign } from "lucide-react"

export default function NewCourtPage() {
  const [formData, setFormData] = useState({
    name: "",
    facility: "",
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

  const facilities = [
    { id: 1, name: "Elite Sports Complex" },
    { id: 2, name: "Green Turf Arena" },
  ]

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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Court data:", formData)
    // Handle form submission
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
                    <Label htmlFor="facility">Select Facility *</Label>
                    <Select
                      value={formData.facility}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, facility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.name}>
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
                      <p className="font-medium">{formData.facility || "Select facility"}</p>
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
                    <Button type="submit" className="w-full">
                      Create Court
                    </Button>
                    <Button type="button" variant="outline" className="w-full bg-transparent">
                      <a href="/owner/courts">Cancel</a>
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
