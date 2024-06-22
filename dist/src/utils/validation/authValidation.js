"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerValidation = joi_1.default.object({
    first_name: joi_1.default.string().required(),
    last_name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Parameter email tidak sesuai format",
    }),
    password: joi_1.default.string().min(8).required().messages({
        "string.min": "Password minimal 8 karakter",
    }),
});
exports.loginValidation = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Parameter email tidak sesuai format",
    }),
    password: joi_1.default.string().min(8).required().messages({
        "string.min": "Password minimal 8 karakter",
    }),
});
