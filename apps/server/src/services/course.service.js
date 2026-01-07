import * as courseModel from '../models/course.model.js'
import { formatDate } from '../utils/helpers.js'

const formatCourse = course => {
  if (!course) return null
  return {
    ...course,
    created_at: course.created_at ? formatDate(course.created_at) : null,
  }
}

export const listCourses = async () => {
  const courses = await courseModel.getCourses()
  return courses.map(formatCourse)
}

export const listCoursesWithStats = async () => {
  const courses = await courseModel.getCoursesWithStats()
  return courses.map(course => ({
    ...formatCourse(course),
    total_reviews: Number(course.total_reviews),
    average_rating: Number(course.average_rating),
    average_difficulty: Number(course.average_difficulty),
    average_hours_per_week: Math.round(Number(course.average_hours_per_week))
  }))
}

export const getCourse = async course_id => {
  const course = await courseModel.getCourseById(course_id)
  return formatCourse(course)
}

export const createCourse = async data => {
  const course = await courseModel.createCourse(data)
  return formatCourse(course)
}

export const updateCourse = async (course_id, data) => {
  const course = await courseModel.updateCourse(course_id, data)
  return formatCourse(course)
}

export const deleteCourse = async course_id => {
  return courseModel.deleteCourse(course_id)
}
