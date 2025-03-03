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

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loggedIn = await userService.login(req.body)
    res.status(loggedIn.statusCode).json(loggedIn)
  } catch (error) {
    next(error)
  }
}

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req
  try {
    const profile = await userService.getProfile(user.uid)
    res.status(profile.statusCode).json(profile)
  } catch (error) {
    next(error)
  }
}

const authController = {
  register,
  login,
  getProfile
}

export default authController
