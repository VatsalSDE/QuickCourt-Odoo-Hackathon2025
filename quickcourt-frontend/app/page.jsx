"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Search, MapPin, Star, Clock, Users, ArrowRight, TrendingUp, Award, CheckCircle } from "lucide-react"
import { Building2 } from "lucide-react" // Import Building2 icon

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedSport, setSelectedSport] = useState("")

  const featuredVenues = [
    {
      id: 1,
      name: "Elite Sports Complex",
      location: "Downtown, Mumbai",
      rating: 4.8,
      reviews: 124,
      image: "/elite-sports-complex.png",
      sports: ["Badminton", "Tennis", "Table Tennis"],
      priceRange: "₹300-800/hour",
      amenities: ["Parking", "WiFi", "Cafeteria"],
    },
    {
      id: 2,
      name: "Green Turf Ground",
      location: "Andheri, Mumbai",
      rating: 4.6,
      reviews: 89,
      image: "/green-turf-ground.png",
      sports: ["Football", "Cricket"],
      priceRange: "₹500-1200/hour",
      amenities: ["Parking", "Changing Rooms"],
    },
    {
      id: 3,
      name: "Vibrant Tennis Club",
      location: "Bandra, Mumbai",
      rating: 4.9,
      reviews: 156,
      image: "/vibrant-tennis-club.png",
      sports: ["Tennis"],
      priceRange: "₹600-1000/hour",
      amenities: ["Pro Shop", "Coaching", "WiFi"],
    },
  ]

  const popularSports = [
    { name: "Badminton", venues: 45, icon: "🏸" },
    { name: "Tennis", venues: 32, icon: "🎾" },
    { name: "Football", venues: 28, icon: "⚽" },
    { name: "Cricket", venues: 24, icon: "🏏" },
    { name: "Basketball", venues: 18, icon: "🏀" },
    { name: "Table Tennis", venues: 15, icon: "🏓" },
  ]

  const handleSearch = () => {
    window.location.href = `/venues?search=${searchQuery}&location=${selectedLocation}&sport=${selectedSport}`
  }

  const handleVenueClick = (venueId) => {
    window.location.href = `/venues/${venueId}`
  }

  const handleBookNow = (venueId) => {
    window.location.href = `/booking?venue=${venueId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Find & Book Sports Venues</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover the best sports facilities near you and book instantly
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg p-4 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-gray-900"
                  />
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="pune">Pune</option>
                </select>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Sport</option>
                  <option value="badminton">Badminton</option>
                  <option value="tennis">Tennis</option>
                  <option value="football">Football</option>
                  <option value="cricket">Cricket</option>
                  <option value="basketball">Basketball</option>
                </select>
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                  Search Venues
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">Sports Venues</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">10K+</h3>
              <p className="text-gray-600">Happy Users</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">50K+</h3>
              <p className="text-gray-600">Bookings Made</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">4.8</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Sports */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Sports</h2>
            <p className="text-gray-600">Choose from a variety of sports and find the perfect venue</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularSports.map((sport) => (
              <Card
                key={sport.name}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => (window.location.href = `/venues?sport=${sport.name.toLowerCase()}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{sport.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{sport.name}</h3>
                  <p className="text-sm text-gray-600">{sport.venues} venues</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Venues</h2>
              <p className="text-gray-600">Top-rated sports facilities in your area</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = "/venues")}>
              View All Venues
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVenues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video">
                  <img
                    src={venue.image || "/placeholder.svg"}
                    alt={venue.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => handleVenueClick(venue.id)}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white text-gray-900">
                      <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                      {venue.rating}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3
                    className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                    onClick={() => handleVenueClick(venue.id)}
                  >
                    {venue.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{venue.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {venue.sports.map((sport) => (
                      <Badge key={sport} variant="secondary" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-blue-600">{venue.priceRange}</span>
                    <span className="text-sm text-gray-500">({venue.reviews} reviews)</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleVenueClick(venue.id)}
                    >
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => handleBookNow(venue.id)}>
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose QuickCourt?</h2>
            <p className="text-gray-600">Experience the best in sports venue booking</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Booking</h3>
              <p className="text-gray-600">Book your favorite courts instantly with real-time availability</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Venues</h3>
              <p className="text-gray-600">All venues are verified and maintained to the highest standards</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing with no hidden fees or booking charges</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Play?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of sports enthusiasts and book your next game</p>
          <div className="space-x-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => (window.location.href = "/venues")}
            >
              Find Venues
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              onClick={() => (window.location.href = "/auth/signup")}
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">QuickCourt</h3>
              <p className="text-gray-400 mb-4">Your ultimate destination for sports venue booking</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Instagram
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/venues" className="text-gray-400 hover:text-white">
                    Find Venues
                  </a>
                </li>
                <li>
                  <a href="/auth/signup" className="text-gray-400 hover:text-white">
                    Sign Up
                  </a>
                </li>
                <li>
                  <a href="/auth/login" className="text-gray-400 hover:text-white">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sports</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/venues?sport=badminton" className="text-gray-400 hover:text-white">
                    Badminton
                  </a>
                </li>
                <li>
                  <a href="/venues?sport=tennis" className="text-gray-400 hover:text-white">
                    Tennis
                  </a>
                </li>
                <li>
                  <a href="/venues?sport=football" className="text-gray-400 hover:text-white">
                    Football
                  </a>
                </li>
                <li>
                  <a href="/venues?sport=cricket" className="text-gray-400 hover:text-white">
                    Cricket
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/help" className="text-gray-400 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 QuickCourt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
