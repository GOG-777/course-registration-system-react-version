const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes (can view courses without login)
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/level/:level/semester/:semester', courseController.getCoursesByLevelAndSemester);

// Admin only routes
router.post('/', verifyToken, isAdmin, courseController.createCourse);
router.put('/:id', verifyToken, isAdmin, courseController.updateCourse);
router.delete('/:id', verifyToken, isAdmin, courseController.deleteCourse);

module.exports = router;