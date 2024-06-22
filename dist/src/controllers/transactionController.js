"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getTransactions = exports.createTransaction = exports.updateBalance = exports.getBalance = void 0;
const transactionService = __importStar(require("../services/transactionService"));
const handleResponse_1 = __importDefault(require("../helpers/handleResponse"));
const balanceValidation_1 = require("../utils/validation/balanceValidation");
const ValidationError_1 = require("../errors/ValidationError");
const getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield transactionService.getBalance(res.locals.email);
        return (0, handleResponse_1.default)(res, 0, 200, "Sukses", response);
    }
    catch (error) {
        return (0, handleResponse_1.default)(res, 101, 500, "Internal server error", null);
    }
});
exports.getBalance = getBalance;
const updateBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { top_up_amount } = req.body;
        const { error, value } = balanceValidation_1.balanceValidation.validate({ top_up_amount });
        if (error) {
            return (0, handleResponse_1.default)(res, 102, 400, error.details[0].message, null);
        }
        const response = yield transactionService.updateBalance(res.locals.email, value.top_up_amount);
        return (0, handleResponse_1.default)(res, 0, 200, "Sukses", response);
    }
    catch (error) {
        return (0, handleResponse_1.default)(res, 101, 500, "Internal server error", null);
    }
});
exports.updateBalance = updateBalance;
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { service_code } = req.body;
        const response = yield transactionService.createTransaction(res.locals.email, service_code);
        return (0, handleResponse_1.default)(res, 0, 200, "Transaksi berhasil", response);
    }
    catch (error) {
        const err = error;
        if (err instanceof ValidationError_1.ValidationError) {
            return (0, handleResponse_1.default)(res, 102, 400, err.message, null);
        }
        return (0, handleResponse_1.default)(res, 101, 500, "Internal server error", null);
    }
});
exports.createTransaction = createTransaction;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;
        const response = yield transactionService.getTransactions(res.locals.email, limit, offset);
        return (0, handleResponse_1.default)(res, 0, 200, "Get History Berhasil", response);
    }
    catch (error) {
        return (0, handleResponse_1.default)(res, 101, 500, "Internal server error", null);
    }
});
exports.getTransactions = getTransactions;
