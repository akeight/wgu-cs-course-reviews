import { Router } from 'express'
import courseRoutes from './courseRoutes.js'
import {
  courseResourceRouter,
  resourceRouter,
} from './resourceRoutes.js'
import {
  courseReviewRouter,
  reviewRouter,
} from './reviewRoutes.js'
import userRoutes from './userRoutes.js'
import authRoutes from './authRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/courses/:course_id/resources', courseResourceRouter)
router.use('/courses/:course_id/reviews', courseReviewRouter)
router.use('/courses', courseRoutes)
router.use('/resources', resourceRouter)
router.use('/reviews', reviewRouter)
router.use('/users', userRoutes)

export default router
