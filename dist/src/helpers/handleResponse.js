"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleResponse = (res, status, code, message, data) => {
    const response = {
        status,
        message,
        data,
    };
    res.status(code).json(response);
};
exports.default = handleResponse;
