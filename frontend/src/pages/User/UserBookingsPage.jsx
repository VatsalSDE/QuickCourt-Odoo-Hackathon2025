import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import {
  Schedule,
  LocationOn,
  Cancel,
  CheckCircle,
  Pending,
  Sports,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/Common';

const UserBookingsPage = () => {
  const navigate = useNavigate();
  const { bookings, updateBooking } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [cancelDialog, setCancelDialog] = useState({ open: false, booking: null });

  const userBookings = bookings.filter(booking => booking.userId === user?.id);

  const getFilteredBookings = () => {
    const now = new Date();
    switch (activeTab) {
      case 0: // All
        return userBookings;
      case 1: // Upcoming
        return userBookings.filter(booking => 
          new Date(booking.date) >= now && booking.status === 'confirmed'
        );
      case 2: // Past
        return userBookings.filter(booking => 
          new Date(booking.date) < now || booking.status === 'completed'
        );
      case 3: // Cancelled
        return userBookings.filter(booking => booking.status === 'cancelled');
      default:
        return userBookings;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle />;
      case 'cancelled':
        return <Cancel />;
      case 'completed':
        return <CheckCircle />;
      default:
        return <Pending />;
    }
  };

  const canCancelBooking = (booking) => {
    const bookingDateTime = new Date(`${booking.date.split('T')[0]}T${booking.timeSlot.split('-')[0]}:00`);
    const now = new Date();
    const hoursDiff = (bookingDateTime - now) / (1000 * 60 * 60);
    return booking.status === 'confirmed' && hoursDiff > 2;
  };

  const handleCancelBooking = () => {
    if (cancelDialog.booking) {
      updateBooking(cancelDialog.booking.id, { status: 'cancelled' });
      setCancelDialog({ open: false, booking: null });
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <Box>
      <PageHeader
        title="My Bookings"
        subtitle="Manage your court bookings and view booking history"
        actionLabel="Book New Court"
        onActionClick={() => navigate('/app/user/venues')}
      />

      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label={`All (${userBookings.length})`} />
          <Tab label={`Upcoming (${userBookings.filter(b => new Date(b.date) >= new Date() && b.status === 'confirmed').length})`} />
          <Tab label={`Past (${userBookings.filter(b => new Date(b.date) < new Date() || b.status === 'completed').length})`} />
          <Tab label={`Cancelled (${userBookings.filter(b => b.status === 'cancelled').length})`} />
        </Tabs>
      </Card>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Sports sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No bookings found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {activeTab === 0 
                ? "You haven't made any bookings yet. Start by exploring venues near you."
                : "No bookings in this category."
              }
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/app/user/venues')}
            >
              Find Venues
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredBookings.map((booking) => (
            <Grid item xs={12} md={6} lg={4} key={booking.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Sports />
                    </Avatar>
                    <Chip
                      icon={getStatusIcon(booking.status)}
                      label={booking.status.toUpperCase()}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                    {booking.venueName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {booking.courtName} • {booking.sport}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(booking.date).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Time: {booking.timeSlot}
                  </Typography>

                  <Typography variant="h6" color="primary.main" gutterBottom>
                    ₹{booking.totalAmount}
                  </Typography>

                  <Box display="flex" gap={1} mt={2}>
                    {canCancelBooking(booking) && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => setCancelDialog({ open: true, booking })}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/app/user/venue/${booking.venueId}`)}
                    >
                      View Venue
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, booking: null })}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your booking for {cancelDialog.booking?.venueName}?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. You may be charged a cancellation fee according to the venue's policy.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, booking: null })}>
            Keep Booking
          </Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserBookingsPage;
