const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword, role } = req.body;
    if (!fullname || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    if (!['user', 'facility_owner'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullname,
      email,
      password: hashedPassword,
      role,
      is_verified: false,
    });
    await user.save();
    res.status(201).json({ message: 'Signup successful.', userId: user._id });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List users (dev only)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ created_at: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Debug DB info
exports.debugDB = async (req, res) => {
  try {
    const { name, host } = mongoose.connection;
    const count = await User.countDocuments();
    res.json({ db: name, host, userCount: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 