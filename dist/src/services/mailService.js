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
const google_auth_library_1 = require("google-auth-library");
const http_status_codes_1 = require("http-status-codes");
const environment_1 = require("../config/environment");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email = '', subject = '', content = '' }) {
    try {
        if (!email || !subject || !content) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please provide email, subject and content');
        }
        // Khởi tạo OAuth2Client với Client ID và Client Secret
        const oauth2Client = new google_auth_library_1.OAuth2Client(environment_1.env.GOOGLE_MAILER_CLIENT_ID, environment_1.env.GOOGLE_MAILER_CLIENT_SECRET);
        // Set Refresh Token vào OAuth2Client Credentials
        oauth2Client.setCredentials({
            refresh_token: environment_1.env.GOOGLE_MAILER_REFRESH_TOKEN
        });
        /**
         * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
         * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
         */
        const acccessTokenObject = yield oauth2Client.getAccessToken();
        // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
        const accessToken = acccessTokenObject === null || acccessTokenObject === void 0 ? void 0 : acccessTokenObject.token;
        // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
        const transport = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: environment_1.env.ADMIN_EMAIL_ADDRESS,
                clientId: environment_1.env.GOOGLE_MAILER_CLIENT_ID,
                clientSecret: environment_1.env.GOOGLE_MAILER_CLIENT_SECRET,
                refresh_token: environment_1.env.GOOGLE_MAILER_REFRESH_TOKEN,
                accessToken
            }
        });
        // mailOption là những thông tin gửi từ phía client lên thông qua API
        const mailOptions = {
            to: email, // Gửi đến ai?
            subject: subject, // Tiêu đề email
            html: content // Nội dung email
        };
        // Gọi hành động gửi email
        yield transport.sendMail(mailOptions);
        // Không có lỗi gì thì trả về success
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Send mail is successfully'
        };
    }
    catch (error) {
        throw error;
    }
});
const mailService = {
    sendMail
};
exports.default = mailService;
