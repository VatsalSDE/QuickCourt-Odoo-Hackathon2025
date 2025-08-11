import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Sports,
  CalendarMonth,
  Group,
  LocationOn,
  Star,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Sports />,
      title: 'Book Any Sport',
      description: 'Badminton, Tennis, Basketball, Cricket and more. Find the perfect court for your game.',
    },
    {
      icon: <CalendarMonth />,
      title: 'Easy Scheduling',
      description: 'Book courts instantly with our simple booking system. Check availability in real-time.',
    },
    {
      icon: <Group />,
      title: 'Join Community',
      description: 'Connect with fellow sports enthusiasts and join matches in your area.',
    },
    {
      icon: <LocationOn />,
      title: 'Local Venues',
      description: 'Discover sports facilities near you with detailed information and reviews.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Sports Venues' },
    { value: '10K+', label: 'Happy Users' },
    { value: '50K+', label: 'Bookings Made' },
    { value: '25+', label: 'Cities' },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/signup');
    }
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Sports color="primary" sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              QuickCourt
            </Typography>
          </Box>
          
          <Box display="flex" gap={2}>
            <Button
              color="primary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 10,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Book Sports Courts
                <br />
                <Typography
                  component="span"
                  variant="h2"
                  fontWeight="bold"
                  color="secondary.light"
                >
                  Instantly
                </Typography>
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Find and book local sports facilities with ease. Join a community of sports enthusiasts and never miss a game again.
              </Typography>
              
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={handleGetStarted}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/api/placeholder/600/400"
                alt="Sports court booking"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Why Choose QuickCourt?
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Everything you need to book and play sports
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: 'primary.main',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to Play?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of sports enthusiasts and start booking your favorite courts today.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={handleGetStarted}
            sx={{ px: 6, py: 2 }}
          >
            Start Booking Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: 'background.paper', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <Sports color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              QuickCourt
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            © 2024 QuickCourt. All rights reserved. Made for Odoo Hackathon 2025.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
