import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  Upload,
  Sports,
  Schedule,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PageHeader, StatsCard } from '../../components/Common';

const UserProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { bookings } = useApp();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [success, setSuccess] = useState(false);

  const userBookings = bookings.filter(booking => booking.userId === user?.id);
  const upcomingBookings = userBookings.filter(booking => 
    new Date(booking.date) >= new Date() && booking.status === 'confirmed'
  );

  const stats = [
    {
      title: 'Total Bookings',
      value: userBookings.length,
      icon: <Sports />,
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
      icon: <Sports />,
      color: 'info',
    },
  ];

  const recentActivity = [
    { id: 1, action: 'Booked court at SportZone Arena', date: '2024-01-15', type: 'booking' },
    { id: 2, action: 'Cancelled booking at Elite Sports Club', date: '2024-01-12', type: 'cancellation' },
    { id: 3, action: 'Completed game at Community Sports Center', date: '2024-01-10', type: 'completion' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    updateProfile(formData);
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    });
    setEditing(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateProfile({ avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

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
        title="My Profile"
        subtitle="Manage your account information and view your activity"
      />

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              
              <Button
                component="label"
                variant="outlined"
                startIcon={<Upload />}
                size="small"
                sx={{ mb: 2 }}
              >
                Change Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </Button>

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Typography variant="body2" color="primary.main">
                Sports Enthusiast
              </Typography>
            </CardContent>
          </Card>

          {/* Stats */}
          <Box mt={3}>
            <Grid container spacing={2}>
              {stats.map((stat, index) => (
                <Grid item xs={12} key={index}>
                  <StatsCard {...stat} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Profile Information" />
                <Tab label="Activity" />
                <Tab label="Preferences" />
              </Tabs>
            </Box>

            <CardContent>
              <TabPanel value={activeTab} index={0}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6">Personal Information</Typography>
                  {!editing ? (
                    <Button
                      startIcon={<Edit />}
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box display="flex" gap={1}>
                      <Button
                        startIcon={<Save />}
                        variant="contained"
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                      <Button
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!editing}
                      multiline
                      rows={3}
                      placeholder="Tell us about yourself and your favorite sports..."
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {recentActivity.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemText
                          primary={activity.action}
                          secondary={new Date(activity.date).toLocaleDateString()}
                        />
                      </ListItem>
                      {index < recentActivity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Typography variant="h6" gutterBottom>
                  Sport Preferences
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Feature coming soon! You'll be able to set your favorite sports and get personalized recommendations.
                </Typography>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfilePage;
