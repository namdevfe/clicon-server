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
const permissionModel_1 = __importDefault(require("../models/permissionModel"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const addNew = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url } = reqBody;
        const existingPermission = yield permissionModel_1.default.findOne({ url });
        let res = null;
        if (existingPermission) {
            if (existingPermission._destroy) {
                // Remove existing permission from database
                yield permissionModel_1.default.findByIdAndDelete(existingPermission._id);
                // Add new
                const createdPermission = yield permissionModel_1.default.create(reqBody);
                res = {
                    statusCode: http_status_codes_1.StatusCodes.CREATED,
                    message: 'Add permission is successfully.',
                    data: createdPermission
                };
            }
            else {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Permission had already exist.');
            }
        }
        else {
            // Add new
            const createdPermission = yield permissionModel_1.default.create(reqBody);
            res = {
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Add permission is successfully.',
                data: createdPermission
            };
        }
        return res;
    }
    catch (error) {
        throw error;
    }
});
const permissionService = {
    addNew
};
exports.default = permissionService;
