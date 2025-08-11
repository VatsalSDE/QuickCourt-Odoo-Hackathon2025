const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRoles } = require('../middleware/roles');
const courtController = require('../controllers/courtController');

// Owner operations
router.post('/', auth, requireRoles('facility_owner', 'admin'), courtController.createCourt);
router.get('/facility/:facilityId', courtController.getCourtsByFacility);
router.put('/:id', auth, requireRoles('facility_owner', 'admin'), courtController.updateCourt);

module.exports = router;


