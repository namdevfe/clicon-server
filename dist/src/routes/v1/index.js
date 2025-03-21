"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandlerMiddleware_1 = __importDefault(require("../../middlewares/errorHandlerMiddleware"));
const authRoute_1 = __importDefault(require("./authRoute"));
const permissionRoute_1 = __importDefault(require("./permissionRoute"));
const roleRoute_1 = __importDefault(require("./roleRoute"));
// import userRoutes from './userRoute'
const verifyTokenMiddleware_1 = __importDefault(require("../../middlewares/verifyTokenMiddleware"));
const baseURL_1 = require("../../constants/baseURL");
const verifyPermissionMiddleware_1 = __importDefault(require("../../middlewares/verifyPermissionMiddleware"));
const APIs_V1 = (app) => {
    app.all('*', verifyTokenMiddleware_1.default, verifyPermissionMiddleware_1.default);
    app.use(`${baseURL_1.BASE_URL_API_ENDPOINT}/auth`, authRoute_1.default);
    app.use(`${baseURL_1.BASE_URL_API_ENDPOINT}/permissions`, permissionRoute_1.default);
    app.use(`${baseURL_1.BASE_URL_API_ENDPOINT}/roles`, roleRoute_1.default);
    // app.use(`${BASE_URL_API_ENDPOINT}/users`, userRoutes)
    app.use(errorHandlerMiddleware_1.default);
};
exports.default = APIs_V1;
