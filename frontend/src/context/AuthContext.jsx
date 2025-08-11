import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('quickcourt_user');
    const savedToken = localStorage.getItem('quickcourt_token');
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('quickcourt_user');
        localStorage.removeItem('quickcourt_token');
      }
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token, user } = data;
      
      localStorage.setItem('quickcourt_user', JSON.stringify(user));
      localStorage.setItem('quickcourt_token', token);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return user;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const signup = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: userData.name,
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
          role: userData.role === 'owner' ? 'facility_owner' : 'user',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // After successful signup, automatically log in
      return await login(userData.email, userData.password);
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('quickcourt_user');
    localStorage.removeItem('quickcourt_token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (profileData) => {
    const updatedUser = { ...state.user, ...profileData };
    localStorage.setItem('quickcourt_user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
