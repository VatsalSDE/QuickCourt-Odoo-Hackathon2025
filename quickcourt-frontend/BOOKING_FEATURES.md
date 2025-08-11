# Booking System Features for QuickCourt

## Overview
The QuickCourt booking system has been completely revamped to support multiple time slot selection, real-time data fetching from the database, and comprehensive booking management. Users can now select multiple consecutive time slots and the system automatically handles availability checking and conflict resolution.

## New Features Implemented

### 1. Multiple Time Slot Selection
- **Multi-Slot Booking**: Users can select multiple consecutive time slots for extended play sessions
- **Visual Selection**: Clear indication of selected time slots with badges and counters
- **Flexible Duration**: Support for 1-hour to multiple-hour bookings
- **Real-time Updates**: Selected slots are displayed in the booking summary

### 2. Real-Time Data Integration
- **Dynamic Court Loading**: Courts are fetched from the database based on venue
- **Live Availability**: Time slots show real-time availability based on existing bookings
- **Conflict Prevention**: System prevents double-booking of the same court/time
- **Database-Driven**: No more hardcoded dummy data

### 3. Enhanced Booking Flow
- **Step-by-Step Process**: Clear progression through selection, confirmation, and payment
- **Real-time Validation**: Immediate feedback on selection validity
- **Conflict Detection**: Automatic checking for booking conflicts
- **Payment Integration**: Seamless Razorpay payment processing

## Technical Implementation

### Backend API Endpoints

#### 1. Courts API (`/api/venues/[id]/courts`)
- **GET**: Fetches all courts for a specific venue
- **Fallback Data**: Provides default courts if none exist in database
- **Performance**: Indexed queries for fast retrieval

#### 2. Time Slots API (`/api/venues/[id]/time-slots`)
- **GET**: Fetches available time slots for a venue/date/court combination
- **Availability Check**: Considers existing bookings when determining availability
- **Conflict Resolution**: Prevents overlapping time slot selections
- **Dynamic Pricing**: Supports per-slot pricing variations

#### 3. Bookings API (`/api/bookings`)
- **POST**: Creates new bookings with multiple time slots
- **Conflict Validation**: Ensures no double-booking occurs
- **Bulk Insert**: Efficiently stores multiple time slot bookings
- **GET**: Retrieves user or venue-specific bookings

### Database Schema

