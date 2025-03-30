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

const userController = {
  addUser
}

export default userController
