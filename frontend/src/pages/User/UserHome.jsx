import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Avatar,
  Chip,
  Rating,
} from '@mui/material';
import {
  TrendingUp,
  LocationOn,
  Schedule,
  SportsBaseball,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PageHeader, StatsCard } from '../../components/Common';

const UserHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { venues, bookings } = useApp();

  const userBookings = bookings.filter(booking => booking.userId === user?.id);
  const upcomingBookings = userBookings.filter(booking => 
    new Date(booking.date) >= new Date()
  );

  const popularVenues = venues.slice(0, 3);

  const stats = [
    {
      title: 'Total Bookings',
      value: userBookings.length,
      icon: <SportsBaseball />,
      color: 'primary',
    },
    {
      title: 'Upcoming Games',
      value: upcomingBookings.length,
      icon: <Schedule />,
      color: 'success',
    },
    {
      title: 'Favorite Sport',
      value: 'Badminton',
      icon: <TrendingUp />,
      color: 'info',
    },
  ];

  return (
    <Box>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]}! 🏆`}
        subtitle="Ready for your next game? Check out popular venues and your upcoming bookings."
      />

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Upcoming Bookings */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Upcoming Bookings
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/app/user/bookings')}
                >
                  View All
                </Button>
              </Box>

              {upcomingBookings.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <SportsBaseball sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    No upcoming bookings
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/app/user/venues')}
                  >
                    Book a Court
                  </Button>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {upcomingBookings.slice(0, 3).map((booking) => (
                    <Card key={booking.id} variant="outlined">
                      <CardContent sx={{ py: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {booking.venueName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {booking.courtName} • {booking.sport}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(booking.date).toLocaleDateString()} • {booking.timeSlot}
                            </Typography>
                          </Box>
                          <Chip
                            label={booking.status}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Popular Venues */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Popular Venues
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/app/user/venues')}
                >
                  View All
                </Button>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                {popularVenues.map((venue) => (
                  <Card 
                    key={venue.id} 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 2 }
                    }}
                    onClick={() => navigate(`/app/user/venue/${venue.id}`)}
                  >
                    <Box display="flex">
                      <CardMedia
                        component="img"
                        sx={{ width: 100, height: 80 }}
                        image={venue.images[0]}
                        alt={venue.name}
                      />
                      <CardContent sx={{ flex: 1, py: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" noWrap>
                          {venue.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                          <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {venue.location}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Rating value={venue.rating} size="small" readOnly precision={0.5} />
                          <Typography variant="body2" color="primary.main" fontWeight="bold">
                            {venue.priceRange}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Box>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate('/app/user/venues')}
                sx={{ py: 2 }}
              >
                Find Venues
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate('/app/user/bookings')}
                sx={{ py: 2 }}
              >
                My Bookings
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate('/app/user/profile')}
                sx={{ py: 2 }}
              >
                My Profile
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{ py: 2 }}
              >
                Join Groups
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserHome;
