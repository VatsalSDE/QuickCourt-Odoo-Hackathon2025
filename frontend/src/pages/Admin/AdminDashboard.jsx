import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { People, Business, CalendarMonth, TrendingUp, Approval, Sports } from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PageHeader, StatsCard } from '../../components/Common';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, facilities, bookings } = useApp();

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: <People />,
      color: 'primary',
      trend: 'up',
      trendValue: '+15%',
    },
    {
      title: 'Total Facilities',
      value: facilities.length,
      icon: <Business />,
      color: 'success',
      trend: 'up',
      trendValue: '+8%',
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: <CalendarMonth />,
      color: 'info',
      trend: 'up',
      trendValue: '+23%',
    },
    {
      title: 'Pending Approvals',
      value: facilities.filter(f => f.status === 'pending').length,
      icon: <Approval />,
      color: 'warning',
    },
  ];

  const userGrowth = [
    { month: 'Jan', users: 120, facilities: 15 },
    { month: 'Feb', users: 145, facilities: 18 },
    { month: 'Mar', users: 178, facilities: 22 },
    { month: 'Apr', users: 210, facilities: 25 },
    { month: 'May', users: 245, facilities: 28 },
    { month: 'Jun', users: 280, facilities: 32 },
  ];

  const bookingActivity = [
    { month: 'Jan', bookings: 450 },
    { month: 'Feb', bookings: 520 },
    { month: 'Mar', bookings: 610 },
    { month: 'Apr', bookings: 580 },
    { month: 'May', bookings: 670 },
    { month: 'Jun', bookings: 720 },
  ];

  const sportsPopularity = [
    { name: 'Badminton', value: 45, color: '#1976d2' },
    { name: 'Tennis', value: 25, color: '#dc004e' },
    { name: 'Basketball', value: 20, color: '#2e7d32' },
    { name: 'Others', value: 10, color: '#ed6c02' },
  ];

  return (
    <Box>
      <PageHeader
        title={`Admin Dashboard`}
        subtitle="System overview and analytics"
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
        {/* User Growth Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Platform Growth
              </Typography>
              <LineChart
                width={800}
                height={300}
                series={[
                  {
                    data: userGrowth.map(item => item.users),
                    label: 'Users',
                  },
                  {
                    data: userGrowth.map(item => item.facilities),
                    label: 'Facilities',
                  },
                ]}
                xAxis={[{
                  scaleType: 'point',
                  data: userGrowth.map(item => item.month)
                }]}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/app/admin/approvals')}
                >
                  Review Approvals
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/app/admin/users')}
                >
                  Manage Users
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                >
                  System Settings
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                >
                  Generate Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Booking Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Booking Activity
              </Typography>
              <BarChart
                xAxis={[{
                  scaleType: 'band',
                  data: bookingActivity.map(item => item.month)
                }]}
                series={[{
                  data: bookingActivity.map(item => item.bookings),
                  label: 'Bookings',
                }]}
                width={400}
                height={250}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Sports Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Most Active Sports
              </Typography>
              <Box height={250}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sportsPopularity}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sportsPopularity.map((entry, index) => (
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
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
