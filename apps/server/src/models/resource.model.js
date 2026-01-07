import { pool } from '../config/database.js'

export const createResource = async ({ user_id, course_id, title, url }) => {
  const result = await pool.query(
    `INSERT INTO resources (user_id, course_id, title, url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, course_id, title, url],
  )
  return result.rows[0]
}

export const getResourceById = async resource_id => {
  const result = await pool.query(
    `SELECT * FROM resources WHERE id = $1`,
    [resource_id],
  )
  return result.rows[0]
}

export const getResourcesByCourse = async course_id => {
  const result = await pool.query(
    `SELECT * FROM resources
     WHERE course_id = $1
     ORDER BY title`,
    [course_id],
  )
  return result.rows
}

export const updateResource = async (resource_id, { title, url }) => {
  const result = await pool.query(
    `UPDATE resources
     SET title = $1,
         url = $2
     WHERE id = $3
     RETURNING *`,
    [title, url, resource_id],
  )
  return result.rows[0]
}

export const deleteResource = async resource_id => {
  const result = await pool.query(
    `DELETE FROM resources
     WHERE id = $1
     RETURNING *`,
    [resource_id],
  )
  return result.rows[0]
}

export const getResourcesByUser = async user_id => {
  const result = await pool.query(
    `SELECT * FROM resources
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user_id],
  )
  return result.rows
}
