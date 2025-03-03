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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const userModel_1 = __importDefault(require("../models/userModel"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const hashPassword = (plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const SALT_ROUNDS = 8;
    return bcrypt_1.default.hashSync(plainPassword, SALT_ROUNDS);
});
const comparePassword = (plainPassword, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(plainPassword, hashPassword);
});
const register = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = reqBody;
    try {
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User has already existing.');
        }
        const hashedPassword = yield hashPassword(password);
        const registerData = Object.assign(Object.assign({}, reqBody), { password: hashedPassword });
        const _a = (yield userModel_1.default.create(registerData)).toObject(), { password: excludePassword } = _a, registeredUser = __rest(_a, ["password"]);
        return {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            message: 'Registered account is succesfully.',
            data: registeredUser
        };
    }
    catch (error) {
        throw error;
    }
});
/**
 * Check email
 * Compare password
 * Generate token
 */
const login = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = reqBody;
    try {
        const existingUser = yield userModel_1.default.findOne({ email, _destroy: false });
        if (!existingUser) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found.');
        }
        const isCorrectPassword = yield comparePassword(password, existingUser.password);
        if (!isCorrectPassword) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is not correct.');
        }
        const accessToken = jsonwebtoken_1.default.sign({ email }, environment_1.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: environment_1.env.ACCESS_TOKEN_EXPIRES_TIME
        });
        const refreshToken = jsonwebtoken_1.default.sign({ email }, environment_1.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: environment_1.env.REFRESH_TOKEN_EXPIRES_TIME
        });
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Login is successfully.',
            data: {
                accessToken,
                refreshToken
            }
        };
    }
    catch (error) {
        throw error;
    }
});
const userService = {
    register,
    login
};
exports.default = userService;
