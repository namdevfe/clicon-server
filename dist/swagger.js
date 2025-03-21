"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce System API Documentation',
            version: '1.0.0',
            description: 'This is the document for Ecommerce System API. It has all necessary endpoints.'
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ],
        servers: [
            {
                url: 'http://localhost:8017/api/v1',
                description: 'Development server'
            }
        ],
        tags: [
            {
                name: 'Auth',
                description: 'APIs related to user authentication as register, login'
            }
        ]
    },
    apis: ['./src/routes/v1/*.ts'] // Path to the API docs
};
exports.specs = (0, swagger_jsdoc_1.default)(options);
