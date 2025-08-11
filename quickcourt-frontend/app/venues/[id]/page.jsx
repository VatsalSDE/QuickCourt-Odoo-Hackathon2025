"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Clock, Users, Wifi, Car, Coffee, Shield, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function SingleVenuePage() {
  const router = useRouter()
  const params = useParams()
  const venueId = params.id
  const { user, isAuthenticated } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [reviews, setReviews] = useState([])
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    userName: ""
  })

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

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews()
    if (user) {
      setReviewForm(prev => ({ ...prev, userName: user.fullname || "" }))
    }
  }, [venueId, user])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/venues/${venueId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('Please login to submit a review')
      return
    }

    if (!reviewForm.comment.trim()) {
      alert('Please enter a comment')
      return
    }

    setIsSubmittingReview(true)

    try {
      const response = await fetch(`/api/venues/${venueId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          userName: reviewForm.userName,
          userEmail: user?.email || null
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Add new review to the list
        setReviews(prev => [data.review, ...prev])
        // Reset form
        setReviewForm({
          rating: 5,
          comment: "",
          userName: reviewForm.userName
        })
        alert('Review submitted successfully!')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length)
  }

  const handleBookNow = () => {
    router.push(`/booking?venue=${venueId}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
    return `${Math.ceil(diffDays / 365)} years ago`
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                    <span className="ml-1 text-gray-600">({reviews.length} reviews)</span>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="about">About Venue</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
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
                    {/* Review Form */}
                    {isAuthenticated && (
                      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="userName">Your Name</Label>
                            <Input
                              id="userName"
                              value={reviewForm.userName}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, userName: e.target.value }))}
                              placeholder="Enter your name"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label>Rating</Label>
                            <div className="flex items-center space-x-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`h-6 w-6 ${
                                      star <= reviewForm.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                              <span className="ml-2 text-sm text-gray-600">
                                {reviewForm.rating} out of 5
                              </span>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="comment">Your Review</Label>
                            <Textarea
                              id="comment"
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                              placeholder="Share your experience with this venue..."
                              rows={4}
                              required
                            />
                          </div>

                          <Button 
                            type="submit" 
                            disabled={isSubmittingReview}
                            className="flex items-center"
                          >
                            {isSubmittingReview ? (
                              "Submitting..."
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Submit Review
                              </>
                            )}
                          </Button>
                        </form>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {reviews.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>No reviews yet. Be the first to review this venue!</p>
                        </div>
                      ) : (
                        reviews.map((review) => (
                          <div key={review._id || review.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-medium">{review.userName}</h5>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-600">
                                    {review.rating}/5
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Address</h4>
                        <p className="text-gray-700">{venue.address}</p>
                      </div>
                      
                      {/* Static Map Image */}
                      <div>
                        <h4 className="font-semibold mb-2">Location</h4>
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src="/map-placeholder.png"
                            alt="Venue Location Map"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/800x400/2563eb/ffffff?text=Map+View"
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                          Interactive map coming soon
                        </p>
                      </div>
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
                  <Button className="w-full" size="lg" onClick={handleBookNow}>
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

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src="/map-placeholder.png"
                    alt="Venue Location"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x400/2563eb/ffffff?text=Map+View"
                    }}
                  />
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
