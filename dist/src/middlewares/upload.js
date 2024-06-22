"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const handleResponse_1 = __importDefault(require("../helpers/handleResponse"));
const ValidationError_1 = require("../errors/ValidationError");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            return cb(new ValidationError_1.ValidationError("Format image tidak sesuai"));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
});
const uploadMiddleware = (fieldname) => {
    return (req, res, next) => {
        console.log(`Uploading field: ${fieldname}`);
        const singleUpload = upload.single(fieldname);
        singleUpload(req, res, (err) => {
            if (err) {
                if (err instanceof multer_1.default.MulterError) {
                    if (err.code === "LIMIT_FILE_SIZE") {
                        return (0, handleResponse_1.default)(res, 102, 400, "File terlalu besar", null);
                    }
                    return (0, handleResponse_1.default)(res, 102, 400, err.message, null);
                }
                else if (err instanceof ValidationError_1.ValidationError) {
                    return (0, handleResponse_1.default)(res, 102, 400, err.message, null);
                }
                return (0, handleResponse_1.default)(res, 102, 400, "Terjadi kesalahan saat mengunggah file", null);
            }
            if (!req.file) {
                return (0, handleResponse_1.default)(res, 102, 400, "Tidak ada file yang diunggah", null);
            }
            next();
        });
    };
};
exports.uploadMiddleware = uploadMiddleware;
