"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  MapPin,
  Edit,
  Camera,
  Building2,
  Calendar,
  DollarSign,
  Star,
  Settings,
  Bell,
  Shield,
} from "lucide-react"

export default function OwnerProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [ownerInfo, setOwnerInfo] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@quickcourt.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    businessName: "Elite Sports Ventures",
    businessType: "Sports Facility Management",
    gstNumber: "27ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
    avatar: "/diverse-user-avatars.png",
    bio: "Passionate about providing world-class sports facilities to the community. Running sports complexes for over 10 years.",
  })

  const [editForm, setEditForm] = useState(ownerInfo)

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = () => {
    setOwnerInfo(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(ownerInfo)
    setIsEditing(false)
  }

  const facilities = [
    {
      id: 1,
      name: "Elite Sports Complex",
      location: "Downtown, Mumbai",
      courts: 8,
      rating: 4.8,
      totalBookings: 1250,
      monthlyRevenue: 125000,
      status: "Active",
    },
    {
      id: 2,
      name: "Green Turf Arena",
      location: "North Zone, Mumbai",
      courts: 3,
      rating: 4.6,
      totalBookings: 680,
      monthlyRevenue: 85000,
      status: "Active",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "booking",
      message: "New booking received for Badminton Court A1",
      time: "2 hours ago",
      amount: 600,
    },
    {
      id: 2,
      type: "payment",
      message: "Payment received for booking #B001",
      time: "4 hours ago",
      amount: 800,
    },
    {
      id: 3,
      type: "review",
      message: "New 5-star review for Elite Sports Complex",
      time: "1 day ago",
      rating: 5,
    },
    {
      id: 4,
      type: "maintenance",
      message: "Maintenance scheduled for Tennis Court 1",
      time: "2 days ago",
    },
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "payment":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "review":
        return <Star className="h-4 w-4 text-yellow-600" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-orange-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and business information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={ownerInfo.avatar || "/placeholder.svg"} alt={ownerInfo.name} />
                      <AvatarFallback>
                        {ownerInfo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold mt-4">{ownerInfo.name}</h2>
                  <p className="text-gray-600">{ownerInfo.email}</p>
                  <Badge className="mt-2">Facility Owner</Badge>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{ownerInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{ownerInfo.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{ownerInfo.businessName}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{facilities.length}</div>
                      <div className="text-xs text-gray-600">Facilities</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {facilities.reduce((sum, f) => sum + f.courts, 0)}
                      </div>
                      <div className="text-xs text-gray-600">Total Courts</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="font-bold text-green-600">
                      ₹{facilities.reduce((sum, f) => sum + f.monthlyRevenue, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Bookings</span>
                    <span className="font-bold text-blue-600">
                      {facilities.reduce((sum, f) => sum + f.totalBookings, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Rating</span>
                    <span className="font-bold text-yellow-600">
                      {(facilities.reduce((sum, f) => sum + f.rating, 0) / facilities.length).toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="business">Business Info</TabsTrigger>
                <TabsTrigger value="facilities">My Facilities</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Personal Information</CardTitle>
                      {!isEditing ? (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="space-x-2">
                          <Button variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            name="name"
                            value={editForm.name}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md">{ownerInfo.name}</div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={editForm.email}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md">{ownerInfo.email}</div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md">{ownerInfo.phone}</div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            name="location"
                            value={editForm.location}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md">{ownerInfo.location}</div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        {isEditing ? (
                          <Textarea
                            id="bio"
                            name="bio"
                            value={editForm.bio}
                            onChange={handleInputChange}
                            className="mt-1"
                            rows={3}
                          />
                        ) : (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md">{ownerInfo.bio}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="business">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">{ownerInfo.businessName}</div>
                      </div>

                      <div>
                        <Label htmlFor="businessType">Business Type</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">{ownerInfo.businessType}</div>
                      </div>

                      <div>
                        <Label htmlFor="gstNumber">GST Number</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">{ownerInfo.gstNumber}</div>
                      </div>

                      <div>
                        <Label htmlFor="panNumber">PAN Number</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">{ownerInfo.panNumber}</div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Verification Status</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-2">Your business documents are verified and approved.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="facilities">
                <div className="space-y-6">
                  {facilities.map((facility) => (
                    <Card key={facility.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{facility.name}</h3>
                            <div className="flex items-center text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{facility.address || 'Location not specified'}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-800">{facility.status}</Badge>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm font-medium">{facility.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{facility.courts}</div>
                            <div className="text-xs text-gray-600">Courts</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{facility.totalBookings}</div>
                            <div className="text-xs text-gray-600">Bookings</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              ₹{facility.monthlyRevenue.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-600">Monthly Revenue</div>
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm">
                            <a href={`/owner/facilities/${facility.id}/edit`}>Manage</a>
                          </Button>
                          <Button variant="outline" size="sm">
                            <a href={`/owner/facilities/${facility.id}/analytics`}>View Analytics</a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                          {activity.amount && (
                            <div className="text-sm font-bold text-green-600">+₹{activity.amount}</div>
                          )}
                          {activity.rating && (
                            <div className="flex items-center">
                              {Array.from({ length: activity.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
