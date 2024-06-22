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
exports.getTransactions = exports.createTransaction = exports.updateBalance = exports.getBalance = void 0;
const db_1 = __importDefault(require("../db"));
const ValidationError_1 = require("../errors/ValidationError");
const generateInvoice_1 = __importDefault(require("../helpers/generateInvoice"));
const getBalance = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const balance = yield db_1.default.$queryRaw `
    SELECT amount 
    FROM balances 
    WHERE "user_id" = (SELECT id FROM users WHERE email = ${email})`;
    return {
        balance: balance[0].amount,
    };
});
exports.getBalance = getBalance;
const updateBalance = (email, top_up_amount) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.$queryRaw `
    SELECT id FROM "users" WHERE email = ${email}
  `;
    if (user.length === 0) {
        throw new Error(`User with email ${email} not found`);
    }
    const userId = user[0].id;
    const invoiceNumber = (0, generateInvoice_1.default)();
    yield db_1.default.$queryRaw `
    INSERT INTO transactions
    ("user_id", "service_code", "invoice_number", "total_amount", "transaction_type", "description") 
    VALUES 
    (${userId}, 'TOPUP', ${invoiceNumber}, ${top_up_amount}, 'TOPUP', 'Top Up Balance')
  `;
    yield db_1.default.$queryRaw `
    UPDATE balances
    SET amount = amount + ${top_up_amount}
    WHERE "user_id" = ${userId}
  `;
    return yield db_1.default.$queryRaw `
    SELECT amount FROM balances WHERE user_id = ${userId}
  `;
});
exports.updateBalance = updateBalance;
const createTransaction = (email, service_code) => __awaiter(void 0, void 0, void 0, function* () {
    const userBalance = yield (0, exports.getBalance)(email);
    const service = yield db_1.default.$queryRaw `SELECT * FROM services WHERE service_code = ${service_code}`;
    if (service.length === 0) {
        throw new ValidationError_1.ValidationError("Service atau Layanan tidak ditemukan");
    }
    if (userBalance.balance < service[0].service_tarif) {
        throw new ValidationError_1.ValidationError("Saldo anda tidak mencukupi");
    }
    const invoiceNumber = (0, generateInvoice_1.default)();
    const [newTransaction] = yield db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.$queryRaw `
      INSERT INTO transactions 
      ("user_id", "service_code", "invoice_number", "total_amount", "transaction_type", "description") 
      VALUES 
      ((SELECT id FROM users WHERE email = ${email}), 
      ${service_code}, ${invoiceNumber}, ${service[0].service_tarif}, 'PAYMENT', ${service[0].service_name})
    `;
        yield tx.$queryRaw `
      UPDATE balances
      SET amount = amount - ${service[0].service_tarif}
      WHERE "user_id" = (SELECT id FROM users WHERE email = ${email}) 
      RETURNING *
    `;
        const transaction = yield tx.$queryRaw `
    SELECT t.invoice_number, s.service_code, s.service_name, t.transaction_type, t.total_amount, t.created_at AS created_on
    FROM transactions t 
    INNER JOIN services s ON t.service_code = s.service_code 
    WHERE t.invoice_number = ${invoiceNumber}
  `;
        return transaction;
    }));
    return newTransaction;
});
exports.createTransaction = createTransaction;
const getTransactions = (email, limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate limit and offset values
    if (limit <= 0) {
        throw new ValidationError_1.ValidationError("Limit harus lebih besar dari 0");
    }
    if (offset < 0) {
        throw new ValidationError_1.ValidationError("Offset tidak boleh negatif");
    }
    // Fetch user ID from the email
    const userIdResult = yield db_1.default.$queryRaw `
    SELECT id FROM users WHERE email = ${email}
  `;
    if (userIdResult.length === 0) {
        throw new ValidationError_1.ValidationError("Pengguna tidak ditemukan");
    }
    const userId = userIdResult[0].id;
    // Fetch transactions with pagination
    const transactions = yield db_1.default.$queryRaw `
    SELECT t.invoice_number, t.transaction_type, description, 
           t.total_amount, t.created_at AS created_on
    FROM transactions t 
    INNER JOIN services s ON t.service_code = s.service_code 
    WHERE t.user_id = ${userId}
    LIMIT ${limit} OFFSET ${offset}
  `;
    return transactions;
});
exports.getTransactions = getTransactions;
