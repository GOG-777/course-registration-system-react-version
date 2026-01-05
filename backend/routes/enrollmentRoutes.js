const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Student routes
router.post('/enroll', verifyToken, enrollmentController.enrollCourse);
router.put('/drop/:course_id', verifyToken, enrollmentController.dropCourse);
router.get('/my-courses', verifyToken, enrollmentController.getMyEnrollments);

// Admin routes
router.get('/', verifyToken, isAdmin, enrollmentController.getAllEnrollments);
router.get('/course/:course_id', verifyToken, isAdmin, enrollmentController.getCourseEnrollments);

module.exports = router;