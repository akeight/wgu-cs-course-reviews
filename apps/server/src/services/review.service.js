import * as reviewModel from '../models/review.model.js'

export const getReviewsByCourse = async course_id => {
  return reviewModel.getReviewsByCourse(course_id)
}

export const getReviewById = async review_id => {
  return reviewModel.getReviewById(review_id)
}

export const createReview = async payload => {
  return reviewModel.createReview(payload)
}

export const updateReview = async (review_id, payload) => {
  return reviewModel.updateReview(review_id, payload)
}

export const deleteReview = async review_id => {
  return reviewModel.deleteReview(review_id)
}

export const getUserVote = async (user_id, review_id) => {
  return reviewModel.getUserVote(user_id, review_id)
}

export const voteOnReview = async (user_id, review_id, vote_type) => {
  return reviewModel.voteOnReview(user_id, review_id, vote_type)
}
