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

/**
 * @swagger
 * /analytics/superadmin/all:
 *   get:
 *     summary: Get analytics for all schools (Super Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated analytics data for all schools
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
 *       403:
 *         description: Forbidden - User is not a Super Admin
 *       500:
 *         description: Server error
 */
router.get('/superadmin/all', auth, roleCheck(['superadmin']), accessControl, analyticsController.getSuperAdminAnalytics);

module.exports = router;