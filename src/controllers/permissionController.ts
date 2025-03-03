import { NextFunction, Request, Response } from 'express'
import permissionService from '~/services/permissionService'

const addNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdPermission = await permissionService.addNew(req.body)
    res.status(createdPermission.statusCode).json(createdPermission)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await permissionService.getAll()
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const getList = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query
  try {
    const response = await permissionService.getList(query)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const edit = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  try {
    const editedPermission = await permissionService.edit(id, req.body)
    res.status(editedPermission.statusCode).json(editedPermission)
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  try {
    const deletedPermission = await permissionService.deleteById(id)
    res.status(deletedPermission.statusCode).json(deletedPermission)
  } catch (error) {
    next(error)
  }
}

const permissionController = {
  addNew,
  getAll,
  getList,
  edit,
  deleteById
}

export default permissionController
