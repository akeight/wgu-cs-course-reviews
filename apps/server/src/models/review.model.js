import { pool } from '../config/database.js'

const columns = `id, user_id, course_id, rating, difficulty, hours_per_week,
  review_text, upvotes, downvotes, created_at`

const reviewColumns = 'r.id, r.user_id, r.course_id, r.rating, r.difficulty, r.hours_per_week, r.review_text, r.upvotes, r.downvotes, r.created_at'
const fullColumns = `${reviewColumns}, u.username AS username, u.avatar AS avatar`

export const getReviewsByCourse = async course_id => {
  const result = await pool.query(
    `SELECT ${fullColumns}
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.course_id = $1
     ORDER BY r.created_at DESC`,
    [course_id],
  )
  return result.rows
}

export const getReviewById = async review_id => {
  const result = await pool.query(
    `SELECT ${fullColumns}
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.id = $1`,
    [review_id],
  )
  return result.rows[0]
}

export const createReview = async ({
  user_id,
  course_id,
  rating,
  difficulty,
  hours_per_week,
  review_text,
}) => {
  const result = await pool.query(
    `INSERT INTO reviews (
        user_id,
        course_id,
        rating,
        difficulty,
        hours_per_week,
        review_text
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${columns}`,
    [user_id, course_id, rating, difficulty, hours_per_week, review_text],
  )
  return result.rows[0]
}

export const updateReview = async (
  review_id,
  { rating, difficulty, hours_per_week, review_text },
) => {
  const result = await pool.query(
    `UPDATE reviews
     SET rating = $1,
         difficulty = $2,
         hours_per_week = $3,
         review_text = $4
     WHERE id = $5
     RETURNING ${columns}`,
    [rating, difficulty, hours_per_week, review_text, review_id],
  )
  return result.rows[0]
}

export const deleteReview = async review_id => {
  const result = await pool.query(
    `DELETE FROM reviews WHERE id = $1 RETURNING ${columns}`,
    [review_id],
  )
  return result.rows[0]
}

// Get user's vote on a specific review
export const getUserVote = async (user_id, review_id) => {
  const result = await pool.query(
    `SELECT vote_type FROM review_votes WHERE user_id = $1 AND review_id = $2`,
    [user_id, review_id],
  )
  return result.rows[0]?.vote_type || null
}

// Vote on a review (handles insert/update/delete and updates counters)
export const voteOnReview = async (user_id, review_id, vote_type) => {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    // Get current vote
    const currentVote = await client.query(
      `SELECT vote_type FROM review_votes WHERE user_id = $1 AND review_id = $2`,
      [user_id, review_id],
    )
    
    const existingVote = currentVote.rows[0]?.vote_type
    
    // Determine vote changes
    let upvoteDelta = 0
    let downvoteDelta = 0
    
    if (existingVote === vote_type) {
      // Remove vote (user clicked same button)
      await client.query(
        `DELETE FROM review_votes WHERE user_id = $1 AND review_id = $2`,
        [user_id, review_id],
      )
      
      if (vote_type === 'up') upvoteDelta = -1
      else downvoteDelta = -1
      
    } else if (existingVote) {
      // Change vote if toggled between up and down
      await client.query(
        `UPDATE review_votes SET vote_type = $1, created_at = CURRENT_TIMESTAMP 
         WHERE user_id = $2 AND review_id = $3`,
        [vote_type, user_id, review_id],
      )
      
      if (vote_type === 'up') {
        upvoteDelta = 1
        downvoteDelta = -1
      } else {
        upvoteDelta = -1
        downvoteDelta = 1
      }
      
    } else {
      // New vote
      await client.query(
        `INSERT INTO review_votes (user_id, review_id, vote_type) VALUES ($1, $2, $3)`,
        [user_id, review_id, vote_type],
      )
      
      if (vote_type === 'up') upvoteDelta = 1
      else downvoteDelta = 1
    }
    
    // Update review counters
    const updatedReview = await client.query(
      `UPDATE reviews 
       SET upvotes = GREATEST(0, upvotes + $1),
           downvotes = GREATEST(0, downvotes + $2)
       WHERE id = $3
       RETURNING ${columns}`,
      [upvoteDelta, downvoteDelta, review_id],
    )
    
    await client.query('COMMIT')
    
    // Return updated review and new vote status
    return {
      review: updatedReview.rows[0],
      userVote: existingVote === vote_type ? null : vote_type,
    }
    
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
