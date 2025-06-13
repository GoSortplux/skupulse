// routes/schoolRoutes.js
const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const accessControl = require('../middleware/accessControl');

router.post('/', auth, roleCheck(['superadmin']), accessControl, schoolController.createSchool);
router.put('/:id', auth, roleCheck(['superadmin']), accessControl, schoolController.updateSchool);
router.get('/', auth, roleCheck(['admin', 'superadmin']), accessControl, schoolController.getSchools);

module.exports = router; 