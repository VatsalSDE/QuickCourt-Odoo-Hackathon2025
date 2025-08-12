"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Wifi, Car, Coffee, Users, Shield, Dumbbell, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function NewFacilityPage() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    sports: [],
    amenities: [],
    operatingHours: {
      start: "",
      end: "",
    },
    images: [],
  })

  const [selectedSports, setSelectedSports] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()

  const availableSports = [
    "Badminton",
    "Tennis",
    "Table Tennis",
    "Football",
    "Cricket",
    "Basketball",
    "Volleyball",
    "Squash",
  ]

  const availableAmenities = [
    { id: "wifi", name: "Free WiFi", icon: Wifi },
    { id: "parking", name: "Parking", icon: Car },
    { id: "cafeteria", name: "Cafeteria", icon: Coffee },
    { id: "changing_rooms", name: "Changing Rooms", icon: Users },
    { id: "security", name: "Security", icon: Shield },
    { id: "equipment_rental", name: "Equipment Rental", icon: Dumbbell },
    { id: "first_aid", name: "First Aid", icon: Users },
    { id: "locker", name: "Lockers", icon: Users },
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

  const handleSportToggle = (sport) => {
    setSelectedSports((prev) => (prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]))
  }

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId) ? prev.filter((a) => a !== amenityId) : [...prev, amenityId],
    )
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }))
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please login to create a facility')
      return
    }

    if (!formData.name || !formData.location) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      
      // Convert amenities IDs to names
      const amenityNames = selectedAmenities.map(amenityId => {
        const amenity = availableAmenities.find(a => a.id === amenityId)
        return amenity ? amenity.name : amenityId
      })

      const facilityData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        sports: selectedSports,
        amenities: amenityNames,
        operatingHours: formData.operatingHours,
        images: formData.images.map(img => img.name), // For now, just store image names
        userId: user._id || user.id
      }

      const response = await fetch('/api/owner/facilities/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData)
      })

      if (response.ok) {
        const result = await response.json()
        alert('Facility created successfully!')
        router.push('/owner/facilities')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to create facility')
      }
    } catch (error) {
      console.error('Error creating facility:', error)
      alert('Failed to create facility. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Facility</h1>
          <p className="text-gray-600 mt-2">Create a new sports facility listing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Facility Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter facility name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your facility..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sports Supported */}
              <Card>
                <CardHeader>
                  <CardTitle>Sports Supported</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableSports.map((sport) => (
                      <div key={sport} className="flex items-center space-x-2">
                        <Checkbox
                          id={sport}
                          checked={selectedSports.includes(sport)}
                          onCheckedChange={() => handleSportToggle(sport)}
                        />
                        <Label htmlFor={sport} className="text-sm">
                          {sport}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedSports.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Selected sports:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSports.map((sport) => (
                          <Badge key={sport} variant="secondary">
                            {sport}
                            <button
                              type="button"
                              onClick={() => handleSportToggle(sport)}
                              className="ml-2 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableAmenities.map((amenity) => (
                      <div
                        key={amenity.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <Checkbox
                          id={amenity.id}
                          checked={selectedAmenities.includes(amenity.id)}
                          onCheckedChange={() => handleAmenityToggle(amenity.id)}
                        />
                        <amenity.icon className="h-5 w-5 text-gray-600" />
                        <Label htmlFor={amenity.id} className="flex-1 cursor-pointer">
                          {amenity.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card>
                <CardHeader>
                  <CardTitle>Operating Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time">Opening Time</Label>
                      <Input
                        id="start-time"
                        name="operatingHours.start"
                        type="time"
                        value={formData.operatingHours.start}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-time">Closing Time</Label>
                      <Input
                        id="end-time"
                        name="operatingHours.end"
                        type="time"
                        value={formData.operatingHours.end}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Facility Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload facility photos</p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image-upload").click()}
                      >
                        Choose Files
                      </Button>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image) || "/placeholder.svg"}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                      <p className="text-sm text-gray-600">Facility Name</p>
                      <p className="font-medium">{formData.name || "Enter facility name"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{formData.location || "Enter location"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sports ({selectedSports.length})</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedSports.map((sport) => (
                          <Badge key={sport} variant="secondary" className="text-xs">
                            {sport}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amenities ({selectedAmenities.length})</p>
                      <p className="text-sm">{selectedAmenities.length} amenities selected</p>
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
                        'Create Facility'
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full bg-transparent"
                      onClick={() => router.push('/owner/facilities')}
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
                    <li>• Add high-quality photos to attract more bookings</li>
                    <li>• Include detailed facility description</li>
                    <li>• Select all sports your facility supports</li>
                    <li>• List all available amenities</li>
                    <li>• Set accurate operating hours</li>
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
