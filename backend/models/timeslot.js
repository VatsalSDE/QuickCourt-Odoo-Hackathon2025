const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    isBlocked: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

timeSlotSchema.index({ court: 1, date: 1, startTime: 1, endTime: 1 }, { unique: true });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);


