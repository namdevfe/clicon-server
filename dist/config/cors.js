"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const http_status_codes_1 = require("http-status-codes");
const environment_1 = require("../config/environment");
const domain_1 = require("../constants/domain");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
exports.corsOptions = {
    origin: (origin, callback) => {
        if (!origin && environment_1.env.BUILD_MODE === 'dev') {
            return callback(null, true);
        }
        if (domain_1.WHITELIST_DOMAINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`));
    },
    // Some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200,
    credentials: true
};
