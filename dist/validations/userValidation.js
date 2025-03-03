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
const joi_1 = __importDefault(require("joi"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const correctCondition = joi_1.default.object({
        email: joi_1.default.string()
            .required()
            .email({
            minDomainSegments: 1,
            tlds: { allow: ['com'] }
        }),
        password: joi_1.default.string().required().min(6).trim().strict(),
        address: joi_1.default.array().items(joi_1.default.string().optional().allow('')),
        avatar: joi_1.default.string().optional().allow(''),
        displayName: joi_1.default.string().optional().allow(''),
        firstName: joi_1.default.string().required().trim().strict(),
        lastName: joi_1.default.string().required().trim().strict()
    });
    try {
        yield correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        next(new ApiError_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
});
const userValidation = {
    register
};
exports.default = userValidation;
