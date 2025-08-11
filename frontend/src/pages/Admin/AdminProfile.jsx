import React from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Grid, Avatar } from '@mui/material';
import { PageHeader } from '../../components/Common';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <Box>
      <PageHeader title="Admin Profile" subtitle="Manage your administrator account" />
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar src={user?.avatar} sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}>
                {user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="h5" fontWeight="bold">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              <Typography variant="body2" color="error.main">System Administrator</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Full Name" value={user?.name || ''} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" value={user?.email || ''} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Admin Notes" multiline rows={3} />
                </Grid>
              </Grid>
              <Button variant="contained" sx={{ mt: 3 }}>Save Changes</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminProfile;
