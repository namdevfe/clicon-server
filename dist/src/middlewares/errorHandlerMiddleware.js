"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const environment_1 = require("../config/environment");
const errorHandlerMiddleware = (error, _req, res, _next) => {
    if (!error.statusCode)
        error.statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    const responseError = {
        statusCode: error.statusCode,
        message: error.message || http_status_codes_1.StatusCodes[error.statusCode],
        stack: error.stack
    };
    if (environment_1.env.BUILD_MODE !== 'dev')
        delete responseError.stack;
    res.status(responseError.statusCode).json(responseError);
};
exports.default = errorHandlerMiddleware;
