import { NextFunction, Request, Response } from 'express'
import userService from '~/services/userService'

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await userService.register(req.body)
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

const userController = {
  register
}

export default userController
