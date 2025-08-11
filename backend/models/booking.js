const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Confirmed', 'Cancelled', 'Completed'], default: 'Confirmed' },
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Refunded', 'Failed'], default: 'Paid' },
  },
  { timestamps: true }
);

bookingSchema.index({ court: 1, date: 1, startTime: 1, endTime: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);


