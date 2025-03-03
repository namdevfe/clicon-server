"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissionController_1 = __importDefault(require("../../controllers/permissionController"));
const permissionValidation_1 = __importDefault(require("../../validations/permissionValidation"));
const router = express_1.default.Router();
router.post('/add-permission', permissionValidation_1.default.addNew, permissionController_1.default.addNew);
exports.default = router;
