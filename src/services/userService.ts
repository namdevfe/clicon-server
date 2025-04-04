import { StatusCodes } from 'http-status-codes'
import { OTP_TIME_EXPIRES } from '~/constants/datetime'
import { USER_EXCLUDE_FIELDS } from '~/constants/excludeField'
import { ROLES } from '~/constants/role'
import Role from '~/models/roleModel'
import User from '~/models/userModel'
import mailService from '~/services/mailService'
import { IApiResponse, IQueryParams } from '~/types/common'
import { AddUser, EditUserBodyTypes } from '~/types/userType'
import ApiError from '~/utils/ApiError'
import generateHTMLVerifyOTP from '~/utils/generateHTMLVerifyOTP'
import { generateOTP } from '~/utils/generateOTP'
import { hashPassword } from '~/utils/hashPassword'

const getUsers = async (queryParams: IQueryParams): Promise<IApiResponse> => {
  const {
    page = 1,
    limit = 10,
    sort = 'asc',
    sortBy = 'createdAt'
  } = queryParams

  try {
    const queries: Record<string, any> = {
      _destroy: false
    }

    const options = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: { [sortBy as string]: sort }
    }

    const users = await User.find(queries, null, options).select(
      USER_EXCLUDE_FIELDS
    )
    const total = await User.countDocuments()
    const totalPages = Math.ceil(Number(total) / Number(limit))

    return {
      statusCode: StatusCodes.OK,
      message: 'Get list user is successfully.',
      data: {
        users,
        pagination: {
          total,
          currentPage: Number(page),
          limit,
          totalPages
        }
      }
    }
  } catch (error) {
    throw error
  }
}

const getAllUsers = async (): Promise<IApiResponse> => {
  try {
    const users = await User.find().select(
      '-password -refreshToken -otpCode -otpExpires'
    )
    return {
      statusCode: StatusCodes.OK,
      message: 'Get all users are successfully.',
      data: users
    }
  } catch (error) {
    throw error
  }
}

const getUserDeitals = async (id: string): Promise<IApiResponse> => {
  try {
    const response = await User.findById(id).select(USER_EXCLUDE_FIELDS)

    if (!response?._id) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found.')
    }

    return {
      statusCode: StatusCodes.OK,
      message: 'Get user details is successfully.',
      data: response
    }
  } catch (error) {
    throw error
  }
}

const editUserById = async (
  id: string,
  reqBody: EditUserBodyTypes
): Promise<IApiResponse> => {
  try {
    const editUserData: EditUserBodyTypes = {
      ...reqBody
    }

    if (!!reqBody?.password) {
      const hashedPassword = hashPassword(reqBody.password)
      editUserData.password = hashedPassword
    } else {
      delete editUserData.password
    }

    const response = await User.findByIdAndUpdate(id, editUserData, {
      new: true
    }).select(USER_EXCLUDE_FIELDS)

    return {
      statusCode: StatusCodes.OK,
      message: `Edited user with id=${id} is successfully.`,
      data: response
    }
  } catch (error) {
    throw error
  }
}

const deleteUserById = async (id: string): Promise<IApiResponse> => {
  try {
    const response = await User.findByIdAndDelete(id, { new: true }).select(
      USER_EXCLUDE_FIELDS
    )

    return {
      statusCode: StatusCodes.OK,
      message: `Deleted user with id=${response?._id} is susccessfully.`,
      data: response
    }
  } catch (error) {
    throw error
  }
}

const addUser = async (reqBody: AddUser): Promise<IApiResponse | undefined> => {
  const { email, password, role } = reqBody

  try {
    const existingUser = await User.findOne({ email })

    // Check email
    if (existingUser?._id) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'This email address had already used.'
      )
    }

    // Hash password
    const hashedPassword = hashPassword(password)

    const roleCustomer = await Role.findOne({ name: ROLES.CUSTOMER })

    const addNewData: AddUser = {
      ...reqBody,
      email,
      password: hashedPassword,
      role: role || roleCustomer?._id.toString()
    }

    const dataRes = await User.create(addNewData)

    // Generate OTP code
    const otpCode = generateOTP(6)
    const otpExpires = Date.now() + OTP_TIME_EXPIRES

    const htmlContent = generateHTMLVerifyOTP({
      firstName: dataRes.firstName,
      lastName: dataRes.lastName,
      otpCode
    })
    // Send email
    const emailData = {
      email: dataRes.email,
      subject: 'Xác thực tài khoản đã đăng ký tại Clicon',
      content: htmlContent
    }

    // Save OTP to db
    dataRes.otpCode = otpCode
    dataRes.otpExpires = otpExpires
    await dataRes.save()

    await mailService.sendMail(emailData)

    return {
      statusCode: StatusCodes.OK,
      message: 'OTP had been sent to your email. Please check your email.'
    }
  } catch (error) {
    throw error
  }
}

const userService = {
  getAllUsers,
  getUsers,
  getUserDeitals,
  addUser,
  editUserById,
  deleteUserById
}

export default userService
