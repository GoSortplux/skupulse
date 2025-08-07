// routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const accessControl = require('../middleware/accessControl');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the specified details. Only superadmins can perform this action.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin1"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [admin, superadmin]
 *                 example: "admin"
 *               schoolId:
 *                 type: string
 *                 example: "school1"
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                     schoolId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *       400:
 *         description: Invalid role or missing schoolId for admin
 *       500:
 *         description: Server error
 */
router.post('/', auth, roleCheck(['superadmin']), accessControl, usersController.createUser);

/**
 * @swagger
 * /{schoolId}:
 *   get:
 *     summary: Get all admins for a specific school
 *     description: Retrieves a list of admin users associated with the given schoolId. Only superadmins can access this.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: schoolId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "school1"
 *     responses:
 *       200:
 *         description: A list of admin users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   role:
 *                     type: string
 *                   schoolId:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/:schoolId', auth, roleCheck(['superadmin']), accessControl, usersController.getUsersBySchool);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user
 *     description: Updates the details of an existing user. Only superadmins can perform this action.
 *     tags: [Users]
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
 *               username:
 *                 type: string
 *                 example: "admin1_updated"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               role:
 *                 type: string
 *                 enum: [admin, superadmin]
 *                 example: "admin"
 *               schoolId:
 *                 type: string
 *                 example: "school1"
 *               email:
 *                 type: string
 *                 example: "admin_updated@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                     schoolId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/users/:id', auth, roleCheck(['superadmin']), accessControl, usersController.updateUser);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes an existing user by ID. Only superadmins can perform this action.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f8c8b1b2a4c0a8e4f4b1"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, roleCheck(['superadmin']), accessControl, usersController.deleteUser);

/**
 * @swagger
 * /users/{id}/reset-password:
 *   post:
 *     summary: Reset a user's password
 *     description: Resets the password for an existing user. Only superadmins can perform this action.
 *     tags: [Users]
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
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
 *       400:
 *         description: New password is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/users/:id/reset-password', auth, roleCheck(['superadmin']), accessControl, usersController.resetPassword);

module.exports = router;