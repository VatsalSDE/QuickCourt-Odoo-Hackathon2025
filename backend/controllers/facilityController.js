const Facility = require('../models/facility');

exports.createFacility = async (req, res) => {
  try {
    const { name, location, description, sports, amenities, operatingHours, images } = req.body;
    const facility = await Facility.create({
      owner: req.user._id,
      name,
      location,
      description,
      sports: sports || [],
      amenities: amenities || [],
      operatingHours: operatingHours || {},
      images: images || [],
      status: 'pending',
    });
    res.status(201).json({ message: 'Facility submitted for approval', facility });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({ owner: req.user._id });
    res.json({ facilities });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getApprovedFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({ status: 'approved', isActive: true });
    res.json({ facilities });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json({ facility });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateFacility = async (req, res) => {
  try {
    const facility = await Facility.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json({ message: 'Facility updated', facility });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


