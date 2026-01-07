import * as resourceService from '../services/resource.service.js'

export const createResource = async (req, res, next) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required to create a resource.' })
    }

    const user_id = req.user.id
    const payload = {
      ...req.body,
      course_id: req.course_id ?? Number(req.params.course_id),
      user_id,
    }

    if (!payload.title || !payload.url) {
      return res.status(400).json({ error: 'Title and URL are required.' })
    }

    const resource = await resourceService.createResource(payload)
    res.status(201).json(resource)
  } catch (err) {
    next(err)
  }
}

export const getResourcesForCourse = async (req, res, next) => {
  try {
    const course_id = req.course_id ?? Number(req.params.course_id)
    const resources = await resourceService.getResourcesByCourse(course_id)
    res.status(200).json(resources)
  } catch (err) {
    next(err)
  }
}

export const updateResource = async (req, res, next) => {
  try {
    // Require authentication
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required to update a resource.' })
    }

    const resource_id = Number(req.params.id)

    // Check if resource exists and belongs to the user
    const existingResource = await resourceService.getResourceById(resource_id)
    if (!existingResource) {
      return res.status(404).json({ error: 'Resource not found.' })
    }

    if (existingResource.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own resources.' })
    }

    const resource = await resourceService.updateResource(resource_id, req.body)
    res.status(200).json(resource)
  } catch (err) {
    next(err)
  }
}

export const deleteResource = async (req, res, next) => {
  try {
    // Require authentication
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required to delete a resource.' })
    }

    const resource_id = Number(req.params.id)

    // Check if resource exists and belongs to the user
    const existingResource = await resourceService.getResourceById(resource_id)
    if (!existingResource) {
      return res.status(404).json({ error: 'Resource not found.' })
    }

    if (existingResource.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own resources.' })
    }

    await resourceService.deleteResource(resource_id)
    res.status(204).end()
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
