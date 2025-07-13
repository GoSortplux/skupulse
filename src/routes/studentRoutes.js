// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const accessControl = require('../middleware/accessControl');

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', auth, roleCheck(['admin', 'superadmin']), accessControl, studentController.createStudent);

/**
 * @swagger
 * /students/{schoolId}:
 *   get:
 *     summary: Get all students for a specific school
 *     tags: [Students]
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
 *         description: A list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Server error
 */
router.get('/:schoolId', auth, roleCheck(['admin', 'superadmin']), accessControl, studentController.getStudents);

/**
 * @swagger
 * /students/{schoolId}/{rfid}:
 *   put:
 *     summary: Update a student's information
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: rfid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.put('/:schoolId/:rfid', auth, roleCheck(['admin', 'superadmin']), accessControl, studentController.updateStudent);

/**
 * @swagger
 * /students/{schoolId}/{rfid}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: rfid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.delete('/:schoolId/:rfid', auth, roleCheck(['superadmin']), accessControl, studentController.deleteStudent);

/**
 * @swagger
 * /students/{schoolId}:
 *   delete:
 *     summary: Delete all students for a specific school
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: a
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All students deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/:schoolId', auth, roleCheck(['superadmin']), accessControl, studentController.deleteAllStudents);

/**
 * @swagger
 * /students/import/{schoolId}:
 *   post:
 *     summary: Import students from a CSV file
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Students imported successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/import/:schoolId', auth, roleCheck(['admin', 'superadmin']), accessControl, studentController.importStudents);

module.exports = router;