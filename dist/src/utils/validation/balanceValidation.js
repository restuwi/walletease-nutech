"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.balanceValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.balanceValidation = joi_1.default.object({
    top_up_amount: joi_1.default.number().min(1).required().messages({
        "number.min": "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        "number.base": "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
    }),
});
