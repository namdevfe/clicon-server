"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_COLLECTION_NAME = void 0;
const mongoose_1 = require("mongoose");
const userModel_1 = require("../models/userModel");
exports.ROLE_COLLECTION_NAME = 'roles';
const roleSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    permissions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: userModel_1.USER_COLLECTION_NAME }],
    _destroy: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Role = (0, mongoose_1.model)(exports.ROLE_COLLECTION_NAME, roleSchema);
exports.default = Role;
