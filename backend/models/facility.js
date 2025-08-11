const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    description: { type: String },
    sports: [{ type: String }],
    amenities: [{ type: String }],
    images: [{ type: String }],
    operatingHours: {
      start: { type: String },
      end: { type: String },
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejectionReason: { type: String },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Facility', facilitySchema);


