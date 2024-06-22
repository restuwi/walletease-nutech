"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUpdateValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.profileUpdateValidation = joi_1.default.object({
    email: joi_1.default.string().email().messages({
        "string.email": "Parameter email tidak sesuai format",
    }),
    first_name: joi_1.default.string(),
    last_name: joi_1.default.string(),
    profile_image: joi_1.default.string(),
});
