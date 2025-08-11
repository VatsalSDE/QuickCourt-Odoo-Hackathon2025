import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Chip } from '@mui/material';
import { PageHeader } from '../../components/Common';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const CourtManagement = () => {
  const { courts, facilities } = useApp();
  const { user } = useAuth();

  const ownerFacilities = facilities.filter(f => f.ownerId === user?.id);
  const ownerCourts = courts.filter(court => 
    ownerFacilities.some(facility => facility.id === court.venueId)
  );

  return (
    <Box>
      <PageHeader
        title="Court Management"
        subtitle="Manage courts, pricing, and availability"
        actionLabel="Add New Court"
      />

      <Grid container spacing={3}>
        {ownerCourts.map((court) => (
          <Grid item xs={12} md={6} lg={4} key={court.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{court.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Sport: {court.sport}
                </Typography>
                <Typography variant="h6" color="primary.main">
                  ₹{court.pricePerHour}/hour
                </Typography>
                <Chip label={court.status} color="success" size="small" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourtManagement;
