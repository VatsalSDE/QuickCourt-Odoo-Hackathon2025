import React from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Chip, CardMedia } from '@mui/material';
import { Check, Close, Visibility } from '@mui/icons-material';
import { PageHeader } from '../../components/Common';
import { useApp } from '../../context/AppContext';

const FacilityApproval = () => {
  const { facilities, updateFacility } = useApp();
  
  const pendingFacilities = facilities.filter(f => f.status === 'pending');

  const handleApprove = (facilityId) => {
    updateFacility(facilityId, { status: 'approved' });
  };

  const handleReject = (facilityId) => {
    updateFacility(facilityId, { status: 'rejected' });
  };

  return (
    <Box>
      <PageHeader
        title="Facility Approvals"
        subtitle={`${pendingFacilities.length} facilities pending approval`}
      />

      <Grid container spacing={3}>
        {pendingFacilities.map((facility) => (
          <Grid item xs={12} md={6} lg={4} key={facility.id}>
            <Card>
              {facility.images && (
                <CardMedia
                  component="img"
                  height="200"
                  image={facility.images[0]}
                  alt={facility.name}
                />
              )}
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {facility.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {facility.location}
                </Typography>
                <Typography variant="body2" paragraph>
                  {facility.description}
                </Typography>
                
                <Box mb={2}>
                  {facility.sports?.map((sport, idx) => (
                    <Chip key={idx} label={sport} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </Box>

                <Chip label="Pending Approval" color="warning" size="small" sx={{ mb: 2 }} />

                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<Check />}
                    onClick={() => handleApprove(facility.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<Close />}
                    onClick={() => handleReject(facility.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                  >
                    Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {pendingFacilities.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" gutterBottom>
              No pending approvals
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All facility registration requests have been processed.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default FacilityApproval;
