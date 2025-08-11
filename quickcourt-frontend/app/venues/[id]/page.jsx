"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Clock, Users, Wifi, Car, Coffee, Shield, ChevronLeft, ChevronRight } from "lucide-react"

export default function SingleVenuePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const venue = {
    id: 1,
    name: "Elite Sports Complex",
    description:
      "A premium sports facility offering world-class courts and amenities for various sports. Perfect for both casual players and serious athletes.",
    address: "123 Sports Avenue, Downtown, Mumbai, Maharashtra 400001",
    sports: [
      { name: "Badminton", courts: 8, price: 500 },
      { name: "Tennis", courts: 4, price: 800 },
      { name: "Table Tennis", courts: 6, price: 300 },
    ],
    amenities: [
      { name: "Free WiFi", icon: Wifi },
      { name: "Parking", icon: Car },
      { name: "Cafeteria", icon: Coffee },
      { name: "Security", icon: Shield },
      { name: "Changing Rooms", icon: Users },
      { name: "Equipment Rental", icon: Clock },
    ],
    rating: 4.8,
    reviews: 124,
    images: [
      "/placeholder-sd0as.png",
      "/badminton-courts.png",
      "/tennis-courts.png",
      "/cafeteria-area.png",
      "/parking-area.png",
    ],
    about:
      "Elite Sports Complex has been serving the Mumbai sports community for over 15 years. Our facility features state-of-the-art courts, professional lighting, and climate control to ensure the best playing experience. We host regular tournaments and offer coaching programs for all skill levels.",
    operatingHours: "6:00 AM - 11:00 PM (All days)",
    contact: "+91 98765 43210",
  }

  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      rating: 5,
      comment: "Excellent facility with well-maintained courts. The staff is very helpful and professional.",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Priya Patel",
      rating: 4,
      comment: "Great place to play badminton. Courts are clean and booking process is smooth.",
      date: "1 week ago",
    },
    {
      id: 3,
      name: "Amit Kumar",
      rating: 5,
      comment: "Love the tennis courts here. Perfect surface and good lighting for evening games.",
      date: "2 weeks ago",
    },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">QuickCourt</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </a>
              <a href="/venues" className="text-gray-700 hover:text-blue-600">
                Venues
              </a>
              <a href="/profile" className="text-gray-700 hover:text-blue-600">
                Profile
              </a>
              <a href="/bookings" className="text-gray-700 hover:text-blue-600">
                My Bookings
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Login</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-blue-600">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/venues" className="hover:text-blue-600">
                Venues
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-900">{venue.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={venue.images[currentImageIndex] || "/placeholder.svg"}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {venue.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-white bg-opacity-50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Venue Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{venue.name}</CardTitle>
                    <div className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-600">{venue.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{venue.rating}</span>
                    <span className="ml-1 text-gray-600">({venue.reviews} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{venue.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Operating Hours</h4>
                    <p className="text-gray-600">{venue.operatingHours}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Contact</h4>
                    <p className="text-gray-600">{venue.contact}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Available Sports</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {venue.sports.map((sport) => (
                      <div key={sport.name} className="border rounded-lg p-4">
                        <h5 className="font-medium">{sport.name}</h5>
                        <p className="text-sm text-gray-600">{sport.courts} courts available</p>
                        <p className="text-lg font-bold text-blue-600 mt-1">₹{sport.price}/hour</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Additional Info */}
            <Tabs defaultValue="amenities" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="about">About Venue</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="amenities">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {venue.amenities.map((amenity) => (
                        <div key={amenity.name} className="flex items-center space-x-3">
                          <amenity.icon className="h-5 w-5 text-blue-600" />
                          <span>{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 leading-relaxed">{venue.about}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium">{review.name}</h5>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>Book This Venue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Starting from</p>
                    <p className="text-2xl font-bold text-blue-600">₹300/hour</p>
                  </div>
                  <Button className="w-full" size="lg">
                    Book Now
                  </Button>
                  <p className="text-xs text-gray-500 text-center">Free cancellation up to 2 hours before booking</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Courts</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sports Available</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking</span>
                    <span className="font-medium">Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Equipment Rental</span>
                    <span className="font-medium">Yes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map View</p>
                </div>
                <p className="text-sm text-gray-600 mt-2">{venue.address}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
