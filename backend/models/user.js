const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => /^\S+@\S+\.\S+$/.test(v),
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'facility_owner', 'admin'],
    required: true,
    default: 'user',
  },
  avatar: {
    type: String,
  },
  location: {
    type: String,
  },
  is_banned: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema); 