import * as resourceModel from '../models/resource.model.js'

export const createResource = payload => resourceModel.createResource(payload)

export const getResourceById = resource_id =>
    resourceModel.getResourceById(resource_id)

export const getResourcesByCourse = course_id =>
    resourceModel.getResourcesByCourse(course_id)

export const updateResource = (resource_id, payload) =>
    resourceModel.updateResource(resource_id, payload)

export const deleteResource = resource_id =>
    resourceModel.deleteResource(resource_id)

export const getResourcesByUser = user_id =>
    resourceModel.getResourcesByUser(user_id)
