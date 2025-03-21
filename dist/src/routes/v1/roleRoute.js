"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleController_1 = __importDefault(require("../../controllers/roleController"));
const roleValidation_1 = __importDefault(require("../../validations/roleValidation"));
const router = express_1.default.Router();
router.get('/get-all-role', roleController_1.default.getAll);
router.get('/get-roles', roleController_1.default.getRoles);
router.post('/add-role', roleValidation_1.default.addNew, roleController_1.default.addNew);
router.put('/edit-role/:id', roleValidation_1.default.edit, roleController_1.default.editById);
router.delete('/delete-role/:id', roleController_1.default.deleteRoleById);
exports.default = router;
