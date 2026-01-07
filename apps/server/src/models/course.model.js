import { pool } from '../config/database.js'

const columns =
  'id, title, description, credits, has_project, created_at'

export const getCourses = async () => {
  const result = await pool.query(`SELECT * FROM courses ORDER BY id`)
  return result.rows
}

// Get all courses with aggregated review statistics
export const getCoursesWithStats = async () => {
  const result = await pool.query(`
    SELECT 
      c.*,
      COUNT(r.id) as total_reviews,
      COALESCE(AVG(r.rating), 0) as average_rating,
      COALESCE(AVG(r.difficulty), 0) as average_difficulty,
      COALESCE(AVG(r.hours_per_week), 0) as average_hours_per_week
    FROM courses c
    LEFT JOIN reviews r ON r.course_id = c.id
    GROUP BY c.id
    ORDER BY c.id
  `)
  return result.rows
}

export const getCourseById = async course_id => {
  const result = await pool.query(
    `SELECT * FROM courses WHERE id = $1`,
    [course_id],
  )
  return result.rows[0]
}

export const createCourse = async data => {
  const { title, description, credits, has_project, resource_id } = data
  const result = await pool.query(
    `INSERT INTO courses (title, description, credits, has_project, resource_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${columns}`,
    [
      title,
      description ?? null,
      credits,
      has_project,
      resource_id ?? null,
    ],
  )
  return result.rows[0]
}

export const updateCourse = async (course_id, data) => {
  const { title, description, credits, has_project, resource_id } = data
  const result = await pool.query(
    `UPDATE courses SET
       title = $1,
       description = $2,
       credits = $3,
       has_project = $4,
       resource_id = $5
     WHERE id = $6
     RETURNING ${columns}`,
    [
      title,
      description ?? null,
      credits,
      has_project,
      resource_id ?? null,
      course_id,
    ],
  )
  return result.rows[0]
}

export const deleteCourse = async course_id => {
  const result = await pool.query(
    `DELETE FROM courses WHERE id = $1 RETURNING ${columns}`,
    [course_id],
  )
  return result.rows[0]
}
