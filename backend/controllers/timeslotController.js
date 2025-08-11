const TimeSlot = require('../models/timeslot');
const Court = require('../models/court');

exports.setAvailability = async (req, res) => {
  try {
    const { courtId, date, startTime, endTime, isBlocked } = req.body;
    const court = await Court.findById(courtId).populate('facility');
    if (!court) return res.status(404).json({ message: 'Court not found' });
    if (String(court.facility.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const slot = await TimeSlot.findOneAndUpdate(
      { court: courtId, date, startTime, endTime },
      { isBlocked: !!isBlocked, isAvailable: !isBlocked },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ message: 'Time slot updated', slot });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const { courtId, date } = req.query;
    const query = {};
    if (courtId) query.court = courtId;
    if (date) query.date = date;
    const slots = await TimeSlot.find(query);
    res.json({ slots });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


