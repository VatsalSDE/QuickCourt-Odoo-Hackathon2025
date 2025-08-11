const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRoles } = require('../middleware/roles');
const bookingController = require('../controllers/bookingController');

// User
router.post('/', auth, requireRoles('user', 'facility_owner', 'admin'), bookingController.createBooking);
router.get('/me', auth, requireRoles('user', 'facility_owner', 'admin'), bookingController.getMyBookings);
router.delete('/:id', auth, requireRoles('user', 'facility_owner', 'admin'), bookingController.cancelBooking);

// Owner overview
router.get('/owner/overview', auth, requireRoles('facility_owner', 'admin'), bookingController.getOwnerBookings);

module.exports = router;


