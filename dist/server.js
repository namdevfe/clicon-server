"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const environment_1 = require("./config/environment");
const mongodb_1 = __importDefault(require("./config/mongodb"));
const v1_1 = __importDefault(require("./routes/v1"));
const cors_2 = require("./config/cors");
const START_SERVER = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const APP_PORT = environment_1.env.APP_PORT;
    const APP_HOSTNAME = environment_1.env.APP_HOSTNAME;
    // For enable cors
    app.use((0, cors_1.default)(cors_2.corsOptions));
    // For parsing application/json
    app.use(express_1.default.json());
    // For parsing application/x-www-form-urlencoded
    app.use(express_1.default.urlencoded({ extended: true }));
    yield (0, mongodb_1.default)();
    (0, v1_1.default)(app);
    app.listen(APP_PORT, APP_HOSTNAME, () => {
        console.log(`Server is running on http://${APP_HOSTNAME}:${APP_PORT}`);
    });
});
START_SERVER();
