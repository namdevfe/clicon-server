import { NextFunction, Request, Response } from 'express'
import roleService from '~/services/roleService'

const addNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addedRole = await roleService.addNew(req.body)
    res.status(addedRole.statusCode).json(addedRole)
  } catch (error) {
    next(error)
  }
}

const editById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  try {
    const editedRole = await roleService.editById(id, req.body)
    res.status(editedRole.statusCode).json(editedRole)
  } catch (error) {
    next(error)
  }
}

const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query
  try {
    const response = await roleService.getRoles(query)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await roleService.getAll()
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const deleteRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  try {
    const response = await roleService.deleteRoleById(id)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const roleController = {
  addNew,
  editById,
  getRoles,
  getAll,
  deleteRoleById
}

export default roleController
