"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
exports.env = {
    APP_PORT: Number(process.env.APP_PORT),
    APP_HOSTNAME: process.env.APP_HOSTNAME,
    MONGODB_URI: process.env.MONGODB_URI,
    ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
    ACCESS_TOKEN_EXPIRES_TIME: process.env
        .ACCESS_TOKEN_EXPIRES_TIME,
    REFRESH_TOKEN_EXPIRES_TIME: process.env
        .REFRESH_TOKEN_EXPIRES_TIME,
    BUILD_MODE: process.env.BUILD_MODE,
    GOOGLE_MAILER_CLIENT_ID: process.env.GOOGLE_MAILER_CLIENT_ID,
    GOOGLE_MAILER_CLIENT_SECRET: process.env
        .GOOGLE_MAILER_CLIENT_SECRET,
    GOOGLE_MAILER_REFRESH_TOKEN: process.env
        .GOOGLE_MAILER_REFRESH_TOKEN,
    ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS
};
