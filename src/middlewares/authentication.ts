import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../helpers/handleResponse";

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return handleResponse(
      res,
      108,
      401,
      "Token tidak tidak valid atau kadaluwarsa",
      null
    );
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return handleResponse(
        res,
        108,
        401,
        "Token tidak tidak valid atau kadaluwarsa",
        null
      );
    }
    const { email } = user as { email: string };
    res.locals.email = email;
    next();
  });
};
