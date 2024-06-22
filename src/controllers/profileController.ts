import { Request, Response } from "express";
import * as profileService from "../services/profileService";
import handleResponse from "../helpers/handleResponse";
import { ValidationError } from "../errors/ValidationError";

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await profileService.getUser(res.locals.email);
    return handleResponse(res, 0, 200, "Sukses", user);
  } catch (error) {
    return handleResponse(res, 101, 500, "Internal server error", null);
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const response = await profileService.updateUserProfile(
      body,
      res.locals.email
    );
    return handleResponse(res, 0, 200, "Sukses", response);
  } catch (error) {
    return handleResponse(res, 101, 500, "Internal server error", null);
  }
};

export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    console.log(req.file);

    if (!req.file) {
      return handleResponse(res, 102, 400, "File tidak ditemukan", null);
    }

    const profileImagePath = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    const response = await profileService.updateProfileImage(
      res.locals.email,
      profileImagePath
    );

    return handleResponse(
      res,
      0,
      200,
      "Update Profile Image berhasil",
      response
    );
  } catch (error) {
    const err = error as Error;
    console.error(err);

    if (err instanceof ValidationError) {
      return handleResponse(res, 102, 400, err.message, null);
    }

    return handleResponse(res, 101, 500, "Internal server error", null);
  }
};
