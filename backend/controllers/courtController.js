const Court = require('../models/court');
const Facility = require('../models/facility');

exports.createCourt = async (req, res) => {
  try {
    const { facilityId, name, sport, pricePerHour, description, operatingHours, weeklySchedule } = req.body;
    const facility = await Facility.findOne({ _id: facilityId, owner: req.user._id });
    if (!facility) return res.status(404).json({ message: 'Facility not found or not owned by user' });

    const court = await Court.create({
      facility: facilityId,
      name,
      sport,
      pricePerHour,
      description,
      operatingHours,
      weeklySchedule,
    });
    res.status(201).json({ message: 'Court created', court });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCourtsByFacility = async (req, res) => {
  try {
    const { facilityId } = req.params;
    const courts = await Court.find({ facility: facilityId });
    res.json({ courts });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCourt = async (req, res) => {
  try {
    const { id } = req.params;
    // Ensure the court belongs to a facility owned by the user
    const court = await Court.findById(id).populate('facility');
    if (!court) return res.status(404).json({ message: 'Court not found' });
    if (String(court.facility.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(court, req.body);
    await court.save();
    res.json({ message: 'Court updated', court });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


