"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandlerMiddleware_1 = __importDefault(require("../../middlewares/errorHandlerMiddleware"));
const authRoute_1 = __importDefault(require("./authRoute"));
const permissionRoute_1 = __importDefault(require("./permissionRoute"));
const BASE_URL_API_ENDPOINT = '/api/v1';
const APIs_V1 = (app) => {
    app.use(`${BASE_URL_API_ENDPOINT}/auth`, authRoute_1.default);
    app.use(`${BASE_URL_API_ENDPOINT}/permissions`, permissionRoute_1.default);
    app.use(errorHandlerMiddleware_1.default);
};
exports.default = APIs_V1;
