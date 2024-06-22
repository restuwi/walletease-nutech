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
exports.updateProfileImage = exports.updateUserProfile = exports.getUser = void 0;
const db_1 = __importDefault(require("../db"));
const ValidationError_1 = require("../errors/ValidationError");
const profileValidation_1 = require("../utils/validation/profileValidation");
const getUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.$queryRaw `
    SELECT u.email, u.first_name, u.last_name, p.profile_image
    FROM "users" u
    INNER JOIN profiles p ON u.id = p."user_id"
    WHERE u.email = ${email};
  `;
    if (user.length === 0) {
        throw new Error("Pengguna tidak ditemukan");
    }
    return user[0];
});
exports.getUser = getUser;
const updateUserProfile = (payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = profileValidation_1.profileUpdateValidation.validate(payload);
    if (error) {
        throw new ValidationError_1.ValidationError(error.details.map((detail) => detail.message).join(", "));
    }
    // Cek keberadaan pengguna
    const existingUser = yield db_1.default.$queryRaw `
    SELECT * FROM "users" WHERE email = ${email}
  `;
    if (existingUser.length === 0) {
        throw new Error("Pengguna tidak ditemukan");
    }
    const updatedUser = yield db_1.default.$queryRaw `
    UPDATE "users"
    SET first_name = ${value.first_name}, last_name = ${value.last_name}
    WHERE email = ${existingUser[0].email}
    RETURNING *
  `;
    if (updatedUser.length === 0) {
        throw new Error("Gagal memperbarui profil");
    }
    return yield (0, exports.getUser)(email);
});
exports.updateUserProfile = updateUserProfile;
const updateProfileImage = (email, image) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.$queryRaw `
    UPDATE "profiles"
    SET profile_image = ${image}
    WHERE "user_id" = (
      SELECT id FROM users WHERE email = ${email}
    )
  `;
    return yield (0, exports.getUser)(email);
});
exports.updateProfileImage = updateProfileImage;
