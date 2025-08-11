"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react"

export default function VenuesPage() {
  const [venues, setVenues] = useState([])
  const [filteredVenues, setFilteredVenues] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedSport, setSelectedSport] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [showFilters, setShowFilters] = useState(false)

  const allVenues = [
    {
      id: 1,
      name: "Elite Sports Complex",
      location: "Downtown, Mumbai",
      rating: 4.8,
      reviews: 124,
      image: "/elite-sports-complex.png",
      sports: ["Badminton", "Tennis", "Table Tennis"],
      priceRange: "₹300-800",
      minPrice: 300,
      maxPrice: 800,
      amenities: ["Parking", "WiFi", "Cafeteria", "AC"],
      distance: "2.5 km",
    },
    {
      id: 2,
      name: "Green Turf Ground",
      location: "Andheri, Mumbai",
      rating: 4.6,
      reviews: 89,
      image: "/green-turf-ground.png",
      sports: ["Football", "Cricket"],
      priceRange: "₹500-1200",
      minPrice: 500,
      maxPrice: 1200,
      amenities: ["Parking", "Changing Rooms"],
      distance: "3.2 km",
    },
    {
      id: 3,
      name: "Vibrant Tennis Club",
      location: "Bandra, Mumbai",
      rating: 4.9,
      reviews: 156,
      image: "/vibrant-tennis-club.png",
      sports: ["Tennis"],
      priceRange: "₹600-1000",
      minPrice: 600,
      maxPrice: 1000,
      amenities: ["Pro Shop", "Coaching", "WiFi"],
      distance: "1.8 km",
    },
    {
      id: 4,
      name: "Badminton Center Pro",
      location: "Powai, Mumbai",
      rating: 4.7,
      reviews: 98,
      image: "/badminton-center.png",
      sports: ["Badminton"],
      priceRange: "₹400-600",
      minPrice: 400,
      maxPrice: 600,
      amenities: ["AC", "Parking", "Equipment Rental"],
      distance: "4.1 km",
    },
    {
      id: 5,
      name: "Outdoor Basketball Arena",
      location: "Malad, Mumbai",
      rating: 4.4,
      reviews: 67,
      image: "/outdoor-basketball-court.png",
      sports: ["Basketball"],
      priceRange: "₹200-400",
      minPrice: 200,
      maxPrice: 400,
      amenities: ["Floodlights", "Parking"],
      distance: "5.3 km",
    },
    {
      id: 6,
      name: "Cricket Ground Premium",
      location: "Thane, Mumbai",
      rating: 4.5,
      reviews: 112,
      image: "/cricket-ground.png",
      sports: ["Cricket"],
      priceRange: "₹800-1500",
      minPrice: 800,
      maxPrice: 1500,
      amenities: ["Pavilion", "Parking", "Cafeteria"],
      distance: "6.7 km",
    },
  ]

  useEffect(() => {
    setVenues(allVenues)
    setFilteredVenues(allVenues)
  }, [])

  useEffect(() => {
    let filtered = venues

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.sports.some((sport) => sport.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter((venue) => venue.location.toLowerCase().includes(selectedLocation.toLowerCase()))
    }

    // Sport filter
    if (selectedSport) {
      filtered = filtered.filter((venue) =>
        venue.sports.some((sport) => sport.toLowerCase() === selectedSport.toLowerCase()),
      )
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter((venue) => venue.minPrice >= min && venue.maxPrice <= max)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price-low":
          return a.minPrice - b.minPrice
        case "price-high":
          return b.minPrice - a.minPrice
        case "distance":
          return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
        default:
          return 0
      }
    })

    setFilteredVenues(filtered)
  }, [searchQuery, selectedLocation, selectedSport, priceRange, sortBy, venues])

  const handleVenueClick = (venueId) => {
    window.location.href = `/venues/${venueId}`
  }

  const handleBookNow = (venueId) => {
    window.location.href = `/booking?venue=${venueId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sports Venues</h1>
          <p className="text-gray-600">Find and book the perfect sports venue for your game</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search venues, sports, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              <option value="downtown">Downtown</option>
              <option value="andheri">Andheri</option>
              <option value="bandra">Bandra</option>
              <option value="powai">Powai</option>
              <option value="malad">Malad</option>
              <option value="thane">Thane</option>
            </select>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sports</option>
              <option value="badminton">Badminton</option>
              <option value="tennis">Tennis</option>
              <option value="football">Football</option>
              <option value="cricket">Cricket</option>
              <option value="basketball">Basketball</option>
            </select>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Price</option>
                  <option value="0-500">₹0 - ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-1500">₹1000 - ₹1500</option>
                  <option value="1500-2000">₹1500+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="distance">Nearest First</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedLocation("")
                    setSelectedSport("")
                    setPriceRange("")
                    setSortBy("rating")
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredVenues.length} of {venues.length} venues
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVenues.map((venue) => (
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
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    {venue.distance}
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
                <div className="flex flex-wrap gap-1 mb-4">
                  {venue.amenities.slice(0, 3).map((amenity) => (
                    <span key={amenity} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                  {venue.amenities.length > 3 && (
                    <span className="text-xs text-gray-500">+{venue.amenities.length - 3} more</span>
                  )}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-blue-600">{venue.priceRange}/hour</span>
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

        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
