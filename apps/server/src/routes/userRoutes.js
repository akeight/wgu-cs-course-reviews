import { Router } from 'express'
import {
    getAllUsers,
    getUserProfile,
    getEnrolledCoursesForUser,
    getReviewsForUser,
    getResourcesForUser,
} from '../controllers/user.controller.js'

const router = Router()

router.get('/', getAllUsers)
router.get('/:id', getUserProfile)
router.get('/:id/courses', getEnrolledCoursesForUser)
router.get('/:id/reviews', getReviewsForUser)
router.get('/:id/resources', getResourcesForUser)

export default router
