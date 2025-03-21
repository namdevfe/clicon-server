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
const joi_1 = __importDefault(require("joi"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const validator_1 = require("../utils/validator");
const addNew = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schemaValidation = joi_1.default.object({
        name: joi_1.default.string().required().trim().strict(),
        description: joi_1.default.string().optional().allow(''),
        permissions: joi_1.default.array().items(joi_1.default.string().pattern(validator_1.OBJECT_ID_RULE).message(validator_1.OBJECT_ID_RULE_MESSAGE))
    });
    try {
        yield schemaValidation.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        next(new ApiError_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
});
const edit = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schemaValidation = joi_1.default.object({
        name: joi_1.default.string().optional(),
        description: joi_1.default.string().optional().allow(''),
        permissions: joi_1.default.array().items(joi_1.default.string().pattern(validator_1.OBJECT_ID_RULE).message(validator_1.OBJECT_ID_RULE_MESSAGE))
    });
    try {
        yield schemaValidation.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        next(new ApiError_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
});
const roleValidation = {
    addNew,
    edit
};
exports.default = roleValidation;
