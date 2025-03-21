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
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = yield permissionModel_1.default.find();
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Get all permissions are successfully.',
            data: permissions
        };
    }
    catch (error) {
        throw error;
    }
});
const getList = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = '1', limit = '10', sort = 'asc', sortBy = 'createdAt' } = query || {};
    const queries = {
        _destroy: false
    };
    const options = {
        skip: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
        sort: { [sortBy]: sort }
    };
    const permissions = yield permissionModel_1.default.find(queries, null, options);
    const total = yield permissionModel_1.default.countDocuments({});
    const currentPage = Number(page);
    const totalPages = Math.ceil(Number(total / Number(limit)));
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Get permissions are successfully.',
        data: {
            permissions,
            pagination: {
                currentPage,
                total,
                totalPages,
                limit: Number(limit)
            }
        }
    };
});
const edit = (id, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editedPermission = yield permissionModel_1.default.findByIdAndUpdate(id, reqBody, {
            new: true
        });
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Edited permission is successfully.',
            data: editedPermission
        };
    }
    catch (error) {
        throw error;
    }
});
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPermission = yield permissionModel_1.default.findByIdAndDelete(id);
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: `Deleted permission is successfully.`,
            data: deletedPermission
        };
    }
    catch (error) {
        throw error;
    }
});
const permissionService = {
    addNew,
    getAll,
    getList,
    edit,
    deleteById
};
exports.default = permissionService;
