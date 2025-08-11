import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Rating,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  CheckCircle,
  Star,
  Person,
  ArrowBack,
  Sports,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/Common';

const VenueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { venues, courts } = useApp();
  const [activeTab, setActiveTab] = useState(0);

  const venue = venues.find(v => v.id === parseInt(id));
  const venueCourts = courts.filter(court => court.venueId === parseInt(id));

  if (!venue) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6">Venue not found</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/app/user/venues')}
          sx={{ mt: 2 }}
        >
          Back to Venues
        </Button>
      </Box>
    );
  }

  const mockReviews = [
    {
      id: 1,
      name: 'Alex Kumar',
      rating: 5,
      comment: 'Amazing facilities! Well maintained courts and great amenities.',
      date: '2024-01-15',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      rating: 4,
      comment: 'Good courts, reasonable pricing. Could use better parking.',
      date: '2024-01-10',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 3,
      name: 'Rahul Singh',
      rating: 5,
      comment: 'Perfect for badminton! Great lighting and ventilation.',
      date: '2024-01-08',
      avatar: '/api/placeholder/40/40',
    },
  ];

  const TabPanel = ({ children, value, index }) => {
    return (
      <div hidden={value !== index}>
        {value === index && <Box pt={3}>{children}</Box>}
      </div>
    );
  };

  return (
    <Box>
      <PageHeader
        title={venue.name}
        breadcrumbs={[
          { label: 'Venues', href: '/app/user/venues' },
          { label: venue.name },
        ]}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/app/user/venues')}
          >
            Back to Venues
          </Button>
        }
      />

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          {/* Image Gallery */}
          <Card sx={{ mb: 3 }}>
            <ImageList
              sx={{ width: '100%', height: 400 }}
              cols={venue.images.length > 1 ? 2 : 1}
              rowHeight={200}
            >
              {venue.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={image}
                    alt={`${venue.name} - ${index + 1}`}
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Card>

          {/* Tabs Section */}
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Overview" />
                <Tab label="Courts & Pricing" />
                <Tab label={`Reviews (${mockReviews.length})`} />
              </Tabs>
            </Box>

            <CardContent>
              <TabPanel value={activeTab} index={0}>
                <Typography variant="h6" gutterBottom>
                  About This Venue
                </Typography>
                <Typography variant="body1" paragraph>
                  {venue.description}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Sports Available
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                  {venue.sports.map((sport, index) => (
                    <Chip
                      key={index}
                      label={sport}
                      icon={<Sports />}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  Amenities
                </Typography>
                <List dense>
                  {venue.amenities.map((amenity, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary={amenity} />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Typography variant="h6" gutterBottom>
                  Available Courts
                </Typography>
                {venueCourts.length === 0 ? (
                  <Typography color="text.secondary">
                    No courts available at this venue.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {venueCourts.map((court) => (
                      <Grid item xs={12} sm={6} key={court.id}>
                        <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {court.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Sport: {court.sport}
                          </Typography>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            ₹{court.pricePerHour}/hour
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Operating Hours: {court.operatingHours.start} - {court.operatingHours.end}
                          </Typography>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate(`/app/user/book/${venue.id}/${court.id}`)}
                            sx={{ mt: 2 }}
                          >
                            Book Now
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Box display="flex" flexDirection="column" gap={3}>
                  {mockReviews.map((review) => (
                    <Box key={review.id}>
                      <Box display="flex" alignItems="flex-start" gap={2}>
                        <Avatar src={review.avatar} alt={review.name}>
                          {review.name.charAt(0)}
                        </Avatar>
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {review.name}
                            </Typography>
                            <Rating value={review.rating} size="small" readOnly />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(review.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {review.comment}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  ))}
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          {/* Venue Info Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <LocationOn color="action" />
                <Typography variant="body2" color="text.secondary">
                  {venue.location}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Star color="action" />
                <Rating value={venue.rating} size="small" readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary">
                  ({venue.totalReviews} reviews)
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Schedule color="action" />
                <Typography variant="body2" color="text.secondary">
                  Open 6:00 AM - 11:00 PM
                </Typography>
              </Box>

              <Typography variant="h5" color="primary.main" fontWeight="bold" mb={3}>
                {venue.priceRange}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => {
                  if (venueCourts.length > 0) {
                    navigate(`/app/user/book/${venue.id}/${venueCourts[0].id}`);
                  }
                }}
                disabled={venueCourts.length === 0}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contact Information
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Phone: +91 98765 43210
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email: info@{venue.name.toLowerCase().replace(/\s+/g, '')}.com
              </Typography>
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VenueDetailsPage;
