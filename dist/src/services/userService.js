"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const userModel_1 = __importDefault(require("../models/userModel"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const hashPassword_1 = require("../utils/hashPassword");
// const register = async (
//   reqBody: RegisterUserBodyType
// ): Promise<IApiResponse> => {
//   const { email, password, role } = reqBody
//   try {
//     const existingUser = await User.findOne({ email })
//     if (existingUser) {
//       throw new ApiError(
//         StatusCodes.BAD_REQUEST,
//         'This email is already in use.'
//       )
//     }
//     // Assign default role is CUSTOMER
//     let roleInfo
//     if (role) {
//       roleInfo = await Role.findById(role)
//     } else {
//       const roles = await Role.find()
//       roleInfo = roles.find((role) => role.name === ROLES.CUSTOMER)
//     }
//     const hashedPassword = await hashPassword(password)
//     const addData = {
//       ...reqBody,
//       password: hashedPassword,
//       role: roleInfo?._id
//     }
//     const { password: excludePassword, ...addedUser } = (
//       await User.create(addData)
//     ).toObject()
//     return {
//       statusCode: StatusCodes.CREATED,
//       message: 'Add new user is successfully.',
//       data: addedUser
//     }
//   } catch (error) {
//     throw error
//   }
// }
// const login = async (reqBody: LoginUserBodyType): Promise<IApiResponse> => {
//   const { email, password } = reqBody
//   try {
//     const existingUser = await User.findOne({ email, _destroy: false })
//     if (!existingUser) {
//       throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found.')
//     }
//     const isCorrectPassword = await comparePassword(
//       password,
//       existingUser.password
//     )
//     if (!isCorrectPassword) {
//       throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is not correct.')
//     }
//     const accessToken = jwt.sign(
//       { email, role: existingUser.role, uid: existingUser._id },
//       env.ACCESS_TOKEN_SECRET_KEY,
//       {
//         expiresIn: env.ACCESS_TOKEN_EXPIRES_TIME
//       }
//     )
//     const refreshToken = jwt.sign(
//       { email, uid: existingUser._id },
//       env.REFRESH_TOKEN_SECRET_KEY,
//       {
//         expiresIn: env.REFRESH_TOKEN_EXPIRES_TIME
//       }
//     )
//     return {
//       statusCode: StatusCodes.OK,
//       message: 'Login is successfully.',
//       data: {
//         accessToken,
//         refreshToken
//       }
//     }
//   } catch (error) {
//     throw error
//   }
// }
// const getProfile = async (userId: string): Promise<IApiResponse> => {
//   try {
//     const profile = await User.findById(userId)
//       .select('-password')
//       .populate('role', 'name')
//     if (!profile) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Not found.')
//     }
//     return {
//       statusCode: StatusCodes.OK,
//       message: 'Get profile is successfully.',
//       data: profile
//     }
//   } catch (error) {
//     throw error
//   }
// }
const getList = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, sort = 'asc', sortBy = 'createdAt' } = queryParams;
    try {
        const queries = {
            _destroy: false
        };
        const options = {
            skip: (Number(page) - 1) * Number(limit),
            limit: Number(limit),
            sort: { [sortBy]: sort }
        };
        const users = yield userModel_1.default.find(queries, null, options).select('-password');
        const total = yield userModel_1.default.countDocuments();
        const totalPages = Math.ceil(Number(total) / Number(limit));
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
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
        };
    }
    catch (error) {
        throw error;
    }
});
const updateById = (id, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = Object.assign({}, reqBody);
        if (reqBody === null || reqBody === void 0 ? void 0 : reqBody.password) {
            const hashedPassword = yield (0, hashPassword_1.hashPassword)(reqBody.password);
            updateData.password = hashedPassword;
        }
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(id, updateData, {
            new: true
        }).select('-password');
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: `Updated user with id = ${id} is successfully.`,
            data: updatedUser
        };
    }
    catch (error) {
        throw error;
    }
});
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield userModel_1.default.findByIdAndDelete(id, { new: true }).select('-password');
        if (!(deletedUser === null || deletedUser === void 0 ? void 0 : deletedUser._id)) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found.');
        }
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: `Deleted user with id=${deletedUser === null || deletedUser === void 0 ? void 0 : deletedUser._id} is susccessfully.`,
            data: deletedUser
        };
    }
    catch (error) {
        throw error;
    }
});
const userService = {
    // register,
    // login,
    // getProfile,
    getList,
    updateById,
    deleteById
};
exports.default = userService;
