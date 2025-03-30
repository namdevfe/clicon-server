import { StatusCodes } from 'http-status-codes'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { env } from '~/config/environment'
import { OTP_TIME_EXPIRES } from '~/constants/datetime'
import { ROLES } from '~/constants/role'
import Role from '~/models/roleModel'
import User from '~/models/userModel'
import mailService from '~/services/mailService'
import { IApiResponse } from '~/types/common'
import {
  LoginUserBodyType,
  LogoutBodyTypes,
  RefreshTokenBodyTypes,
  RegisterUserBodyType,
  SendMailVerifyOTPTypes,
  VerifyOTPBodyTypes
} from '~/types/userType'
import ApiError from '~/utils/ApiError'
import generateHTMLVerifyOTP from '~/utils/generateHTMLVerifyOTP'
import { generateOTP } from '~/utils/generateOTP'
import { comparePassword, hashPassword } from '~/utils/hashPassword'

/**
 * @param reqBody
 * Check email had been registered or not
 * If not then send OTP to email -> User send OTP to server -> Check OTP
 * -> Invalid -> Register failed (isActive: false) (default)
 * -> Valid -> Register success (isActive: true)
 */
const register = async (
  reqBody: RegisterUserBodyType
): Promise<IApiResponse | undefined> => {
  try {
    const { email, password } = reqBody

    // Check email
    const userExist = await User.findOne({ email })

    if (userExist !== null) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email had already been used')
    }

    // Hash password
    const passwordHashed = await hashPassword(password)

    // Create new account with isActive = fasle
    const roleDefault = await Role.findOne({ name: ROLES.CUSTOMER })
    const createData = {
      ...reqBody,
      password: passwordHashed,
      role: roleDefault?._id
    }
    const createdUser = await User.create(createData)

    if (createdUser._id) {
      // Generate OTP
      const otpCode = generateOTP(6)
      const otpExpires: number = Date.now() + OTP_TIME_EXPIRES

      const htmlContent = generateHTMLVerifyOTP({
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        otpCode
      })
      // Send email
      const emailData = {
        email: createdUser.email,
        subject: 'Xác thực tài khoản đã đăng ký tại Clicon',
        content: htmlContent
      }

      // Save OTP to db
      createdUser.otpCode = otpCode
      createdUser.otpExpires = otpExpires
      await createdUser.save()

      const mailRes = await mailService.sendMail(emailData)

      if (mailRes.statusCode === StatusCodes.OK) {
        return {
          statusCode: StatusCodes.OK,
          message: 'OTP had been sent to your email. Please check your email.'
        }
      }
    }
  } catch (error) {
    throw error
  }
}

/**
 * @param reqBody
 * Check OTP valid
 * Case 1: Invalid (If current time larger than otp time expires or otp not same)
 * Case 2: Valid (If current time less than otp time expires and otp same)
 */
const verifyOTP = async (
  reqBody: VerifyOTPBodyTypes
): Promise<IApiResponse> => {
  try {
    const { otpCode } = reqBody

    // Find user
    const userExist = await User.findOne({ otpCode })

    if (!userExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP code invalid.')
    }

    // Compare OTP code
    if (otpCode !== userExist.otpCode) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP code invalid.')
    }

    // Check otp time expires
    if (Date.now() > (userExist.otpExpires as number)) {
      throw new ApiError(StatusCodes.REQUEST_TIMEOUT, 'OTP expired.')
    }

    // Change staus isActive to true
    userExist.isActive = true
    // Delete otpCode & otpExpires
    userExist.otpCode = undefined
    userExist.otpExpires = undefined
    await userExist.save()

    const {
      password: _password,
      otpCode: _otpCode,
      ...resData
    } = userExist.toObject()

    return {
      statusCode: StatusCodes.OK,
      message: 'Verify otp is successfully.'
      // data: resData
    }
  } catch (error) {
    throw error
  }
}

const login = async (reqBody: LoginUserBodyType): Promise<IApiResponse> => {
  const { email, password } = reqBody
  try {
    const userExist = await User.findOne({ email, _destroy: false })

    if (!userExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found.')
    }

    if (!userExist.isActive) {
      // Send OTP
      const otpCode = generateOTP(6)
      const otpExpires = Date.now() + OTP_TIME_EXPIRES

      // Save otp to db
      userExist.otpCode = otpCode
      userExist.otpExpires = otpExpires
      await userExist.save()

      // Send email
      const htmlContent = generateHTMLVerifyOTP({
        firstName: userExist.firstName,
        lastName: userExist.lastName,
        otpCode
      })

      const emailRes = await mailService.sendMail({
        email: userExist.email,
        content: htmlContent,
        subject: 'Xác thực đăng ký tài khoản tại Clicon'
      })

      if (emailRes.statusCode === StatusCodes.OK) {
        return {
          statusCode: StatusCodes.OK,
          message: 'OTP code had been sent to your email address.'
        }
      }
    }

    // User actived
    const isCorrectPassword = await comparePassword(
      password,
      userExist.password
    )

    if (!isCorrectPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is not correct.')
    }

    // Generate token
    const accessToken = jwt.sign(
      { email, role: userExist.role, uid: userExist._id },
      env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_TIME
      }
    )

    const refreshToken = jwt.sign(
      { email, uid: userExist._id },
      env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: env.REFRESH_TOKEN_EXPIRES_TIME
      }
    )

    userExist.refreshToken = refreshToken
    await userExist.save()

    const loginRes = {
      accessToken,
      refreshToken
    }

    return {
      statusCode: StatusCodes.OK,
      message: 'Login is successfully.',
      data: loginRes
    }
  } catch (error) {
    throw error
  }
}

const refreshToken = async (
  reqBody: RefreshTokenBodyTypes
): Promise<IApiResponse> => {
  try {
    const { refreshToken } = reqBody

    const userExist = await User.findOne({ refreshToken })

    if (!userExist) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }

    // Verify token
    userExist.refreshToken &&
      jwt.verify(userExist.refreshToken, env.REFRESH_TOKEN_SECRET_KEY)

    // Generate new token
    const newAccessToken = jwt.sign(
      { email: userExist.email, role: userExist.role, uid: userExist._id },
      env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_TIME
      }
    )

    return {
      statusCode: StatusCodes.OK,
      message: 'Refresh token is successfully.',
      data: {
        accessToken: newAccessToken,
        refreshToken
      }
    }
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token expired.')
    }

    throw error
  }
}

const logout = async (reqBody: LogoutBodyTypes): Promise<IApiResponse> => {
  const { _id, refreshToken } = reqBody

  try {
    const userExist = await User.findOne({ _id, refreshToken })

    if (!userExist) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token.')
    }

    userExist.refreshToken = undefined
    await userExist.save()

    return {
      statusCode: StatusCodes.OK,
      message: 'Logout is successfully.'
    }
  } catch (error) {
    throw error
  }
}

const getProfile = async (userId: string): Promise<IApiResponse> => {
  try {
    const profile = await User.findById(userId)
      .select('-password -refreshToken')
      .populate('role', 'name')

    if (!profile) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Not found.')
    }

    return {
      statusCode: StatusCodes.OK,
      message: 'Get profile is successfully.',
      data: profile
    }
  } catch (error) {
    throw error
  }
}

// Export services
const authService = {
  register,
  verifyOTP,
  login,
  refreshToken,
  logout,
  getProfile
}

export default authService
