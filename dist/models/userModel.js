"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_COLLECTION_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.USER_COLLECTION_NAME = 'users';
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: [String],
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: String,
    avatar: String,
    role: { type: mongoose_1.Schema.Types.ObjectId, ref: 'roles' },
    _destroy: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const User = (0, mongoose_1.model)(exports.USER_COLLECTION_NAME, userSchema);
exports.default = User;
