// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const accessControl = require('../middleware/accessControl');

/**
 * @swagger
 * /analytics/{schoolId}:
 *   get:
 *     summary: Get analytics for a specific school
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStudents:
 *                   type: integer
 *                 averageAttendance:
 *                   type: number
 *                   format: float
 *       500:
 *         description: Server error
 */
router.get('/:schoolId', auth, roleCheck(['admin', 'superadmin']), accessControl, analyticsController.getAnalytics);

module.exports = router;