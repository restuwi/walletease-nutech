import { Request, Response } from "express";
import * as transactionService from "../services/transactionService";
import handleResponse from "../helpers/handleResponse";
import { balanceValidation } from "../utils/validation/balanceValidation";
import { ValidationError } from "../errors/ValidationError";

export const getBalance = async (req: Request, res: Response) => {
  try {
    const response = await transactionService.getBalance(res.locals.email);
    return handleResponse(res, 0, 200, "Sukses", response);
  } catch (error) {
    return handleResponse(res, 101, 500, "Internal server error", null);
  }
};

export const updateBalance = async (req: Request, res: Response) => {
  try {
    const { top_up_amount } = req.body;
    const { error, value } = balanceValidation.validate({ top_up_amount });

    if (error) {
      return handleResponse(res, 102, 400, error.details[0].message, null);
    }

    const response = await transactionService.updateBalance(
      res.locals.email,
      value.top_up_amount
    );
    return handleResponse(res, 0, 200, "Sukses", response);
  } catch (error) {
    return handleResponse(res, 101, 500, "Internal server error", null);
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { service_code } = req.body;
    const response = await transactionService.createTransaction(
      res.locals.email,
      service_code
    );
    return handleResponse(res, 0, 200, "Transaksi berhasil", response);
  } catch (error) {
    const err = error as Error;

    if (err instanceof ValidationError) {
      return handleResponse(res, 102, 400, err.message, null);
    }
    return handleResponse(res, 101, 500, "Internal server error", null);
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const offset = parseInt(req.query.offset as string) || 0;
    const response = await transactionService.getTransactions(
      res.locals.email,
      limit,
      offset
    );
    return handleResponse(res, 0, 200, "Get History Berhasil", response);
  } catch (error) {
    return handleResponse(res, 101, 500, "Internal server error", null);
  }
};
