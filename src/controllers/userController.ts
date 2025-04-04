import { NextFunction, Request, Response } from 'express'
import userService from '~/services/userService'

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService.addUser({ ...req.body })
    res.json(response)
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService.getAllUsers()
    res.json(response)
  } catch (error) {
    next(error)
  }
}

const editUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params?.id
  try {
    const response = await userService.editUserById(userId, req.body)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const userController = {
  getAllUsers,
  addUser,
  editUser
}

export default userController
