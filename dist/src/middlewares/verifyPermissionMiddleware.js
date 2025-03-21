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
const baseURL_1 = require("../constants/baseURL");
const path_1 = require("../constants/path");
const permissionModel_1 = __importDefault(require("../models/permissionModel"));
const roleModel_1 = __importDefault(require("../models/roleModel"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const verifyPermissionMiddleware = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let baseUrl = req.path;
        // If path is public api then run next(). Don't check token is sent on header request
        const isPubicPath = [...path_1.AUTH_PATHS, ...path_1.PUBLIC_PATHS].includes(baseUrl.split(baseURL_1.BASE_URL_API_ENDPOINT)[1]);
        if (isPubicPath) {
            return next();
        }
        // Kiểm tra phần cuối của URL có phải là một ObjectId (24 ký tự hex)
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;
        // Kiểm tra nếu phần cuối của URL là một ObjectId, loại bỏ phần ID (ví dụ: /roles/edit-role/60c72b2f9f1b2c001fbb04f8 -> /roles/edit-role)
        const pathParts = req.path.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (objectIdPattern.test(lastPart)) {
            // Nếu phần cuối của URL là ObjectId, loại bỏ nó
            baseUrl = req.path.replace(`/${lastPart}`, ''); // Loại bỏ phần ID ObjectId
        }
        const roleInfo = yield roleModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.role);
        const permissionIds = (roleInfo === null || roleInfo === void 0 ? void 0 : roleInfo.permissions) || [];
        const listPermission = yield permissionModel_1.default.find({
            _id: { $in: permissionIds }
        });
        if (listPermission.length > 0 &&
            listPermission.some((el) => el.url.includes(baseUrl.split(baseURL_1.BASE_URL_API_ENDPOINT)[1]))) {
            return next();
        }
        else {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Cannot access this resource.');
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = verifyPermissionMiddleware;
