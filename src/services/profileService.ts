import db from "../db";
import { IUserProfile } from "../dtos/profile.dto";
import { ValidationError } from "../errors/ValidationError";
import { profileUpdateValidation } from "../utils/validation/profileValidation";

export const getUser = async (email: string) => {
  const user: IUserProfile[] = await db.$queryRaw`
    SELECT u.email, u.first_name, u.last_name, p.profile_image
    FROM "users" u
    INNER JOIN profiles p ON u.id = p."user_id"
    WHERE u.email = ${email};
  `;

  if (user.length === 0) {
    throw new Error("Pengguna tidak ditemukan");
  }

  return user[0];
};

export const updateUserProfile = async (
  payload: IUserProfile,
  email: string
) => {
  const { error, value } = profileUpdateValidation.validate(payload);
  if (error) {
    throw new ValidationError(
      error.details.map((detail) => detail.message).join(", ")
    );
  }

  // Cek keberadaan pengguna
  const existingUser = await db.$queryRaw<IUserProfile[]>`
    SELECT * FROM "users" WHERE email = ${email}
  `;

  if (existingUser.length === 0) {
    throw new Error("Pengguna tidak ditemukan");
  }

  const updatedUser = await db.$queryRaw<IUserProfile[]>`
    UPDATE "users"
    SET first_name = ${value.first_name}, last_name = ${value.last_name}
    WHERE email = ${existingUser[0].email}
    RETURNING *
  `;

  if (updatedUser.length === 0) {
    throw new Error("Gagal memperbarui profil");
  }

  return await getUser(email);
};

export const updateProfileImage = async (email: string, image: string) => {
  await db.$queryRaw`
    UPDATE "profiles"
    SET profile_image = ${image}
    WHERE "user_id" = (
      SELECT id FROM users WHERE email = ${email}
    )
  `;

  return await getUser(email);
};
