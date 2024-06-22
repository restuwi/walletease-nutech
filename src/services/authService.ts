import db from "../db";
import { IUserLogin, IUserRegistration } from "../dtos/auth.dto";
import { ValidationError } from "../errors/ValidationError";
import { encryptPass, comparePass, generateToken } from "../helpers/encrypt";
import {
  loginValidation,
  registerValidation,
} from "../utils/validation/authValidation";

export const register = async (payload: IUserRegistration) => {
  const { error, value } = registerValidation.validate(payload);
  if (error) {
    throw new ValidationError(
      error.details.map((detail) => detail.message).join(", ")
    );
  }

  const existingUser: IUserRegistration[] = await db.$queryRaw`
          SELECT * FROM "users" WHERE email = ${value.email}
          `;

  if (existingUser && existingUser.length > 0) {
    throw new ValidationError("Email sudah digunakan");
  }

  const hashedPassword = await encryptPass(value.password);

  const newUser: IUserRegistration[] = await db.$queryRaw`
  INSERT INTO "users" (first_name, last_name, email, password)
  VALUES (${value.first_name}, ${value.last_name}, ${value.email}, ${hashedPassword})
  RETURNING *
`;

  if (newUser && newUser.length === 0) {
    throw new Error("Gagal membuat pengguna baru");
  }

  await db.$queryRaw` INSERT INTO "profiles" ("user_id") VALUES (${newUser[0].id})`;
  await db.$queryRaw` INSERT INTO "balances" ("user_id", "amount") VALUES (${newUser[0].id}, 0)`;

  return newUser[0];
};

export const login = async (payload: IUserLogin) => {
  const { error, value } = loginValidation.validate(payload);
  if (error) {
    throw new ValidationError(
      error.details.map((detail) => detail.message).join(", ")
    );
  }

  const existingUser: IUserLogin[] = await db.$queryRaw`
          SELECT * FROM "users" WHERE email = ${value.email}
          `;

  if (existingUser.length === 0) {
    throw new Error("Username atau password salah");
  }

  const isMatch = await comparePass(value.password, existingUser[0].password);

  if (!isMatch) {
    throw new Error("Username atau password salah");
  }

  const token = generateToken({ email: existingUser[0].email });

  return token;
};
