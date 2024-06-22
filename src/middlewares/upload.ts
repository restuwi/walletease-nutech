import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import handleResponse from "../helpers/handleResponse";
import { ValidationError } from "../errors/ValidationError";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new ValidationError("Format image tidak sesuai"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

export const uploadMiddleware = (fieldname: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(`Uploading field: ${fieldname}`);

    const singleUpload = upload.single(fieldname);
    singleUpload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return handleResponse(res, 102, 400, "File terlalu besar", null);
          }
          return handleResponse(res, 102, 400, err.message, null);
        } else if (err instanceof ValidationError) {
          return handleResponse(res, 102, 400, err.message, null);
        }
        return handleResponse(
          res,
          102,
          400,
          "Terjadi kesalahan saat mengunggah file",
          null
        );
      }

      if (!req.file) {
        return handleResponse(
          res,
          102,
          400,
          "Tidak ada file yang diunggah",
          null
        );
      }

      next();
    });
  };
};
