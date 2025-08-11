const Facility = require('../models/facility');
const User = require('../models/user');
const Booking = require('../models/booking');

exports.stats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const facilityOwners = await User.countDocuments({ role: 'facility_owner' });
    const totalBookings = await Booking.countDocuments();
    const activeCourts = 0; // could be computed from courts if needed
    const pendingApprovals = await Facility.countDocuments({ status: 'pending' });
    res.json({ totalUsers, facilityOwners, totalBookings, activeCourts, pendingApprovals });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.pendingFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({ status: 'pending' }).populate('owner', 'fullname email');
    res.json({ facilities });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.approveFacility = async (req, res) => {
  try {
    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', rejectionReason: undefined },
      { new: true }
    );
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json({ message: 'Facility approved', facility });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.rejectFacility = async (req, res) => {
  try {
    const { reason } = req.body;
    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason || 'Not specified' },
      { new: true }
    );
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json({ message: 'Facility rejected', facility });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ created_at: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { is_banned: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User banned', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { is_banned: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User unbanned', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


