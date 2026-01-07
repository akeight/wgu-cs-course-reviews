import * as reviewService from '../services/review.service.js'

export const listCourseReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByCourse(req.params.course_id)
    res.json(reviews)
  } catch (error) {
    next(error)
  }
}

export const getReview = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewById(req.params.review_id)
    res.json(reviews)
  } catch (error) {
    next(error)
  }
}

export const createReview = async (req, res, next) => {
  try {
    // Require authentication
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required to create a review.' })
    }

    // Validate hours_per_week
    const hoursPerWeek = Number(req.body.hours_per_week)
    if (hoursPerWeek > 168) {
      return res.status(400).json({ error: 'Time spent cannot exceed 168 hours per week.' })
    }

    const user_id = req.user.id // database user ID from session
    const review = await reviewService.createReview({
      ...req.body,
      user_id,
      course_id: req.params.course_id,
    })
    res.status(201).json(review)
  } catch (error) {
    next(error)
  }
}

export const updateReview = async (req, res, next) => {
  try {
    // Require authentication
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required to update a review.' })
    }

    // Check if review exists and belongs to the user
    const existingReview = await reviewService.getReviewById(req.params.review_id)
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' })
    }

    if (existingReview.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own reviews.' })
    }

    // Validate hours_per_week if provided
    if (req.body.hours_per_week !== undefined) {
      const hoursPerWeek = Number(req.body.hours_per_week)
      if (hoursPerWeek > 168) {
        return res.status(400).json({ error: 'Time spent cannot exceed 168 hours per week.' })
      }
    }

    const review = await reviewService.updateReview(req.params.review_id, req.body)
    res.json(review)
  } catch (error) {
    next(error)
  }
}

export const deleteReview = async (req, res, next) => {
  try {
    // Require authentication
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required to delete a review.' })
    }

    // Check if review exists and belongs to the user
    const existingReview = await reviewService.getReviewById(req.params.review_id)
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' })
    }

    if (existingReview.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own reviews.' })
    }

    await reviewService.deleteReview(req.params.review_id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export const voteOnReview = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required to vote.' })
    }

    const { vote_type } = req.body
    
    if (!vote_type || !['up', 'down'].includes(vote_type)) {
      return res.status(400).json({ error: 'Invalid vote type. Must be "up" or "down".' })
    }

    const result = await reviewService.voteOnReview(
      req.user.id,
      req.params.review_id,
      vote_type
    )
    
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getUserVote = async (req, res, next) => {
  try {
    // Optional authentication - return null if not logged in
    if (!req.user) {
      return res.json({ userVote: null })
    }

    const userVote = await reviewService.getUserVote(req.user.id, req.params.review_id)
    res.json({ userVote })
  } catch (error) {
    next(error)
  }
}
