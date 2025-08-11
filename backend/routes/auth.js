const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Dev/debug routes
router.get('/debug-db', authController.debugDB);
router.get('/debug-users', authController.listUsers);

module.exports = router; 