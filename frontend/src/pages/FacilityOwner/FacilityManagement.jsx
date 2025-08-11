import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Chip, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { Add, Edit, Business } from '@mui/icons-material';
import { PageHeader } from '../../components/Common';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const FacilityManagement = () => {
  const { facilities, addFacility } = useApp();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', description: '', sports: [] });

  const ownerFacilities = facilities.filter(facility => facility.ownerId === user?.id);

  const handleSubmit = () => {
    addFacility({ ...formData, ownerId: user.id });
    setOpen(false);
    setFormData({ name: '', location: '', description: '', sports: [] });
  };

  return (
    <Box>
      <PageHeader
        title="Facility Management"
        subtitle="Manage your sports facilities and venues"
        actionLabel="Add New Facility"
        onActionClick={() => setOpen(true)}
      />

      <Grid container spacing={3}>
        {ownerFacilities.map((facility) => (
          <Grid item xs={12} md={6} lg={4} key={facility.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {facility.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {facility.location}
                </Typography>
                <Box mb={2}>
                  {facility.sports.slice(0, 3).map((sport, idx) => (
                    <Chip key={idx} label={sport} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </Box>
                <Chip 
                  label={facility.status} 
                  color={facility.status === 'approved' ? 'success' : 'warning'} 
                  size="small" 
                />
                <Button variant="outlined" size="small" sx={{ mt: 2, width: '100%' }}>
                  <Edit sx={{ mr: 1 }} /> Manage
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Facility</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Facility Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add Facility</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacilityManagement;
