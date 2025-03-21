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
const userService_1 = __importDefault(require("../services/userService"));
const getList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRes = yield userService_1.default.getList(req.query);
        res.status(usersRes.statusCode).json(usersRes);
    }
    catch (error) {
        next(error);
    }
});
const updateById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedUser = yield userService_1.default.updateById(id, req.body);
        res.status(updatedUser.statusCode).json(updatedUser);
    }
    catch (error) {
        next(error);
    }
});
const deleteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedUser = yield userService_1.default.deleteById(id);
        res.status(deletedUser.statusCode).json(deletedUser);
    }
    catch (error) {
        next(error);
    }
});
const userController = {
    getList,
    updateById,
    deleteById
};
exports.default = userController;
