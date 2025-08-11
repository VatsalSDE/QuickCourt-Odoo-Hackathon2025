const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRoles } = require('../middleware/roles');
const facilityController = require('../controllers/facilityController');

// Public approved facilities
router.get('/', facilityController.getApprovedFacilities);
router.get('/:id', facilityController.getFacilityById);

// Owner operations
router.post('/', auth, requireRoles('facility_owner', 'admin'), facilityController.createFacility);
router.get('/me/list', auth, requireRoles('facility_owner', 'admin'), facilityController.getMyFacilities);
router.put('/:id', auth, requireRoles('facility_owner', 'admin'), facilityController.updateFacility);

module.exports = router;


