import { NextFunction, Request, Response } from 'express'
import userService from '~/services/userService'

const getList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersRes = await userService.getList(req.query)
    res.status(usersRes.statusCode).json(usersRes)
  } catch (error) {
    next(error)
  }
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  try {
    const updatedUser = await userService.updateById(id, req.body)
    res.status(updatedUser.statusCode).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  try {
    const deletedUser = await userService.deleteById(id)
    res.status(deletedUser.statusCode).json(deletedUser)
  } catch (error) {
    next(error)
  }
}

const userController = {
  getList,
  updateById,
  deleteById
}

export default userController
