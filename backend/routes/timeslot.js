const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRoles } = require('../middleware/roles');
const timeslotController = require('../controllers/timeslotController');

router.get('/', timeslotController.getAvailability);
router.post('/', auth, requireRoles('facility_owner', 'admin'), timeslotController.setAvailability);

module.exports = router;


