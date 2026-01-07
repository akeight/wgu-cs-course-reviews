import * as userModel from '../models/user.model.js'

export const getAllUsers = () => userModel.getAllUsers()
export const getUserById = user_id => userModel.getUserById(user_id)
export const getEnrolledCourses = user_id =>
  userModel.getEnrolledCourses(user_id)
export const getReviewsByUser = user_id =>
  userModel.getReviewsByUser(user_id)
