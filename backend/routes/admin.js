const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRoles } = require('../middleware/roles');
const adminController = require('../controllers/adminController');

router.use(auth, requireRoles('admin'));

router.get('/stats', adminController.stats);
router.get('/facilities/pending', adminController.pendingFacilities);
router.post('/facilities/:id/approve', adminController.approveFacility);
router.post('/facilities/:id/reject', adminController.rejectFacility);
router.get('/users', adminController.listUsers);
router.post('/users/:id/ban', adminController.banUser);
router.post('/users/:id/unban', adminController.unbanUser);

module.exports = router;


