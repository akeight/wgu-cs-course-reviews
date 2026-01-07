import { Router } from 'express'
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller.js'

const router = Router()

router.get('/', listCourses)
router.get('/:course_id', getCourse)
router.post('/', createCourse)
router.put('/:course_id', updateCourse)
router.delete('/:course_id', deleteCourse)

export default router
