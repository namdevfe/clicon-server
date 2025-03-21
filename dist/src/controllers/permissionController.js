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
const permissionService_1 = __importDefault(require("../services/permissionService"));
const addNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdPermission = yield permissionService_1.default.addNew(req.body);
        res.status(createdPermission.statusCode).json(createdPermission);
    }
    catch (error) {
        next(error);
    }
});
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield permissionService_1.default.getAll();
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
const getList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    try {
        const response = yield permissionService_1.default.getList(query);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
const edit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const editedPermission = yield permissionService_1.default.edit(id, req.body);
        res.status(editedPermission.statusCode).json(editedPermission);
    }
    catch (error) {
        next(error);
    }
});
const deleteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedPermission = yield permissionService_1.default.deleteById(id);
        res.status(deletedPermission.statusCode).json(deletedPermission);
    }
    catch (error) {
        next(error);
    }
});
const permissionController = {
    addNew,
    getAll,
    getList,
    edit,
    deleteById
};
exports.default = permissionController;
