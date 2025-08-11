"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Search, Filter, Eye, Check, X, MapPin, Building2, Calendar, FileText, Phone, Mail, Clock } from "lucide-react"

export default function AdminFacilities() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("pending")
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const facilities = {
    pending: [
      {
        id: 1,
        name: "Premium Sports Arena",
        owner: "Rajesh Kumar",
        location: "Sector 18, Noida",
        submittedDate: "2024-01-15",
        sports: ["Badminton", "Tennis"],
        courts: 12,
        documents: ["GST Certificate", "Property Documents", "NOC"],
        images: ["/elite-sports-complex.png", "/badminton-courts.png"],
        contact: "+91 98765 43210",
        email: "rajesh@premiumsports.com",
        status: "pending",
        description: "A state-of-the-art sports facility with modern amenities and professional-grade courts.",
      },
      {
        id: 2,
        name: "Green Valley Courts",
        owner: "Priya Sharma",
        location: "Banjara Hills, Hyderabad",
        submittedDate: "2024-01-12",
        sports: ["Tennis", "Basketball"],
        courts: 8,
        documents: ["GST Certificate", "Property Documents"],
        images: ["/tennis-courts.png"],
        contact: "+91 87654 32109",
        email: "priya@greenvalley.com",
        status: "pending",
        description: "Outdoor courts with excellent lighting and professional maintenance.",
      },
    ],
    approved: [
      {
        id: 3,
        name: "Elite Sports Complex",
        owner: "Amit Patel",
        location: "Downtown, Mumbai",
        approvedDate: "2024-01-10",
        sports: ["Badminton", "Tennis", "Table Tennis"],
        courts: 18,
        status: "approved",
      },
    ],
    rejected: [
      {
        id: 4,
        name: "Basic Courts",
        owner: "Suresh Reddy",
        location: "Old City, Delhi",
        rejectedDate: "2024-01-08",
        reason: "Incomplete documentation and safety concerns",
        sports: ["Badminton"],
        courts: 4,
        status: "rejected",
      },
    ],
  }

  const handleViewDetails = (facility) => {
    setSelectedFacility(facility)
    setShowModal(true)
  }

  const handleApprove = (facilityId) => {
    console.log("Approving facility:", facilityId)
    // Here you would make an API call to approve the facility
    setShowModal(false)
  }

  const handleReject = (facilityId, reason) => {
    console.log("Rejecting facility:", facilityId, "Reason:", reason)
    // Here you would make an API call to reject the facility
    setShowModal(false)
  }

  const filteredFacilities = facilities[selectedTab].filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Facility Management</h1>
          <p className="text-gray-600">Review and approve facility registrations</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search facilities, owners, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Pending ({facilities.pending.length})</span>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center space-x-2">
              <Check className="h-4 w-4" />
              <span>Approved ({facilities.approved.length})</span>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center space-x-2">
              <X className="h-4 w-4" />
              <span>Rejected ({facilities.rejected.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <Card key={facility.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{facility.name}</CardTitle>
                        <p className="text-sm text-gray-600">by {facility.owner}</p>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {facility.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        {facility.courts} courts
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Submitted: {facility.submittedDate}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {facility.sports.map((sport) => (
                          <Badge key={sport} variant="outline" className="text-xs">
                            {sport}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleViewDetails(facility)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <Card key={facility.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{facility.name}</CardTitle>
                        <p className="text-sm text-gray-600">by {facility.owner}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {facility.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        {facility.courts} courts
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Approved: {facility.approvedDate}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {facility.sports.map((sport) => (
                          <Badge key={sport} variant="outline" className="text-xs">
                            {sport}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <Card key={facility.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{facility.name}</CardTitle>
                        <p className="text-sm text-gray-600">by {facility.owner}</p>
                      </div>
                      <Badge variant="destructive" className="bg-red-100 text-red-800">
                        Rejected
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {facility.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        {facility.courts} courts
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Rejected: {facility.rejectedDate}
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Reason:</strong> {facility.reason}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal for facility details */}
        {showModal && selectedFacility && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedFacility.name}</h2>
                    <p className="text-gray-600">Facility Review</p>
                  </div>
                  <Button variant="ghost" onClick={() => setShowModal(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Facility Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Facility Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">{selectedFacility.name}</p>
                            <p className="text-sm text-gray-600">Facility Name</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">{selectedFacility.location}</p>
                            <p className="text-sm text-gray-600">Location</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">{selectedFacility.contact}</p>
                            <p className="text-sm text-gray-600">Contact Number</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">{selectedFacility.email}</p>
                            <p className="text-sm text-gray-600">Email Address</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Sports & Courts</h3>
                      <div className="space-y-2">
                        <p>
                          <strong>Total Courts:</strong> {selectedFacility.courts}
                        </p>
                        <div>
                          <strong>Sports Available:</strong>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedFacility.sports.map((sport) => (
                              <Badge key={sport} variant="outline">
                                {sport}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <p className="text-gray-700">{selectedFacility.description}</p>
                    </div>
                  </div>

                  {/* Documents and Images */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Documents</h3>
                      <div className="space-y-2">
                        {selectedFacility.documents.map((doc, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="flex-1">{doc}</span>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Facility Images</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedFacility.images.map((image, index) => (
                          <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Facility ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedFacility.status === "pending" && (
                  <div className="mt-8 flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedFacility.id, "Needs more documentation")}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedFacility.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Facility
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
