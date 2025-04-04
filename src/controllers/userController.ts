import { NextFunction, Request, Response } from 'express'
import userService from '~/services/userService'

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService.getAllUsers()
    res.json(response)
  } catch (error) {
    next(error)
  }
}

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService.getUsers(req.query)
    res.json(response)
  } catch (error) {
    next(error)
  }
}

const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await userService.getUserDeitals(req.params?.id)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService.addUser({ ...req.body })
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

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService.deleteUserById(req.params?.id)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const userController = {
  getAllUsers,
  getUsers,
  getUserDetails,
  addUser,
  editUser,
  deleteUser
}

export default userController
