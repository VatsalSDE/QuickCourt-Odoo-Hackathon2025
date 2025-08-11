import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  SportsBaseball,
  CalendarMonth,
  Person,
  Business,
  ManageAccounts,
  BarChart,
  Approval,
  People,
  Home,
  BookOnline,
  Sports,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onItemClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuItems = [
    { text: 'Home', icon: <Home />, path: '/app/user/home' },
    { text: 'Venues', icon: <SportsBaseball />, path: '/app/user/venues' },
    { text: 'My Bookings', icon: <BookOnline />, path: '/app/user/bookings' },
    { text: 'Profile', icon: <Person />, path: '/app/user/profile' },
  ];

  const ownerMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/app/owner/dashboard' },
    { text: 'Facilities', icon: <Business />, path: '/app/owner/facilities' },
    { text: 'Courts', icon: <Sports />, path: '/app/owner/courts' },
    { text: 'Bookings', icon: <CalendarMonth />, path: '/app/owner/bookings' },
    { text: 'Profile', icon: <Person />, path: '/app/owner/profile' },
  ];

  const adminMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/app/admin/dashboard' },
    { text: 'Facility Approvals', icon: <Approval />, path: '/app/admin/approvals' },
    { text: 'User Management', icon: <People />, path: '/app/admin/users' },
    { text: 'Profile', icon: <Person />, path: '/app/admin/profile' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'owner':
        return ownerMenuItems;
      case 'admin':
        return adminMenuItems;
      default:
        return userMenuItems;
    }
  };

  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'owner':
        return 'Facility Owner';
      case 'admin':
        return 'Administrator';
      default:
        return 'Sports Enthusiast';
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'owner':
        return 'success';
      case 'admin':
        return 'error';
      default:
        return 'primary';
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onItemClick) {
      onItemClick();
    }
  };

  const menuItems = getMenuItems();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Sports sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            QuickCourt
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Welcome, {user?.name?.split(' ')[0]}
          </Typography>
          <Chip
            label={getRoleDisplay()}
            size="small"
            color={getRoleColor()}
            variant="outlined"
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          />
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'white' : 'text.secondary',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          QuickCourt v1.0
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          © 2024 All rights reserved
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
