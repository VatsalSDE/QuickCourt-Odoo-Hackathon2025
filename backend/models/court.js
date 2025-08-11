const mongoose = require('mongoose');

const weeklyScheduleSchema = new mongoose.Schema(
  {
    isOpen: { type: Boolean, default: true },
    start: { type: String, default: '06:00' },
    end: { type: String, default: '23:00' },
  },
  { _id: false }
);

const courtSchema = new mongoose.Schema(
  {
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    name: { type: String, required: true },
    sport: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    description: { type: String },
    operatingHours: {
      start: { type: String, default: '06:00' },
      end: { type: String, default: '23:00' },
    },
    weeklySchedule: {
      monday: { type: weeklyScheduleSchema, default: () => ({}) },
      tuesday: { type: weeklyScheduleSchema, default: () => ({}) },
      wednesday: { type: weeklyScheduleSchema, default: () => ({}) },
      thursday: { type: weeklyScheduleSchema, default: () => ({}) },
      friday: { type: weeklyScheduleSchema, default: () => ({}) },
      saturday: { type: weeklyScheduleSchema, default: () => ({}) },
      sunday: { type: weeklyScheduleSchema, default: () => ({}) },
    },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ['Active', 'Maintenance', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Court', courtSchema);


