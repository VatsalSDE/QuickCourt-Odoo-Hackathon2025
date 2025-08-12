"use client"

import { useState , useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, CreditCard, CheckCircle, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const venueId = searchParams.get('venue')
  const { user, isAuthenticated } = useAuth()
  
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([])
  const [bookingStep, setBookingStep] = useState(1) // 1: selection, 2: confirmation, 3: payment, 4: success
  const [paymentDetails, setPaymentDetails] = useState(null)
  
  // Data states
  const [courts, setCourts] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [isLoadingCourts, setIsLoadingCourts] = useState(false)
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)

  // Venue data based on venueId
  const getVenueData = () => {
    const venues = {
      1: {
        name: "Elite Sports Complex",
        location: "Downtown, Mumbai",
        sport: "Badminton",
        image: "/elite-sports-complex.png"
      },
      2: {
        name: "Green Turf Ground",
        location: "Andheri, Mumbai",
        sport: "Football",
        image: "/green-turf-ground.png"
      },
      3: {
        name: "Vibrant Tennis Club",
        location: "Bandra, Mumbai",
        sport: "Tennis",
        image: "/vibrant-tennis-club.png"
      },
      4: {
        name: "Badminton Center Pro",
        location: "Powai, Mumbai",
        sport: "Badminton",
        image: "/badminton-center.png"
      },
      5: {
        name: "Outdoor Basketball Arena",
        location: "Malad, Mumbai",
        sport: "Basketball",
        image: "/outdoor-basketball-court.png"
      },
      6: {
        name: "Cricket Ground Premium",
        location: "Thane, Mumbai",
        sport: "Cricket",
        image: "/cricket-ground.png"
      }
    }
    return venues[venueId] || venues[1]
  }

  const venue = getVenueData()

  // Fetch courts when component mounts
  useEffect(() => {
    if (venueId) {
      fetchCourts()
    }
  }, [venueId])

  // Fetch time slots when date or court changes
  useEffect(() => {
    if (selectedDate && selectedCourt) {
      fetchTimeSlots()
    }
  }, [selectedDate, selectedCourt])

  // Preload Razorpay script when component mounts
  useEffect(() => {
    loadRazorpayScript().catch(error => {
      console.error('Failed to preload Razorpay:', error);
    });
  }, [])

  const fetchCourts = async () => {
    setIsLoadingCourts(true)
    try {
      const response = await fetch(`/api/venues/${venueId}/courts`)
      if (response.ok) {
        const data = await response.json()
        setCourts(data.courts || [])
      }
    } catch (error) {
      console.error('Error fetching courts:', error)
    } finally {
      setIsLoadingCourts(false)
    }
  }

  const fetchTimeSlots = async () => {
    setIsLoadingTimeSlots(true)
    try {
      const response = await fetch(
        `/api/venues/${venueId}/time-slots?date=${selectedDate}&courtId=${selectedCourt.id}`
      )
      if (response.ok) {
        const data = await response.json()
        setTimeSlots(data.timeSlots || [])
      }
    } catch (error) {
      console.error('Error fetching time slots:', error)
    } finally {
      setIsLoadingTimeSlots(false)
    }
  }

  const handleCourtSelect = (court) => {
    setSelectedCourt(court)
    setSelectedTimeSlots([]) // Reset time slots when court changes
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTimeSlots([]) // Reset time slots when date changes
  }

  const handleTimeSlotSelect = (timeSlot) => {
    if (!timeSlot.available) return

    setSelectedTimeSlots(prev => {
      const isAlreadySelected = prev.some(slot => slot.id === timeSlot.id)
      if (isAlreadySelected) {
        // Remove if already selected
        return prev.filter(slot => slot.id !== timeSlot.id)
      } else {
        // Add if not selected
        return [...prev, timeSlot]
      }
    })
  }

  const handleProceedToConfirmation = () => {
    if (selectedCourt && selectedDate && selectedTimeSlots.length > 0) {
      setBookingStep(2)
    }
  }

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      alert('Please login to proceed with booking')
      return
    }

    setIsSubmittingBooking(true)

    try {
             const response = await fetch('/api/bookings', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           venueId,
           courtId: selectedCourt.id.toString(), // Ensure ID is string for MongoDB
           courtName: selectedCourt.name,
           courtType: selectedCourt.type,
           courtPrice: selectedCourt.price,
           date: selectedDate,
           timeSlots: selectedTimeSlots.map(slot => ({
             id: slot.id.toString(),
             time: slot.time,
             startTime: slot.startTime,
             endTime: slot.endTime,
             price: slot.price || selectedCourt.price // Use slot price if available, else court price
           })),
           totalAmount: getFinalTotal(),
           userId: user?._id || user?.id || null, // Use _id for MongoDB
           userName: user?.fullname || 'Guest User',
           userEmail: user?.email || null
         }),
       })

      if (response.ok) {
        const data = await response.json()
        setPaymentDetails({
          bookingReference: data.bookingReference,
          totalAmount: data.totalAmount
        })
        setBookingStep(3)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setIsSubmittingBooking(false)
    }
  }

  const handlePayment = async () => {
    try {
      console.log('Starting payment process...');
      
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        console.log('Razorpay not loaded, attempting to load script...');
        await loadRazorpayScript();
        
        // Wait a bit for the script to fully initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!window.Razorpay) {
          throw new Error('Razorpay script failed to load');
        }
      }

      const finalTotal = getFinalTotal();
      console.log('Creating order with amount:', { 
        finalTotal, 
        type: typeof finalTotal,
        isNumber: !isNaN(finalTotal),
        getTotalPrice: getTotalPrice(),
        getTax: getTax()
      });
      
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Order creation failed:', errorData);
        throw new Error(errorData.message || 'Failed to create order');
      }
      
      const order = await res.json();
      console.log('Order created:', order);
      
      // Validate order amount
      if (!order.amount || order.amount <= 0) {
        throw new Error('Invalid order amount received from server');
      }
      
      // Additional validation for Razorpay
      if (!order.id || !order.currency) {
        throw new Error('Invalid order data received from server');
      }

      // Check if we have a valid Razorpay key
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      console.log('Razorpay key check:', { 
        hasKey: !!razorpayKey, 
        keyValue: razorpayKey,
        isPlaceholder: razorpayKey === 'your_razorpay_key_id_here'
      });
      
      if (!razorpayKey || razorpayKey === 'your_razorpay_key_id_here') {
        console.log('No valid Razorpay key, using demo mode');
        // Use demo mode if no valid key
        setPaymentDetails({
          bookingReference: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          totalAmount: getFinalTotal(),
          demoMode: true
        });
        setBookingStep(4);
        return;
      }

      // Validate Razorpay options
      if (!razorpayKey || !order.amount || !order.id) {
        throw new Error('Invalid Razorpay configuration or order data');
      }
      
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: "QuickCourt",
        description: "Court Slot Booking",
        order_id: order.id,
        handler: function (response) {
          console.log('Payment successful:', response);
          setPaymentDetails(prev => ({ ...prev, ...response }))
          setBookingStep(4);
        },
        prefill: {
          name: user?.fullname || "Customer Name",
          email: user?.email || "customer@email.com",
          contact: "9999999999",
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
          }
        },
        onerror: function (error) {
          console.error('Razorpay error:', error);
          const errorMessage = error.error?.description || error.error?.message || 'Unknown payment error';
          console.log('Payment failed, switching to demo mode');
          
          // Instead of showing an error, automatically switch to demo mode
          setPaymentDetails({
            bookingReference: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            totalAmount: getFinalTotal(),
            demoMode: true,
            error: errorMessage
          });
          setBookingStep(4);
        }
      };

      console.log('Opening Razorpay with options:', {
        key: options.key ? 'Set' : 'Not Set',
        amount: options.amount,
        currency: options.currency,
        order_id: options.order_id,
        name: options.name,
        description: options.description
      });
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      
      // Fallback: Simulate successful payment for demo purposes
      if (error.message.includes('Razorpay') || error.message.includes('script')) {
        console.log('Razorpay not available, using demo mode');
        setPaymentDetails({
          bookingReference: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          totalAmount: getFinalTotal(),
          demoMode: true
        });
        setBookingStep(4);
      } else {
        // Show more specific error message
        alert('Payment initialization failed: ' + error.message + '\n\nUsing demo mode instead.');
        
        // Still proceed with demo mode
        setPaymentDetails({
          bookingReference: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          totalAmount: getFinalTotal(),
          demoMode: true
        });
        setBookingStep(4);
      }
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.Razorpay) {
        console.log('Razorpay already loaded');
        resolve();
        return;
      }

      // Check if script is already being loaded
      if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
        console.log('Razorpay script already loading, waiting...');
        // Wait for existing script to load
        const checkRazorpay = setInterval(() => {
          if (window.Razorpay) {
            clearInterval(checkRazorpay);
            console.log('Razorpay loaded from existing script');
            resolve();
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkRazorpay);
          reject(new Error('Timeout waiting for existing Razorpay script'));
        }, 10000);
        return;
      }

      console.log('Loading Razorpay script...');
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        // Wait a bit more for the script to fully initialize
        setTimeout(() => {
          if (window.Razorpay) {
            resolve();
          } else {
            reject(new Error('Razorpay not available after script load'));
          }
        }, 500);
      };
      
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        reject(new Error('Failed to load Razorpay script'));
      };
      
      // Add timeout for script loading
      setTimeout(() => {
        if (!window.Razorpay) {
          reject(new Error('Razorpay script loading timeout'));
        }
      }, 15000);
      
      document.body.appendChild(script);
    });
  };

  const getTotalPrice = () => {
    if (!selectedCourt || selectedTimeSlots.length === 0) return 0
    return selectedTimeSlots.reduce((total, slot) => total + (slot.price || selectedCourt.price), 0)
  }

  const getTax = () => {
    return Math.round(getTotalPrice() * 0.18)
  }

  const getFinalTotal = () => {
    return getTotalPrice() + getTax()
  }

  const getTotalHours = () => {
    return selectedTimeSlots.length
  }

  // Success Step
  if (bookingStep === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your court has been successfully booked. You will receive a confirmation email shortly.
            </p>
            
            {/* Payment Details */}
            {paymentDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">Payment Details</h3>
                <div className="text-sm space-y-1">
                  {paymentDetails.razorpay_payment_id && (
                    <p><strong>Payment ID:</strong> {paymentDetails.razorpay_payment_id}</p>
                  )}
                  {paymentDetails.razorpay_order_id && (
                    <p><strong>Order ID:</strong> {paymentDetails.razorpay_order_id}</p>
                  )}
                  <p><strong>Booking Reference:</strong> {paymentDetails.bookingReference}</p>
                </div>
                <div className="text-green-600 font-bold mt-2">
                  {paymentDetails.demoMode ? (
                    'Demo Mode: Payment Simulated Successfully!'
                  ) : (
                    'Payment Successful via Razorpay!'
                  )}
                </div>
                {paymentDetails.demoMode && (
                  <p className="text-xs text-gray-500 mt-1">
                    This is a demo booking. In production, real payment processing would occur.
                  </p>
                )}
                {paymentDetails.error && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> Payment gateway error occurred: {paymentDetails.error}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Booking Details</h3>
              <div className="text-sm space-y-1">
                <p><strong>Venue:</strong> {venue.name}</p>
                <p><strong>Court:</strong> {selectedCourt?.name}</p>
                <p><strong>Date:</strong> {selectedDate}</p>
                <p><strong>Time Slots:</strong> {selectedTimeSlots.length} slots</p>
                <p><strong>Total Hours:</strong> {getTotalHours()} hours</p>
                <p><strong>Total Paid:</strong> ₹{getFinalTotal()}</p>
              </div>
            </div>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => router.push("/bookings")}>
                View My Bookings
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/")}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Payment Step
  if (bookingStep === 3) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
            <p className="text-gray-600">Complete your booking payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      You will be redirected to Razorpay secure payment gateway.
                    </p>
                    
                    {/* Debug Information */}
                    <div className="bg-gray-50 p-3 rounded-lg text-xs">
                      <p className="font-medium mb-2">Debug Info:</p>
                      <p>Razorpay Key: {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'Set' : 'Not Set'}</p>
                      <p>Window.Razorpay: {typeof window !== 'undefined' && window.Razorpay ? 'Available' : 'Not Available'}</p>
                      <p>Environment: {process.env.NODE_ENV}</p>
                    </div>
                    
                    {paymentDetails?.bookingReference && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Booking Reference:</strong> {paymentDetails.bookingReference}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Court Fee ({getTotalHours()} hours)</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>₹{getTax()}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{getFinalTotal()}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-6" 
                    onClick={handlePayment}
                    disabled={isSubmittingBooking}
                  >
                    {isSubmittingBooking ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </Button>
                  
                  {/* Fallback Demo Payment Button */}
                  <Button 
                    variant="outline"
                    className="w-full mt-3" 
                    onClick={() => {
                      console.log('Using demo payment mode');
                      setPaymentDetails({
                        bookingReference: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
                        totalAmount: getFinalTotal(),
                        demoMode: true
                      });
                      setBookingStep(4);
                    }}
                  >
                    Demo Payment (Skip Razorpay)
                  </Button>
                  
                  {/* Fallback Demo Payment Button */}
                  <Button 
                    variant="outline"
                    className="w-full mt-3" 
                    onClick={() => {
                      console.log('Using demo payment mode');
                      setPaymentDetails({
                        bookingReference: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
                        totalAmount: getFinalTotal(),
                        demoMode: true
                      });
                      setBookingStep(4);
                    }}
                  >
                    Demo Payment (Skip Razorpay)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Confirmation Step
  if (bookingStep === 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Confirm Booking</h1>
            <p className="text-gray-600">Review your booking details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <h3 className="font-semibold">{venue.name}</h3>
                        <p className="text-gray-600">{venue.address || 'Location not specified'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Users className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <h3 className="font-semibold">Court Details</h3>
                        <p className="text-gray-600">
                          {selectedCourt?.name} - {selectedCourt?.type} ({venue.sport})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <h3 className="font-semibold">Date & Time</h3>
                        <p className="text-gray-600">
                          {selectedDate} - {selectedTimeSlots.length} time slots
                        </p>
                        <div className="mt-2 space-y-1">
                          {selectedTimeSlots.map((slot, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              • {slot.time}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Free cancellation up to 2 hours before booking time</li>
                    <li>• 50% refund for cancellations between 2-24 hours</li>
                    <li>• No refund for cancellations within 2 hours or no-shows</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Court Fee ({getTotalHours()} hours)</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>₹{getTax()}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{getFinalTotal()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={handleConfirmBooking}
                      disabled={isSubmittingBooking}
                    >
                      {isSubmittingBooking ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Booking...
                        </>
                      ) : (
                        'Proceed to Payment'
                      )}
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={() => setBookingStep(1)}>
                      Back to Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Selection Step (Step 1)
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
            <li>
              <a href={`/venues/${venueId}`} className="hover:text-blue-600">
                {venue.name}
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-900">Book Court</li>
          </ol>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Court</h1>
          <div className="flex items-center mt-2 text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
                              {venue.name} - {venue.address || 'Location not specified'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 14 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() + i)
                    const dateStr = date.toLocaleDateString("en-GB")
                    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

                    return (
                      <button
                        key={i}
                        onClick={() => handleDateSelect(dateStr)}
                        className={`p-3 text-center rounded-lg border transition-colors ${
                          selectedDate === dateStr
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="text-xs text-gray-500">{dayName}</div>
                        <div className="font-medium">{date.getDate()}</div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Court Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Select Court
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingCourts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading courts...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courts.map((court) => (
                      <button
                        key={court.id}
                        onClick={() => court.available && handleCourtSelect(court)}
                        disabled={!court.available}
                        className={`p-4 rounded-lg border text-left transition-colors ${
                          selectedCourt?.id === court.id
                            ? "bg-blue-600 text-white border-blue-600"
                            : court.available
                              ? "bg-white hover:bg-gray-50 border-gray-200"
                              : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{court.name}</h3>
                          <Badge variant={court.available ? "default" : "secondary"}>
                            {court.available ? "Available" : "Booked"}
                          </Badge>
                        </div>
                        <p
                          className={`text-sm mb-2 ${selectedCourt?.id === court.id ? "text-blue-100" : "text-gray-600"}`}
                        >
                          {court.type}
                        </p>
                        <p className={`font-bold ${selectedCourt?.id === court.id ? "text-white" : "text-blue-600"}`}>
                          ₹{court.price}/hour
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time Slot Selection */}
            {selectedCourt && selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Select Time Slots
                    {selectedTimeSlots.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedTimeSlots.length} selected
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingTimeSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading time slots...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {timeSlots.map((slot) => {
                          const isSelected = selectedTimeSlots.some(selected => selected.id === slot.id)
                          return (
                            <button
                              key={slot.id}
                              onClick={() => handleTimeSlotSelect(slot)}
                              disabled={!slot.available}
                              className={`p-3 rounded-lg border text-center transition-colors ${
                                isSelected
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : slot.available
                                    ? "bg-white hover:bg-gray-50 border-gray-200"
                                    : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                              }`}
                            >
                              <div className="text-sm font-medium">{slot.time}</div>
                              {slot.price && (
                                <div className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                                  ₹{slot.price}
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                      
                      {selectedTimeSlots.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Selected Time Slots:</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedTimeSlots.map((slot, index) => (
                              <Badge key={index} variant="default" className="bg-blue-600">
                                {slot.time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Venue</h4>
                    <p className="text-sm text-gray-600">{venue.name}</p>
                    <p className="text-sm text-gray-600">{venue.address || 'Location not specified'}</p>
                  </div>

                  {selectedCourt && (
                    <div>
                      <h4 className="font-medium text-gray-900">Court</h4>
                      <p className="text-sm text-gray-600">
                        {selectedCourt.name} - {selectedCourt.type}
                      </p>
                    </div>
                  )}

                  {selectedDate && (
                    <div>
                      <h4 className="font-medium text-gray-900">Date</h4>
                      <p className="text-sm text-gray-600">{selectedDate}</p>
                    </div>
                  )}

                  {selectedTimeSlots.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900">Time Slots</h4>
                      <p className="text-sm text-gray-600">{selectedTimeSlots.length} slots selected</p>
                      <p className="text-sm text-gray-600">Total: {getTotalHours()} hours</p>
                    </div>
                  )}

                  {selectedCourt && selectedTimeSlots.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="text-lg font-bold text-blue-600">₹{getTotalPrice()}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">+ taxes will be calculated at checkout</p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full mt-6"
                  onClick={handleProceedToConfirmation}
                  disabled={!selectedCourt || !selectedDate || selectedTimeSlots.length === 0}
                >
                  Proceed to Confirmation
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Select multiple time slots for consecutive hours</li>
                  <li>• Book in advance for better availability</li>
                  <li>• Premium courts have better lighting</li>
                  <li>• Equipment rental available on-site</li>
                  <li>• Free cancellation up to 2 hours before</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
