import { Request, Response } from "express";
import * as authService from "../services/authService";
import handleResponse from "../helpers/handleResponse";
import { ValidationError } from "../errors/ValidationError";

export const register = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    await authService.register(body);
    return handleResponse(
      res,
      0,
      201,
      "Registrasi berhasil silahkan login",
      null
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

export const login = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const token = await authService.login(body);
    return handleResponse(res, 0, 200, "Login Sukses", { token });
  } catch (error) {
    const err = error as Error;
    console.error(err);
    if (err instanceof ValidationError) {
      return handleResponse(res, 102, 400, err.message, null);
    }

    if (err.message === "Username atau password salah") {
      return handleResponse(
        res,
        103,
        401,
        "Username atau password salah",
        null
      );
    }
  }
};
