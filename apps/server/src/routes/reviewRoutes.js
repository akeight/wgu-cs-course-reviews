import { Router } from 'express'
import {
  createReview,
  deleteReview,
  listCourseReviews,
  updateReview,
  getReview,
  voteOnReview,
  getUserVote
} from '../controllers/review.controller.js'

export const courseReviewRouter = Router({ mergeParams: true })
export const reviewRouter = Router()

courseReviewRouter.get('/', listCourseReviews)
courseReviewRouter.post('/', createReview)

reviewRouter.get('/:review_id', getReview)
reviewRouter.put('/:review_id', updateReview)
reviewRouter.delete('/:review_id', deleteReview)
reviewRouter.post('/:review_id/vote', voteOnReview)
reviewRouter.get('/:review_id/vote', getUserVote)
