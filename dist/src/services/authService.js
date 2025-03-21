"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const datetime_1 = require("../constants/datetime");
const role_1 = require("../constants/role");
const roleModel_1 = __importDefault(require("../models/roleModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const mailService_1 = __importDefault(require("../services/mailService"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const generateOTP_1 = require("../utils/generateOTP");
const hashPassword_1 = require("../utils/hashPassword");
const generateHTMLVerifyOTP = (data) => {
    const { firstName, lastName, otpCode } = data;
    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực tài khoản</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 20px;
            font-size: 16px;
            line-height: 1.6;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            padding: 10px;
            border: 2px solid #4CAF50;
            border-radius: 5px;
            background-color: #f1f1f1;
        }
        .footer {
            background-color: #f1f1f1;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h2>Xác thực tài khoản của bạn</h2>
        </div>
        <div class="email-body">
            <p>Kính gửi ${lastName} ${firstName},</p>
            <p>Chúng tôi đã nhận được yêu cầu xác thực tài khoản từ bạn. Để hoàn tất quy trình xác thực, vui lòng nhập mã OTP (One-Time Password) dưới đây vào hệ thống của chúng tôi:</p>
            
            <div class="otp-code">
                ${otpCode}
            </div>

            <p>Lưu ý: Mã OTP này có hiệu lực trong vòng 5 phút kể từ thời điểm bạn nhận được email này. Nếu bạn không yêu cầu mã OTP, vui lòng bỏ qua email này.</p>

            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        </div>
        <div class="footer">
            <p>Trân trọng,</p>
            <p>Admin: ${environment_1.env.ADMIN_EMAIL_ADDRESS}</p>
            <p>Clicon</p>
            <p>Số điện thoại: 0377-813-805</p>
            <p><em>Đây là email tự động, vui lòng không trả lời trực tiếp vào email này.</em></p>
        </div>
    </div>
</body>
</html>
`;
    return html;
};
/**
 * @param reqBody
 * Check email had been registered or not
 * If not then send OTP to email -> User send OTP to server -> Check OTP
 * -> Invalid -> Register failed (isActive: false) (default)
 * -> Valid -> Register success (isActive: true)
 */
const register = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = reqBody;
        // Check email
        const userExist = yield userModel_1.default.findOne({ email });
        if (userExist !== null) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email had already been used');
        }
        // Hash password
        const passwordHashed = yield (0, hashPassword_1.hashPassword)(password);
        // Create new account with isActive = fasle
        const roleDefault = yield roleModel_1.default.findOne({ name: role_1.ROLES.CUSTOMER });
        const createData = Object.assign(Object.assign({}, reqBody), { password: passwordHashed, role: roleDefault === null || roleDefault === void 0 ? void 0 : roleDefault._id });
        const createdUser = yield userModel_1.default.create(createData);
        if (createdUser._id) {
            // Generate OTP
            const otpCode = (0, generateOTP_1.generateOTP)(6);
            const otpExpires = Date.now() + datetime_1.OTP_TIME_EXPIRES;
            const htmlContent = generateHTMLVerifyOTP({
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
                otpCode
            });
            // Send email
            const emailData = {
                email: createdUser.email,
                subject: 'Xác thực tài khoản đã đăng ký tại Clicon',
                content: htmlContent
            };
            const mailRes = yield mailService_1.default.sendMail(emailData);
            // Save OTP to db
            createdUser.otpCode = otpCode;
            createdUser.otpExpires = otpExpires;
            yield createdUser.save();
            const _a = createdUser.toObject(), { password: _password, otpCode: _otpCode } = _a, resData = __rest(_a, ["password", "otpCode"]);
            if (mailRes.statusCode === http_status_codes_1.StatusCodes.OK) {
                return {
                    statusCode: http_status_codes_1.StatusCodes.OK,
                    message: 'OTP had been sent to your email. Please check your email.'
                };
            }
        }
    }
    catch (error) {
        throw error;
    }
});
/**
 * @param reqBody
 * Check OTP valid
 * Case 1: Invalid (If current time larger than otp time expires or otp not same)
 * Case 2: Valid (If current time less than otp time expires and otp same)
 */
const verifyOTP = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otpCode } = reqBody;
        // Find user
        const userExist = yield userModel_1.default.findOne({ otpCode });
        if (!userExist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'OTP code invalid.');
        }
        // Compare OTP code
        if (otpCode !== userExist.otpCode) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'OTP code invalid.');
        }
        // Check otp time expires
        if (Date.now() > userExist.otpExpires) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.REQUEST_TIMEOUT, 'OTP expired.');
        }
        // Change staus isActive to true
        userExist.isActive = true;
        // Delete otpCode & otpExpires
        userExist.otpCode = undefined;
        userExist.otpExpires = undefined;
        yield userExist.save();
        const _a = userExist.toObject(), { password: _password, otpCode: _otpCode } = _a, resData = __rest(_a, ["password", "otpCode"]);
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Verify otp is successfully.'
            // data: resData
        };
    }
    catch (error) {
        throw error;
    }
});
const login = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = reqBody;
    try {
        const userExist = yield userModel_1.default.findOne({ email, _destroy: false });
        if (!userExist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found.');
        }
        if (!userExist.isActive) {
            // Send OTP
            const otpCode = (0, generateOTP_1.generateOTP)(6);
            const otpExpires = Date.now() + datetime_1.OTP_TIME_EXPIRES;
            // Save otp to db
            userExist.otpCode = otpCode;
            userExist.otpExpires = otpExpires;
            yield userExist.save();
            // Send email
            const htmlContent = generateHTMLVerifyOTP({
                firstName: userExist.firstName,
                lastName: userExist.lastName,
                otpCode
            });
            const emailRes = yield mailService_1.default.sendMail({
                email: userExist.email,
                content: htmlContent,
                subject: 'Xác thực đăng ký tài khoản tại Clicon'
            });
            if (emailRes.statusCode === http_status_codes_1.StatusCodes.OK) {
                return {
                    statusCode: http_status_codes_1.StatusCodes.OK,
                    message: 'OTP code had been sent to your email address.'
                };
            }
        }
        // User actived
        const isCorrectPassword = yield (0, hashPassword_1.comparePassword)(password, userExist.password);
        if (!isCorrectPassword) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is not correct.');
        }
        // Generate token
        const accessToken = jsonwebtoken_1.default.sign({ email, role: userExist.role, uid: userExist._id }, environment_1.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: environment_1.env.ACCESS_TOKEN_EXPIRES_TIME
        });
        const refreshToken = jsonwebtoken_1.default.sign({ email, uid: userExist._id }, environment_1.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: environment_1.env.REFRESH_TOKEN_EXPIRES_TIME
        });
        userExist.refreshToken = refreshToken;
        yield userExist.save();
        const loginRes = {
            accessToken,
            refreshToken
        };
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Login is successfully.',
            data: loginRes
        };
    }
    catch (error) {
        throw error;
    }
});
const refreshToken = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = reqBody;
        const userExist = yield userModel_1.default.findOne({ refreshToken });
        if (!userExist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid token');
        }
        // Verify token
        userExist.refreshToken &&
            jsonwebtoken_1.default.verify(userExist.refreshToken, environment_1.env.REFRESH_TOKEN_SECRET_KEY);
        // Generate new token
        const newAccessToken = jsonwebtoken_1.default.sign({ email: userExist.email, role: userExist.role, uid: userExist._id }, environment_1.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: environment_1.env.ACCESS_TOKEN_EXPIRES_TIME
        });
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Refresh token is successfully.',
            data: {
                accessToken: newAccessToken,
                refreshToken
            }
        };
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Token expired.');
        }
        throw error;
    }
});
const logout = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, refreshToken } = reqBody;
    try {
        const userExist = yield userModel_1.default.findOne({ _id, refreshToken });
        if (!userExist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid refresh token.');
        }
        userExist.refreshToken = undefined;
        yield userExist.save();
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Logout is successfully.'
        };
    }
    catch (error) {
        throw error;
    }
});
const getProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield userModel_1.default.findById(userId)
            .select('-password -refreshToken')
            .populate('role', 'name');
        if (!profile) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Not found.');
        }
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Get profile is successfully.',
            data: profile
        };
    }
    catch (error) {
        throw error;
    }
});
// Export services
const authService = {
    register,
    verifyOTP,
    login,
    refreshToken,
    logout,
    getProfile
};
exports.default = authService;
