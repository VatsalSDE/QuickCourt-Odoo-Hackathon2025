import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AuthGuard from './components/Auth/AuthGuard';
import Layout from './components/Layout/Layout';
import { useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/Public/LoginPage';
import SignupPage from './pages/Public/SignupPage';
import LandingPage from './pages/Public/LandingPage';

// User Pages
import UserHome from './pages/User/UserHome';
import VenuesPage from './pages/User/VenuesPage';
import VenueDetailsPage from './pages/User/VenueDetailsPage';
import BookingPage from './pages/User/BookingPage';
import UserBookingsPage from './pages/User/UserBookingsPage';
import UserProfilePage from './pages/User/UserProfilePage';

// Facility Owner Pages
import OwnerDashboard from './pages/FacilityOwner/OwnerDashboard';
import FacilityManagement from './pages/FacilityOwner/FacilityManagement';
import CourtManagement from './pages/FacilityOwner/CourtManagement';
import OwnerBookings from './pages/FacilityOwner/OwnerBookings';
import OwnerProfile from './pages/FacilityOwner/OwnerProfile';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import FacilityApproval from './pages/Admin/FacilityApproval';
import UserManagement from './pages/Admin/UserManagement';
import AdminProfile from './pages/Admin/AdminProfile';

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'admin':
      return <Navigate to="/app/admin/dashboard" replace />;
    case 'facility_owner':
      return <Navigate to="/app/owner/dashboard" replace />;
    case 'user':
    default:
      return <Navigate to="/app/user/home" replace />;
  }
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#f50057',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected Routes */}
              <Route path="/app" element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }>
                {/* User Routes */}
                <Route path="user/home" element={<UserHome />} />
                <Route path="user/venues" element={<VenuesPage />} />
                <Route path="user/venue/:id" element={<VenueDetailsPage />} />
                <Route path="user/book/:venueId/:courtId" element={<BookingPage />} />
                <Route path="user/bookings" element={<UserBookingsPage />} />
                <Route path="user/profile" element={<UserProfilePage />} />
                
                {/* Facility Owner Routes */}
                <Route path="owner/dashboard" element={<OwnerDashboard />} />
                <Route path="owner/facilities" element={<FacilityManagement />} />
                <Route path="owner/courts" element={<CourtManagement />} />
                <Route path="owner/bookings" element={<OwnerBookings />} />
                <Route path="owner/profile" element={<OwnerProfile />} />
                
                {/* Admin Routes */}
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/approvals" element={<FacilityApproval />} />
                <Route path="admin/users" element={<UserManagement />} />
                <Route path="admin/profile" element={<AdminProfile />} />
                
                {/* Default redirect based on role */}
                <Route path="" element={<RoleBasedRedirect />} />
              </Route>
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
