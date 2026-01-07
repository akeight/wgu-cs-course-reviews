import { Router } from 'express'
import * as resourceController from '../controllers/resource.controller.js'

export const courseResourceRouter = Router({ mergeParams: true })
export const resourceRouter = Router()

courseResourceRouter.post('/', resourceController.createResource)
courseResourceRouter.get('/', resourceController.getResourcesForCourse)

resourceRouter.put('/:id', resourceController.updateResource)
resourceRouter.delete('/:id', resourceController.deleteResource)
