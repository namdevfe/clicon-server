import { NextFunction, Request, Response } from 'express'
import userService from '~/services/userService'

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registeredUser = await userService.register(req.body)
    res.status(registeredUser.statusCode).json(registeredUser)
  } catch (error) {
    next(error)
  }
}

const getList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersRes = await userService.getList(req.query)
    res.status(usersRes.statusCode).json(usersRes)
  } catch (error) {
    next(error)
  }
}

const userController = {
  register,
  getList
}

export default userController
