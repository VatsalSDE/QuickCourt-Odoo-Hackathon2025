import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  Business,
  CalendarMonth,
  AttachMoney,
  Sports,
  People,
} from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PageHeader, StatsCard } from '../../components/Common';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, facilities, courts } = useApp();

  const ownerFacilities = facilities.filter(facility => facility.ownerId === user?.id);
  const ownerBookings = bookings.filter(booking => 
    ownerFacilities.some(facility => facility.id === booking.venueId)
  );

  const todaysBookings = ownerBookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    const bookingDate = booking.date.split('T')[0];
    return bookingDate === today;
  });

  const totalRevenue = ownerBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const ownerCourts = courts.filter(court => 
    ownerFacilities.some(facility => facility.id === court.venueId)
  );

  const stats = [
    {
      title: 'Total Bookings',
      value: ownerBookings.length,
      icon: <CalendarMonth />,
      color: 'primary',
      trend: 'up',
      trendValue: '+12%',
    },
    {
      title: 'Active Courts',
      value: ownerCourts.length,
      icon: <Sports />,
      color: 'success',
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <AttachMoney />,
      color: 'info',
      trend: 'up',
      trendValue: '+8%',
    },
    {
      title: 'Facilities',
      value: ownerFacilities.length,
      icon: <Business />,
      color: 'warning',
    },
  ];

  // Mock data for charts
  const bookingTrends = [
    { date: 'Jan', bookings: 45, revenue: 13500 },
    { date: 'Feb', bookings: 52, revenue: 15600 },
    { date: 'Mar', bookings: 61, revenue: 18300 },
    { date: 'Apr', bookings: 58, revenue: 17400 },
    { date: 'May', bookings: 67, revenue: 20100 },
    { date: 'Jun', bookings: 72, revenue: 21600 },
  ];

  const sportDistribution = [
    { name: 'Badminton', value: 45, color: '#1976d2' },
    { name: 'Tennis', value: 25, color: '#dc004e' },
    { name: 'Basketball', value: 20, color: '#2e7d32' },
    { name: 'Others', value: 10, color: '#ed6c02' },
  ];

  const peakHours = [
    { hour: '6-7', bookings: 8 },
    { hour: '7-8', bookings: 12 },
    { hour: '8-9', bookings: 15 },
    { hour: '9-10', bookings: 10 },
    { hour: '10-11', bookings: 8 },
    { hour: '17-18', bookings: 18 },
    { hour: '18-19', bookings: 22 },
    { hour: '19-20', bookings: 20 },
    { hour: '20-21', bookings: 16 },
  ];

  return (
    <Box>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]}! 🏢`}
        subtitle="Here's what's happening with your facilities today"
      />

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Booking Trends Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Booking & Revenue Trends
              </Typography>
              <LineChart
                width={800}
                height={300}
                series={[
                  {
                    data: bookingTrends.map(item => item.bookings),
                    label: 'Bookings',
                  },
                  {
                    data: bookingTrends.map(item => item.revenue / 100),
                    label: 'Revenue (₹00s)',
                  },
                ]}
                xAxis={[{
                  scaleType: 'point',
                  data: bookingTrends.map(item => item.date)
                }]}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Bookings */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Today's Bookings
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/app/owner/bookings')}
                >
                  View All
                </Button>
              </Box>

              {todaysBookings.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <CalendarMonth sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No bookings today
                  </Typography>
                </Box>
              ) : (
                <List>
                  {todaysBookings.slice(0, 5).map((booking) => (
                    <ListItem key={booking.id} sx={{ px: 0 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <Sports />
                      </Avatar>
                      <ListItemText
                        primary={booking.courtName}
                        secondary={`${booking.timeSlot} • ₹${booking.totalAmount}`}
                      />
                      <Chip
                        label={booking.status}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sport Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Popular Sports
              </Typography>
              <Box height={250}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sportDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sportDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Peak Hours */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Peak Booking Hours
              </Typography>
              <Box height={250}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
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
                    onClick={() => navigate('/app/owner/facilities')}
                    sx={{ py: 2 }}
                  >
                    Manage Facilities
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/app/owner/courts')}
                    sx={{ py: 2 }}
                  >
                    Manage Courts
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/app/owner/bookings')}
                    sx={{ py: 2 }}
                  >
                    View Bookings
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/app/owner/profile')}
                    sx={{ py: 2 }}
                  >
                    Profile Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnerDashboard;
