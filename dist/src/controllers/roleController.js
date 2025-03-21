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
const roleService_1 = __importDefault(require("../services/roleService"));
const addNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addedRole = yield roleService_1.default.addNew(req.body);
        res.status(addedRole.statusCode).json(addedRole);
    }
    catch (error) {
        next(error);
    }
});
const editById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const editedRole = yield roleService_1.default.editById(id, req.body);
        res.status(editedRole.statusCode).json(editedRole);
    }
    catch (error) {
        next(error);
    }
});
const getRoles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    try {
        const response = yield roleService_1.default.getRoles(query);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield roleService_1.default.getAll();
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
const deleteRoleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = yield roleService_1.default.deleteRoleById(id);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        next(error);
    }
});
const roleController = {
    addNew,
    editById,
    getRoles,
    getAll,
    deleteRoleById
};
exports.default = roleController;
