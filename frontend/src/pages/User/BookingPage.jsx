import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  ArrowBack,
  Schedule,
  LocationOn,
  Payment,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/Common';

const BookingPage = () => {
  const { venueId, courtId } = useParams();
  const navigate = useNavigate();
  const { venues, courts, addBooking } = useApp();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, 'day'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [duration, setDuration] = useState(1);

  const venue = venues.find(v => v.id === parseInt(venueId));
  const court = courts.find(c => c.id === parseInt(courtId));

  const steps = ['Select Date & Time', 'Review & Payment', 'Confirmation'];

  const timeSlots = [
    '06:00-07:00', '07:00-08:00', '08:00-09:00', '09:00-10:00',
    '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00',
    '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00',
  ];

  if (!venue || !court) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6">Venue or Court not found</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/app/user/venues')}
          sx={{ mt: 2 }}
        >
          Back to Venues
        </Button>
      </Box>
    );
  }

  const calculateTotal = () => {
    return court.pricePerHour * duration;
  };

  const handleNext = () => {
    if (activeStep === 0 && (!selectedDate || !selectedTimeSlot)) {
      return;
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleBooking = () => {
    const bookingData = {
      userId: user.id,
      venueId: venue.id,
      courtId: court.id,
      venueName: venue.name,
      courtName: court.name,
      sport: court.sport,
      date: selectedDate.toISOString(),
      timeSlot: selectedTimeSlot,
      duration,
      totalAmount: calculateTotal(),
      status: 'confirmed',
    };

    addBooking(bookingData);
    setActiveStep(2);
  };

  const isTimeSlotAvailable = (timeSlot) => {
    // In real app, check against existing bookings
    return Math.random() > 0.3; // Mock availability
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Select Date
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      minDate={dayjs().add(1, 'day')}
                      maxDate={dayjs().add(30, 'day')}
                      sx={{ width: '100%' }}
                    />
                  </LocalizationProvider>

                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                    Duration
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Hours</InputLabel>
                    <Select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      label="Hours"
                    >
                      {[1, 2, 3, 4].map(hour => (
                        <MenuItem key={hour} value={hour}>
                          {hour} hour{hour > 1 ? 's' : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Available Time Slots
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedDate.format('MMMM D, YYYY')}
                  </Typography>
                  
                  <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                    {timeSlots.map((timeSlot) => {
                      const available = isTimeSlotAvailable(timeSlot);
                      return (
                        <Chip
                          key={timeSlot}
                          label={timeSlot}
                          variant={selectedTimeSlot === timeSlot ? 'filled' : 'outlined'}
                          color={selectedTimeSlot === timeSlot ? 'primary' : 'default'}
                          disabled={!available}
                          onClick={() => available && setSelectedTimeSlot(timeSlot)}
                          sx={{
                            cursor: available ? 'pointer' : 'not-allowed',
                            opacity: available ? 1 : 0.5,
                          }}
                        />
                      );
                    })}
                  </Box>

                  {selectedTimeSlot && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Selected: {selectedTimeSlot} for {duration} hour{duration > 1 ? 's' : ''}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Booking Summary
                  </Typography>
                  
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <LocationOn color="action" />
                    <Typography variant="body1">{venue.name}</Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {court.name} • {court.sport}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Schedule color="action" />
                    <Typography variant="body1">
                      {selectedDate.format('MMMM D, YYYY')} • {selectedTimeSlot}
                    </Typography>
                  </Box>

                  <Typography variant="body2" gutterBottom>
                    Duration: {duration} hour{duration > 1 ? 's' : ''}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Court Fee ({duration}h × ₹{court.pricePerHour})</Typography>
                    <Typography>₹{calculateTotal()}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Platform Fee</Typography>
                    <Typography>₹20</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" fontWeight="bold">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">₹{calculateTotal() + 20}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Method
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    This is a demo. No actual payment will be processed.
                  </Alert>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<Payment />}
                    onClick={handleBooking}
                  >
                    Pay ₹{calculateTotal() + 20}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                🎉 Booking Confirmed!
              </Typography>
              <Typography variant="h6" gutterBottom>
                Your court has been successfully booked
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                You will receive a confirmation email shortly with all the details.
              </Typography>
              
              <Box display="flex" gap={2} justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => navigate('/app/user/bookings')}
                >
                  View My Bookings
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/app/user/venues')}
                >
                  Book Another Court
                </Button>
              </Box>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <PageHeader
        title="Book Court"
        breadcrumbs={[
          { label: 'Venues', href: '/app/user/venues' },
          { label: venue.name, href: `/app/user/venue/${venue.id}` },
          { label: 'Book Court' },
        ]}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/app/user/venue/${venue.id}`)}
          >
            Back to Venue
          </Button>
        }
      />

      <Box mb={4}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {renderStepContent()}

      {activeStep < 2 && (
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === 0 && (!selectedDate || !selectedTimeSlot)}
          >
            {activeStep === 1 ? 'Proceed to Payment' : 'Next'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BookingPage;
