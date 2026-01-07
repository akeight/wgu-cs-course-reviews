import { pool } from '../config/database.js'

export const getAllUsers = async () => {
  const result = await pool.query(
    'SELECT id, username, created_at FROM users ORDER BY username',
  )
  return result.rows
}

export const getUserById = async user_id => {
  const result = await pool.query(
    'SELECT id, username, created_at FROM users WHERE id = $1',
    [user_id],
  )
  return result.rows[0]
}

export const getEnrolledCourses = async user_id => {
  const result = await pool.query(
    `SELECT 
        c.id,
        c.title,
        c.credits,
        e.enrolled_at
     FROM courses c
     JOIN enrollments e ON c.id = e.course_id
     WHERE e.user_id = $1
     ORDER BY c.title`,
    [user_id],
  )
  return result.rows
}

export const getReviewsByUser = async user_id => {
  const result = await pool.query(
    `SELECT *
     FROM reviews
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user_id],
  )
  return result.rows
}
