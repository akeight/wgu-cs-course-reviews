import * as courseService from '../services/course.service.js'

export const listCourses = async (req, res, next) => {
  try {
    // Check if stats are requested via query parameter
    const includeStats = req.query.stats === 'true'
    
    const courses = includeStats 
      ? await courseService.listCoursesWithStats()
      : await courseService.listCourses()
      
    res.json(courses)
  } catch (error) {
    next(error)
  }
}

export const getCourse = async (req, res, next) => {
  try {
    const course = await courseService.getCourse(req.params.course_id)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }
    res.json(course)
  } catch (error) {
    next(error)
  }
}

export const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.body)
    res.status(201).json(course)
  } catch (error) {
    next(error)
  }
}

export const updateCourse = async (req, res, next) => {
  try {
    const course = await courseService.updateCourse(req.course_id, req.body)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }
    res.json(course)
  } catch (error) {
    next(error)
  }
}

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await courseService.deleteCourse(req.course_id)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
