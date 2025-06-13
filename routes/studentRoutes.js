// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const accessControl = require('../middleware/accessControl');

router.post('/', auth, roleCheck(['admin', 'superadmin']), accessControl, studentController.createStudent);
router.get('/:schoolId', auth, roleCheck(['admin', 'superadmin']), accessControl, studentController.getStudents);
router.put('/:schoolId/:rfid', auth, roleCheck(['admin', 'superadmin']), accessControl, studentController.updateStudent);
router.delete('/:schoolId/:rfid', auth, roleCheck(['superadmin']), accessControl, studentController.deleteStudent);
router.delete('/:schoolId', auth, roleCheck(['superadmin']), accessControl, studentController.deleteAllStudents);
router.post('/import/:schoolId', auth, roleCheck(['admin', 'superadmin']), accessControl, studentController.importStudents);

module.exports = router;