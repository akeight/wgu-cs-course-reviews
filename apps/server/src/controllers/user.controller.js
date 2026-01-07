import * as userService from '../services/user.service.js'
import * as resourceService from '../services/resource.service.js'

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json(users)
    } catch (err) {
        next(err)
    }
}

export const getUserProfile = async (req, res, next) => {
    try {
        const { id: user_id } = req.params
        const user = await userService.getUserById(user_id)
        if (!user) {
            return res.status(404).json({ error: 'User not found.' })
        }
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

export const getEnrolledCoursesForUser = async (req, res, next) => {
    try {
        const { id: user_id } = req.params
        const courses = await userService.getEnrolledCourses(user_id)
        res.status(200).json(courses)
    } catch (err) {
        next(err)
    }
}

export const getReviewsForUser = async (req, res, next) => {
    try {
        const { id: user_id } = req.params
        const reviews = await userService.getReviewsByUser(user_id)
        res.status(200).json(reviews)
    } catch (err) {
        next(err)
    }
}

export const getResourcesForUser = async (req, res, next) => {
    try {
        const { id: user_id } = req.params
        const resources = await resourceService.getResourcesByUser(user_id)
        res.status(200).json(resources)
    } catch (err) {
        next(err)
    }
}
