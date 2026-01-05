const db = require('../config/db');

// Enroll in a course - FIXED VERSION
exports.enrollCourse = async (req, res) => {
  try {
    const { course_id } = req.body;
    const user_id = req.user.id;

    // Check if course exists
    const courseResult = await db.query('SELECT * FROM courses WHERE id = $1', [course_id]);

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseResult.rows[0];

    // Check if already enrolled (only check for 'enrolled' status, ignore 'dropped')
    const existingEnrollment = await db.query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2 AND status = $3',
      [user_id, course_id, 'enrolled']
    );

    if (existingEnrollment.rows.length > 0) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Check if previously dropped - allow re-enrollment
    const droppedEnrollment = await db.query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2 AND status = $3',
      [user_id, course_id, 'dropped']
    );

    if (droppedEnrollment.rows.length > 0) {
      // Update from 'dropped' back to 'enrolled'
      const updateResult = await db.query(`
        UPDATE enrollments 
        SET status = 'enrolled', enrollment_date = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND course_id = $2
        RETURNING *
      `, [user_id, course_id]);
      
      return res.json({
        message: 'Successfully re-enrolled in course',
        enrollment: updateResult.rows[0]
      });
    }

    // New enrollment
    const result = await db.query(`
      INSERT INTO enrollments (user_id, course_id, status)
      VALUES ($1, $2, 'enrolled')
      RETURNING *
    `, [user_id, course_id]);

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment: result.rows[0]
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Failed to enroll in course', message: error.message });
  }
};

// Drop a course 
exports.dropCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user_id = req.user.id;

    const result = await db.query(`
      UPDATE enrollments 
      SET status = 'dropped'
      WHERE user_id = $1 AND course_id = $2 AND status = 'enrolled'
      RETURNING *
    `, [user_id, course_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enrollment not found or already dropped' });
    }

    res.json({
      message: 'Successfully dropped course',
      enrollment: result.rows[0]
    });
  } catch (error) {
    console.error('Drop course error:', error);
    res.status(500).json({ error: 'Failed to drop course', message: error.message });
  }
};

// Get user's enrolled courses - KEEP AS IS
exports.getMyEnrollments = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await db.query(`
      SELECT 
        e.id as enrollment_id,
        e.enrollment_date,
        e.status,
        c.*
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = $1
      ORDER BY c.level, c.semester, c.course_code
    `, [user_id]);

    res.json({ enrollments: result.rows });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments', message: error.message });
  }
};

// Get all enrollments (Admin only) - KEEP AS IS
exports.getAllEnrollments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        e.id,
        e.enrollment_date,
        e.status,
        u.full_name,
        u.student_id,
        u.email,
        u.level as student_level,
        c.course_code,
        c.course_name,
        c.level as course_level,
        c.semester
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.enrollment_date DESC
    `);

    res.json({ enrollments: result.rows });
  } catch (error) {
    console.error('Get all enrollments error:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments', message: error.message });
  }
};

// Get students enrolled in a specific course (Admin only) - KEEP AS IS
exports.getCourseEnrollments = async (req, res) => {
  try {
    const { course_id } = req.params;

    const result = await db.query(`
      SELECT 
        e.id,
        e.enrollment_date,
        e.status,
        u.id as user_id,
        u.full_name,
        u.student_id,
        u.email,
        u.phone,
        u.level
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      WHERE e.course_id = $1 AND e.status = 'enrolled'
      ORDER BY u.full_name
    `, [course_id]);

    res.json({ students: result.rows });
  } catch (error) {
    console.error('Get course enrollments error:', error);
    res.status(500).json({ error: 'Failed to fetch course enrollments', message: error.message });
  }
};