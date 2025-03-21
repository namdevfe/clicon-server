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
const roleModel_1 = __importDefault(require("../models/roleModel"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const addNew = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = reqBody;
    try {
        const existingRole = yield roleModel_1.default.findOne({ name });
        let resData = null;
        if (existingRole) {
            if (!existingRole._destroy) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'This role has already exist.');
            }
            yield roleModel_1.default.findByIdAndDelete(existingRole._id);
            const addedRole = yield roleModel_1.default.create(reqBody);
            resData = {
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Add new role is successfully.',
                data: addedRole
            };
        }
        else {
            const addedRole = yield roleModel_1.default.create(reqBody);
            resData = {
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Add new role is successfully.',
                data: addedRole
            };
        }
        return resData;
    }
    catch (error) {
        throw error;
    }
});
const editById = (id, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    // const { name } = reqBody
    try {
        // const existingRole = await Role.findOne({ name })
        // if (existingRole) {
        //   throw new ApiError(
        //     StatusCodes.BAD_REQUEST,
        //     `Role ${name} has already exist.`
        //   )
        // }
        const editedRole = yield roleModel_1.default.findByIdAndUpdate(id, reqBody, { new: true });
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Updated role is successfully.',
            data: editedRole
        };
    }
    catch (error) {
        throw error;
    }
});
const getRoles = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = '1', limit = '10', sort = 'asc', sortBy = 'createdAt' } = query || {};
    const queries = {
        _destroy: false
    };
    const options = {
        skip: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
        sort: { [sortBy]: sort }
    };
    const roles = yield roleModel_1.default.find(queries, null, options);
    const total = yield roleModel_1.default.countDocuments({});
    const currentPage = Number(page);
    const totalPages = Math.ceil(Number(total / Number(limit)));
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Get roles are successfully.',
        data: {
            roles,
            pagination: {
                currentPage,
                total,
                totalPages,
                limit: Number(limit)
            }
        }
    };
});
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield roleModel_1.default.find();
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Get all role is successfully.',
            data: roles
        };
    }
    catch (error) {
        throw error;
    }
});
const deleteRoleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedRole = yield roleModel_1.default.findByIdAndDelete(id, { new: true });
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: `Deleted role is successfully.`,
        data: deletedRole
    };
});
const roleService = {
    addNew,
    editById,
    getRoles,
    getAll,
    deleteRoleById
};
exports.default = roleService;
