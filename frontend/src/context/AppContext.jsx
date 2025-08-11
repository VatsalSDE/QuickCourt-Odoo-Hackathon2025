import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_VENUES':
      return {
        ...state,
        venues: action.payload,
      };
    case 'SET_BOOKINGS':
      return {
        ...state,
        bookings: action.payload,
      };
    case 'ADD_BOOKING':
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? { ...booking, ...action.payload } : booking
        ),
      };
    case 'SET_FACILITIES':
      return {
        ...state,
        facilities: action.payload,
      };
    case 'ADD_FACILITY':
      return {
        ...state,
        facilities: [...state.facilities, action.payload],
      };
    case 'UPDATE_FACILITY':
      return {
        ...state,
        facilities: state.facilities.map(facility =>
          facility.id === action.payload.id ? { ...facility, ...action.payload } : facility
        ),
      };
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        ),
      };
    case 'SET_COURTS':
      return {
        ...state,
        courts: action.payload,
      };
    case 'ADD_COURT':
      return {
        ...state,
        courts: [...state.courts, action.payload],
      };
    case 'UPDATE_COURT':
      return {
        ...state,
        courts: state.courts.map(court =>
          court.id === action.payload.id ? { ...court, ...action.payload } : court
        ),
      };
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  loading: false,
  venues: [],
  bookings: [],
  facilities: [],
  users: [],
  courts: [],
  analytics: {
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalFacilities: 0,
  },
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize mock data
  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Mock venues
    const mockVenues = [
      {
        id: 1,
        name: 'SportZone Arena',
        location: 'Downtown, City Center',
        description: 'Premium sports facility with modern amenities',
        sports: ['badminton', 'tennis', 'basketball'],
        priceRange: '₹200-500/hour',
        rating: 4.5,
        totalReviews: 124,
        amenities: ['Parking', 'Cafeteria', 'Changing Rooms', 'Air Conditioning'],
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
        status: 'approved',
        ownerId: 2,
      },
      {
        id: 2,
        name: 'Elite Sports Club',
        location: 'Westside, Sports Complex',
        description: 'Professional grade courts for serious players',
        sports: ['badminton', 'squash', 'table tennis'],
        priceRange: '₹150-400/hour',
        rating: 4.2,
        totalReviews: 89,
        amenities: ['Parking', 'Equipment Rental', 'Coaching Available'],
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        status: 'approved',
        ownerId: 2,
      },
      {
        id: 3,
        name: 'Community Sports Center',
        location: 'Eastside, Residential Area',
        description: 'Affordable sports facility for the community',
        sports: ['basketball', 'volleyball', 'cricket'],
        priceRange: '₹100-300/hour',
        rating: 4.0,
        totalReviews: 67,
        amenities: ['Parking', 'Basic Facilities'],
        images: ['/api/placeholder/400/300'],
        status: 'approved',
        ownerId: 2,
      },
    ];

    // Mock courts
    const mockCourts = [
      {
        id: 1,
        venueId: 1,
        name: 'Court 1',
        sport: 'badminton',
        pricePerHour: 300,
        operatingHours: { start: '06:00', end: '23:00' },
        status: 'active',
      },
      {
        id: 2,
        venueId: 1,
        name: 'Court 2',
        sport: 'badminton',
        pricePerHour: 300,
        operatingHours: { start: '06:00', end: '23:00' },
        status: 'active',
      },
      {
        id: 3,
        venueId: 1,
        name: 'Tennis Court 1',
        sport: 'tennis',
        pricePerHour: 500,
        operatingHours: { start: '06:00', end: '22:00' },
        status: 'active',
      },
    ];

    // Mock bookings
    const mockBookings = [
      {
        id: 1,
        userId: 1,
        venueId: 1,
        courtId: 1,
        venueName: 'SportZone Arena',
        courtName: 'Court 1',
        sport: 'badminton',
        date: new Date('2024-08-15').toISOString(),
        timeSlot: '18:00-19:00',
        totalAmount: 300,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        userId: 1,
        venueId: 2,
        courtId: 2,
        venueName: 'Elite Sports Club',
        courtName: 'Court 1',
        sport: 'badminton',
        date: new Date('2024-08-20').toISOString(),
        timeSlot: '16:00-17:00',
        totalAmount: 250,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    ];

    // Mock users
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'user@quickcourt.com',
        role: 'user',
        status: 'active',
        joinedDate: '2024-01-15',
        totalBookings: 12,
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'owner@quickcourt.com',
        role: 'owner',
        status: 'active',
        joinedDate: '2024-01-10',
        totalFacilities: 2,
      },
      {
        id: 3,
        name: 'Admin User',
        email: 'admin@quickcourt.com',
        role: 'admin',
        status: 'active',
        joinedDate: '2024-01-01',
      },
    ];

    dispatch({ type: 'SET_VENUES', payload: mockVenues });
    dispatch({ type: 'SET_COURTS', payload: mockCourts });
    dispatch({ type: 'SET_BOOKINGS', payload: mockBookings });
    dispatch({ type: 'SET_USERS', payload: mockUsers });
    dispatch({ type: 'SET_FACILITIES', payload: mockVenues });
  };

  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_BOOKING', payload: newBooking });
    return newBooking;
  };

  const updateBooking = (bookingId, updates) => {
    dispatch({ type: 'UPDATE_BOOKING', payload: { id: bookingId, ...updates } });
  };

  const addFacility = (facilityData) => {
    const newFacility = {
      ...facilityData,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_FACILITY', payload: newFacility });
    return newFacility;
  };

  const updateFacility = (facilityId, updates) => {
    dispatch({ type: 'UPDATE_FACILITY', payload: { id: facilityId, ...updates } });
  };

  const addCourt = (courtData) => {
    const newCourt = {
      ...courtData,
      id: Date.now(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COURT', payload: newCourt });
    return newCourt;
  };

  const updateCourt = (courtId, updates) => {
    dispatch({ type: 'UPDATE_COURT', payload: { id: courtId, ...updates } });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const value = {
    ...state,
    addBooking,
    updateBooking,
    addFacility,
    updateFacility,
    addCourt,
    updateCourt,
    setLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
