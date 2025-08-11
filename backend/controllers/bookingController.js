const Booking = require('../models/booking');
const Court = require('../models/court');
const Facility = require('../models/facility');
const TimeSlot = require('../models/timeslot');

const overlaps = (aStart, aEnd, bStart, bEnd) => {
  return aStart < bEnd && bStart < aEnd;
};

exports.createBooking = async (req, res) => {
  try {
    const { courtId, date, startTime, endTime } = req.body;
    const court = await Court.findById(courtId).populate('facility');
    if (!court) return res.status(404).json({ message: 'Court not found' });
    if (!court.isActive || court.status !== 'Active') return res.status(400).json({ message: 'Court not available' });

    // Check for conflicting bookings
    const conflict = await Booking.findOne({
      court: courtId,
      date,
      $expr: {
        $and: [
          { $lt: ['$startTime', endTime] },
          { $lt: [startTime, '$endTime'] },
        ],
      },
      status: { $ne: 'Cancelled' },
    });
    if (conflict) return res.status(409).json({ message: 'Time slot already booked' });

    // Check blocked slots
    const blocked = await TimeSlot.findOne({ court: courtId, date, startTime, endTime, isBlocked: true });
    if (blocked) return res.status(400).json({ message: 'Time slot is blocked' });

    const amount = court.pricePerHour; // simple flat price per hour
    const booking = await Booking.create({
      user: req.user._id,
      facility: court.facility._id,
      court: courtId,
      date,
      startTime,
      endTime,
      amount,
      status: 'Confirmed',
      paymentStatus: 'Paid', // simulated
    });

    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('facility court');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ _id: id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Simple rule: allow cancel if date is in future (>= today)
    const today = new Date();
    const bookingDate = new Date(booking.date);
    if (bookingDate < new Date(today.toDateString())) {
      return res.status(400).json({ message: 'Cannot cancel past bookings' });
    }
    booking.status = 'Cancelled';
    booking.paymentStatus = 'Refunded';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOwnerBookings = async (req, res) => {
  try {
    // Find facilities owned by the user
    const facilities = await Facility.find({ owner: req.user._id }).select('_id');
    const facilityIds = facilities.map((f) => f._id);
    const bookings = await Booking.find({ facility: { $in: facilityIds } })
      .sort({ createdAt: -1 })
      .populate('user court facility');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


