// routes/schoolRoutes.js
const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const accessControl = require('../middleware/accessControl');

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new school
 *     description: Creates a new school with the specified details. Only superadmins can perform this action.
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Springfield High School"
 *                 description: Required and must be unique.
 *               logoUrl:
 *                 type: string
 *                 example: "https://example.com/logo.png"
 *               address:
 *                 type: string
 *                 example: "123 Education Lane, Lagos"
 *               adminName:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: School created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "School created successfully"
 *                 school:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d5f8c8b1b2a4c0a8e4f4b1"
 *                     name:
 *                       type: string
 *                       example: "Springfield High School"
 *                     logoUrl:
 *                       type: string
 *                       example: "https://example.com/logo.png"
 *                     address:
 *                       type: string
 *                       example: "123 Education Lane, Lagos"
 *                     adminName:
 *                       type: string
 *                       example: "John Doe"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-19T21:25:00Z"
 *       400:
 *         description: Bad request (e.g., missing name or duplicate school name)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A school with this name already exists. Please use a different name."
 *       500:
 *         description: Server error
 */
router.post('/', auth, roleCheck(['superadmin']), accessControl, schoolController.createSchool);

/**
 * @swagger
 * /:{id}:
 *   put:
 *     summary: Update an existing school
 *     description: Updates the details of an existing school. Only superadmins can perform this action.
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f8c8b1b2a4c0a8e4f4b1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Springfield High School Updated"
 *                 description: Must be unique if changed.
 *               logoUrl:
 *                 type: string
 *                 example: "https://example.com/new-logo.png"
 *               address:
 *                 type: string
 *                 example: "124 Education Lane, Lagos"
 *               adminName:
 *                 type: string
 *                 example: "Jane Doe"
 *     responses:
 *       200:
 *         description: School updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "School updated successfully"
 *                 school:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d5f8c8b1b2a4c0a8e4f4b1"
 *                     name:
 *                       type: string
 *                       example: "Springfield High School Updated"
 *                     logoUrl:
 *                       type: string
 *                       example: "https://example.com/new-logo.png"
 *                     address:
 *                       type: string
 *                       example: "124 Education Lane, Lagos"
 *                     adminName:
 *                       type: string
 *                       example: "Jane Doe"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-19T21:30:00Z"
 *       400:
 *         description: Bad request (e.g., duplicate name or validation error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A school with this name already exists. Please use a different name."
 *       404:
 *         description: School not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "School not found"
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, roleCheck(['superadmin']), accessControl, schoolController.updateSchool);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all schools
 *     description: Retrieves a list of all schools. Accessible by admins and superadmins.
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of schools
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60d5f8c8b1b2a4c0a8e4f4b1"
 *                   name:
 *                     type: string
 *                     example: "Springfield High School"
 *                   logoUrl:
 *                     type: string
 *                     example: "https://example.com/logo.png"
 *                   address:
 *                     type: string
 *                     example: "123 Education Lane, Lagos"
 *                   adminName:
 *                     type: string
 *                     example: "John Doe"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-06-19T21:25:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-06-19T21:30:00Z"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get('/', auth, roleCheck(['admin', 'superadmin']), accessControl, schoolController.getSchools);

module.exports = router;