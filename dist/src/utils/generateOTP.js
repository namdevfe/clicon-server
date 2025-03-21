"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.DEFAULT_OTP_RANGE = exports.NUMBERS = void 0;
exports.NUMBERS = '0123456789';
exports.DEFAULT_OTP_RANGE = 6;
const generateOTP = (range = exports.DEFAULT_OTP_RANGE) => {
    let otp = '';
    for (let i = 0; i < range; i++) {
        otp += exports.NUMBERS[Math.floor(Math.random() * 10)];
    }
    return otp;
};
exports.generateOTP = generateOTP;
