import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Grid } from '@mui/material';
import { PageHeader } from '../../components/Common';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const OwnerBookings = () => {
  const { bookings, facilities } = useApp();
  const { user } = useAuth();

  const ownerFacilities = facilities.filter(f => f.ownerId === user?.id);
  const ownerBookings = bookings.filter(booking => 
    ownerFacilities.some(facility => facility.id === booking.venueId)
  );

  return (
    <Box>
      <PageHeader title="Bookings Overview" subtitle="View and manage all bookings for your facilities" />
      
      <Grid container spacing={3}>
        {ownerBookings.map((booking) => (
          <Grid item xs={12} md={6} lg={4} key={booking.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{booking.venueName}</Typography>
                <Typography variant="body2">{booking.courtName} • {booking.sport}</Typography>
                <Typography variant="body2">{new Date(booking.date).toLocaleDateString()} • {booking.timeSlot}</Typography>
                <Typography variant="h6" color="primary.main">₹{booking.totalAmount}</Typography>
                <Chip label={booking.status} color="success" size="small" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OwnerBookings;
