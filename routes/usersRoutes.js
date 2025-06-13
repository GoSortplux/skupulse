// routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const accessControl = require('../middleware/accessControl');

router.post('/', auth, roleCheck(['superadmin']), accessControl, usersController.createUser);
router.get('/users/:schoolId', auth, roleCheck(['superadmin']), accessControl, usersController.getUsersBySchool);
router.put('/users/:id', auth, roleCheck(['superadmin']), accessControl, usersController.updateUser);
router.delete('/users/:id', auth, roleCheck(['superadmin']), accessControl, usersController.deleteUser);

module.exports = router;