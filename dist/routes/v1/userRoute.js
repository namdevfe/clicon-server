"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../../controllers/userController"));
const userValidation_1 = __importDefault(require("../../validations/userValidation"));
const router = express_1.default.Router();
router.post('/register', userValidation_1.default.register, userController_1.default.register);
exports.default = router;
