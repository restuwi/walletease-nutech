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
exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../db"));
const ValidationError_1 = require("../errors/ValidationError");
const encrypt_1 = require("../helpers/encrypt");
const authValidation_1 = require("../utils/validation/authValidation");
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = authValidation_1.registerValidation.validate(payload);
    if (error) {
        throw new ValidationError_1.ValidationError(error.details.map((detail) => detail.message).join(", "));
    }
    const existingUser = yield db_1.default.$queryRaw `
          SELECT * FROM "users" WHERE email = ${value.email}
          `;
    if (existingUser && existingUser.length > 0) {
        throw new ValidationError_1.ValidationError("Email sudah digunakan");
    }
    const hashedPassword = yield (0, encrypt_1.encryptPass)(value.password);
    const newUser = yield db_1.default.$queryRaw `
  INSERT INTO "users" (first_name, last_name, email, password)
  VALUES (${value.first_name}, ${value.last_name}, ${value.email}, ${hashedPassword})
  RETURNING *
`;
    if (newUser && newUser.length === 0) {
        throw new Error("Gagal membuat pengguna baru");
    }
    yield db_1.default.$queryRaw ` INSERT INTO "profiles" ("user_id") VALUES (${newUser[0].id})`;
    yield db_1.default.$queryRaw ` INSERT INTO "balances" ("user_id", "amount") VALUES (${newUser[0].id}, 0)`;
    return newUser[0];
});
exports.register = register;
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = authValidation_1.loginValidation.validate(payload);
    if (error) {
        throw new ValidationError_1.ValidationError(error.details.map((detail) => detail.message).join(", "));
    }
    const existingUser = yield db_1.default.$queryRaw `
          SELECT * FROM "users" WHERE email = ${value.email}
          `;
    if (existingUser.length === 0) {
        throw new Error("Username atau password salah");
    }
    const isMatch = yield (0, encrypt_1.comparePass)(value.password, existingUser[0].password);
    if (!isMatch) {
        throw new Error("Username atau password salah");
    }
    const token = (0, encrypt_1.generateToken)({ email: existingUser[0].email });
    return token;
});
exports.login = login;
