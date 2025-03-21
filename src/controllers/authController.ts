import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import authService from '~/services/authService'
import userService from '~/services/userService'

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await authService.register(req.body)
    res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    next(error)
  }
}

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await authService.verifyOTP(req.body)
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loggedIn = await authService.login(req.body)
    res.status(loggedIn.statusCode).json(loggedIn)
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await authService.refreshToken(req.body)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req
  try {
    const profile = await authService.getProfile(user.uid)
    res.status(profile.statusCode).json(profile)
  } catch (error) {
    next(error)
  }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await authService.logout(req.body)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const authController = {
  register,
  verifyOTP,
  login,
  refreshToken,
  getProfile,
  logout
}

export default authController
