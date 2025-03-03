"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_COLLECTION_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.PERMISSION_COLLECTION_NAME = 'permission';
const permissionSchema = new mongoose_1.Schema({
    url: { type: String, required: true, unique: true },
    description: String,
    _destroy: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Permission = (0, mongoose_1.model)(exports.PERMISSION_COLLECTION_NAME, permissionSchema);
exports.default = Permission;
