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
const authService_1 = __importDefault(require("../services/authService"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield authService_1.default.register(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json(response);
    }
    catch (error) {
        next(error);
    }
});
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield authService_1.default.verifyOTP(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        next(error);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedIn = yield authService_1.default.login(req.body);
        res.status(loggedIn.statusCode).json(loggedIn);
    }
    catch (error) {
        next(error);
    }
});
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield authService_1.default.refreshToken(req.body);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        const profile = yield authService_1.default.getProfile(user.uid);
        res.status(profile.statusCode).json(profile);
    }
    catch (error) {
        next(error);
    }
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield authService_1.default.logout(req.body);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
const authController = {
    register,
    verifyOTP,
    login,
    refreshToken,
    getProfile,
    logout
};
exports.default = authController;
