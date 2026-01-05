const db = require('../config/db');

// Get all courses (optionally filtered by level)
exports.getAllCourses = async (req, res) => {
  try {
    const { level } = req.query;
    
    let query = `
      SELECT c.*, 
             COUNT(e.id) as enrolled_students
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'enrolled'
    `;
    
    const params = [];
    if (level) {
      query += ` WHERE c.level = $1`;
      params.push(level);
    }
    
    query += ` GROUP BY c.id ORDER BY c.level, c.semester, c.course_code`;
    
    const result = await db.query(query, params);

    res.json({ courses: result.rows });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses', message: error.message });
  }
};

// Get courses for a specific level and semester
exports.getCoursesByLevelAndSemester = async (req, res) => {
  try {
    const { level, semester } = req.params;

    const result = await db.query(`
      SELECT c.*, 
             COUNT(e.id) as enrolled_students
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'enrolled'
      WHERE c.level = $1 AND c.semester = $2
      GROUP BY c.id
      ORDER BY c.course_code
    `, [level, semester]);

    res.json({ courses: result.rows });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses', message: error.message });
  }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT c.*, 
             COUNT(e.id) as enrolled_students
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'enrolled'
      WHERE c.id = $1
      GROUP BY c.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course: result.rows[0] });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course', message: error.message });
  }
};

// Create new course (Admin only)
exports.createCourse = async (req, res) => {
  try {
    const {
      course_code,
      course_name,
      credits,
      level,
      semester
    } = req.body;

    // Validate required fields
    if (!course_code || !course_name || !credits || !level || !semester) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate level and semester
    if (![100, 200, 300, 400].includes(parseInt(level))) {
      return res.status(400).json({ error: 'Level must be 100, 200, 300, or 400' });
    }

    if (![1, 2].includes(parseInt(semester))) {
      return res.status(400).json({ error: 'Semester must be 1 or 2' });
    }

    // Check if course code already exists
    const existing = await db.query(
      'SELECT * FROM courses WHERE course_code = $1',
      [course_code]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Course code already exists' });
    }

    const result = await db.query(`
      INSERT INTO courses (course_code, course_name, credits, level, semester)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [course_code, course_name, credits, level, semester]);

    res.status(201).json({
      message: 'Course created successfully',
      course: result.rows[0]
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course', message: error.message });
  }
};

// Update course (Admin only)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      course_name,
      credits,
      level,
      semester
    } = req.body;

    const result = await db.query(`
      UPDATE courses 
      SET course_name = COALESCE($1, course_name),
          credits = COALESCE($2, credits),
          level = COALESCE($3, level),
          semester = COALESCE($4, semester),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [course_name, credits, level, semester, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      message: 'Course updated successfully',
      course: result.rows[0]
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course', message: error.message });
  }
};

// Delete course (Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM courses WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course', message: error.message });
  }
};