// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const accessControl = require('../middleware/accessControl');

router.get('/analytics/:schoolId', auth, roleCheck(['admin', 'superadmin']), accessControl, analyticsController.getAnalytics);

module.exports = router;