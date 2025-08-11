# Review Features for QuickCourt Venues

## Overview
The venue detail page now includes comprehensive review functionality that allows users to rate venues, write reviews, and view feedback from other users.

## Features Added

### 1. Static Map Image
- **Location Tab**: Added a new "Location" tab in the venue details
- **Map Display**: Shows a static map image with venue address
- **Fallback**: Uses placeholder images if map files are not available
- **Responsive**: Map scales properly on all device sizes

### 2. Review System
- **Review Form**: Interactive form for authenticated users to submit reviews
- **Rating System**: 5-star rating system with visual star selection
- **Comment Input**: Textarea for detailed review comments
- **User Authentication**: Only logged-in users can submit reviews
- **Form Validation**: Ensures all required fields are filled

### 3. Review Display
- **Real-time Updates**: Reviews are fetched from the backend API
- **Chronological Order**: Most recent reviews appear first
- **Rating Visualization**: Star ratings displayed for each review
- **Date Formatting**: Human-readable timestamps (e.g., "2 days ago")
- **Empty State**: Friendly message when no reviews exist

## Technical Implementation

### Backend API
- **Endpoint**: `/api/venues/[id]/reviews`
- **GET**: Fetches all reviews for a specific venue
- **POST**: Creates new reviews and updates venue rating
- **Database**: MongoDB with proper validation and indexing

### Frontend Components
- **Review Form**: Built with shadcn/ui components
- **State Management**: React hooks for form state and API calls
- **Authentication**: Integrates with existing auth context
- **Error Handling**: User-friendly error messages and validation

### Database Schema
```javascript
{
  venueId: String,        // Reference to venue
  rating: Number,          // 1-5 star rating
  comment: String,         // Review text
  userName: String,        // Reviewer's name
  userEmail: String,       // Optional email
  createdAt: Date,         // Review timestamp
  updatedAt: Date          // Last update timestamp
}
```

## Usage Instructions

### For Users
1. **Navigate** to any venue detail page
2. **Click** the "Reviews" tab
3. **Login** if not already authenticated
4. **Fill** the review form with rating and comment
5. **Submit** the review
6. **View** your review and others in the list

### For Developers
1. **Database Setup**: Run the initialization script
2. **Environment Variables**: Ensure MongoDB connection is configured
3. **API Testing**: Test the review endpoints
4. **Frontend Testing**: Verify review form and display functionality

## API Endpoints

### GET /api/venues/[id]/reviews
Fetches all reviews for a specific venue.

**Response:**
```json
{
  "reviews": [
    {
      "_id": "review_id",
      "venueId": "venue_id",
      "rating": 5,
      "comment": "Great venue!",
      "userName": "John Doe",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

### POST /api/venues/[id]/reviews
Creates a new review for a venue.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent facility",
  "userName": "John Doe",
  "userEmail": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Review added successfully",
  "review": {
    "_id": "new_review_id",
    "venueId": "venue_id",
    "rating": 5,
    "comment": "Excellent facility",
    "userName": "John Doe",
    "createdAt": "2024-01-20T10:00:00Z"
  }
}
```

## Future Enhancements

### Planned Features
- **Review Moderation**: Admin approval system
- **Photo Reviews**: Allow users to upload venue photos
- **Review Replies**: Venue owners can respond to reviews
- **Review Filtering**: Sort by rating, date, or helpfulness
- **Review Analytics**: Dashboard for venue performance

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live review updates
- **Image Upload**: Cloud storage for review photos
- **Search & Filter**: Advanced review search functionality
- **Mobile Optimization**: Enhanced mobile review experience

## Troubleshooting

### Common Issues
1. **Reviews Not Loading**: Check MongoDB connection and API endpoints
2. **Form Submission Fails**: Verify user authentication status
3. **Map Not Displaying**: Check if map placeholder images exist
4. **Rating Not Updating**: Ensure venue rating calculation is working

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify API responses in Network tab
3. Check MongoDB logs for database errors
4. Test API endpoints with Postman or similar tools

## Security Considerations

### Input Validation
- Rating must be between 1-5
- Comment length validation
- User authentication required
- XSS protection for user input

### Rate Limiting
- Consider implementing review submission limits
- Prevent spam reviews from same user
- Monitor for suspicious activity

### Data Privacy
- User emails are optional and not publicly displayed
- Review data is stored securely in MongoDB
- Consider GDPR compliance for user data

---

**Note**: This review system is designed to enhance user engagement and provide valuable feedback for venue owners. Regular monitoring and moderation may be required as the platform grows.