#### Courts Collection
```javascript
{
  venueId: String,        // Reference to venue
  name: String,           // Court name (e.g., "Court A1")
  type: String,           // Court type (Premium/Standard/Economy)
  price: Number,          // Price per hour
  available: Boolean,     // Current availability status
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

#### Time Slots Collection
```javascript
{
  venueId: String,        // Reference to venue
  startTime: String,      // Start time (HH:MM format)
  endTime: String,        // End time (HH:MM format)
  time: String,           // Display time (e.g., "06:00 - 07:00")
  available: Boolean,     // Availability status
  price: Number,          // Price for this specific slot
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

#### Bookings Collection
```javascript
{
  venueId: String,        // Reference to venue
  courtId: String,        // Reference to court
  courtName: String,      // Court name for display
  courtType: String,      // Court type
  courtPrice: Number,     // Court price per hour
  date: String,           // Booking date
  startTime: String,      // Start time
  endTime: String,        // End time
  timeSlot: String,       // Display time slot
  amount: Number,         // Amount for this slot
  status: String,         // Booking status
  userId: String,         // User reference (optional)
  userName: String,       // User name
  userEmail: String,      // User email (optional)
  paymentStatus: String,  // Payment status
  bookingReference: String, // Unique booking reference
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### Frontend Components

#### State Management
- **Multi-Selection State**: `selectedTimeSlots` array for multiple slot selection
- **Loading States**: Separate loading indicators for courts and time slots
- **Real-time Updates**: Automatic refresh of availability data
- **Form Validation**: Comprehensive validation before proceeding

#### User Interface
- **Visual Feedback**: Clear indication of selected slots
- **Availability Display**: Real-time availability status
- **Selection Counter**: Badge showing number of selected slots
- **Responsive Design**: Mobile-friendly interface

## Usage Instructions

### For Users

#### 1. Select Date
- Choose from available dates (next 14 days)
- Date selection triggers time slot loading

#### 2. Select Court
- Choose from available courts at the venue
- Courts show type and pricing information
- Selection triggers time slot availability check

#### 3. Select Time Slots
- **Single Slot**: Click once to select
- **Multiple Slots**: Click multiple slots for consecutive hours
- **Visual Feedback**: Selected slots are highlighted in blue
- **Selection Summary**: Shows count and details of selected slots

#### 4. Review and Confirm
- Review selected slots and pricing
- Confirm booking details
- Proceed to payment

#### 5. Payment
- Razorpay integration for secure payment
- Booking confirmation with reference number

### For Developers

#### 1. Database Setup
```bash
# Run the initialization script
node scripts/init-booking-db.js
```

#### 2. Environment Configuration
```env
MONGODB_URI=mongodb://localhost:27017/quickcourt
MONGODB_DB=quickcourt
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

#### 3. API Testing
```bash
# Test courts endpoint
curl http://localhost:3000/api/venues/1/courts

# Test time slots endpoint
curl "http://localhost:3000/api/venues/1/time-slots?date=20/01/2025&courtId=1"

# Test booking creation
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"venueId":"1","courtId":"1","date":"20/01/2025","timeSlots":[...]}'
```

## Advanced Features

### 1. Conflict Resolution
- **Automatic Detection**: System detects overlapping bookings
- **Real-time Validation**: Immediate feedback on conflicts
- **Conflict Prevention**: Prevents creation of conflicting bookings

### 2. Dynamic Pricing
- **Per-Slot Pricing**: Different prices for different time slots
- **Court-Based Pricing**: Premium/Standard/Economy pricing tiers
- **Flexible Rate Structure**: Easy to modify pricing rules

### 3. Booking Management
- **Unique References**: Each booking gets a unique reference number
- **Status Tracking**: Comprehensive status management
- **Payment Integration**: Seamless payment processing

## Performance Optimizations

### 1. Database Indexing
- **Compound Indexes**: Optimized queries for common operations
- **Unique Constraints**: Prevents duplicate booking references
- **Efficient Queries**: Fast retrieval of availability data

### 2. Caching Strategy
- **Real-time Data**: Fresh data on every request
- **Efficient Updates**: Minimal database calls
- **Optimized Queries**: Reduced database load

### 3. Frontend Optimization
- **Lazy Loading**: Load data only when needed
- **State Management**: Efficient React state updates
- **User Experience**: Smooth, responsive interface

## Security Features

### 1. Input Validation
- **Server-side Validation**: Comprehensive validation on all inputs
- **Type Checking**: Strict data type enforcement
- **Range Validation**: Price and time range validation

### 2. Authentication
- **User Verification**: Login required for booking creation
- **Session Management**: Secure user session handling
- **Access Control**: Role-based access restrictions

### 3. Data Protection
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Cross-site request forgery prevention

## Troubleshooting

### Common Issues

#### 1. Time Slots Not Loading
- **Check**: Database connection and venue ID
- **Solution**: Verify MongoDB connection and venue data

#### 2. Booking Creation Fails
- **Check**: User authentication and input validation
- **Solution**: Ensure user is logged in and all fields are valid

#### 3. Availability Conflicts
- **Check**: Existing bookings and time slot overlap
- **Solution**: Verify no conflicting bookings exist

### Debug Steps

#### 1. Frontend Debugging
- Check browser console for JavaScript errors
- Verify API endpoint responses
- Check user authentication status

#### 2. Backend Debugging
- Check MongoDB connection logs
- Verify API endpoint functionality
- Check database collection structure

#### 3. Database Debugging
- Verify collection indexes
- Check data validation rules
- Monitor query performance

## Future Enhancements

### Planned Features
- **Recurring Bookings**: Weekly/monthly booking patterns
- **Group Bookings**: Multiple court simultaneous bookings
- **Advanced Scheduling**: Calendar-based booking interface
- **Notification System**: Email/SMS booking confirmations

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live availability
- **Advanced Analytics**: Booking pattern analysis
- **Mobile App**: Native mobile application
- **API Rate Limiting**: Enhanced security and performance

## Support and Maintenance

### Regular Maintenance
- **Database Optimization**: Regular index maintenance
- **Performance Monitoring**: Query performance tracking
- **Security Updates**: Regular security patches
- **Backup Management**: Automated backup procedures

### Monitoring and Alerts
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **Availability Monitoring**: System uptime tracking
- **User Feedback**: Continuous improvement based on user input

---

**Note**: This booking system is designed to handle high-volume court bookings with real-time availability management. Regular monitoring and optimization are recommended for optimal performance.
