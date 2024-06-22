import db from "../db";
import { IService, ITransaction } from "../dtos/transaction.dto";
import { ValidationError } from "../errors/ValidationError";
import generateInvoice from "../helpers/generateInvoice";
export const getBalance = async (email: string) => {
  const balance: { amount: number }[] = await db.$queryRaw`
    SELECT amount 
    FROM balances 
    WHERE "user_id" = (SELECT id FROM users WHERE email = ${email})`;

  return {
    balance: balance[0].amount,
  };
};

export const updateBalance = async (email: string, top_up_amount: number) => {
  const user = await db.$queryRaw<{ id: number }[]>`
    SELECT id FROM "users" WHERE email = ${email}
  `;

  if (user.length === 0) {
    throw new Error(`User with email ${email} not found`);
  }

  const userId = user[0].id;

  const invoiceNumber = generateInvoice();

  await db.$queryRaw`
    INSERT INTO transactions
    ("user_id", "service_code", "invoice_number", "total_amount", "transaction_type", "description") 
    VALUES 
    (${userId}, 'TOPUP', ${invoiceNumber}, ${top_up_amount}, 'TOPUP', 'Top Up Balance')
  `;

  await db.$queryRaw`
    UPDATE balances
    SET amount = amount + ${top_up_amount}
    WHERE "user_id" = ${userId}
  `;

  return await db.$queryRaw<{ amount: number }[]>`
    SELECT amount FROM balances WHERE user_id = ${userId}
  `;
};
export const createTransaction = async (
  email: string,
  service_code: string
) => {
  const userBalance: { balance: number } = await getBalance(email);

  const service: IService[] =
    await db.$queryRaw`SELECT * FROM services WHERE service_code = ${service_code}`;

  if (service.length === 0) {
    throw new ValidationError("Service atau Layanan tidak ditemukan");
  }

  if (userBalance.balance < service[0].service_tarif) {
    throw new ValidationError("Saldo anda tidak mencukupi");
  }

  const invoiceNumber = generateInvoice();

  const [newTransaction] = await db.$transaction(async (tx) => {
    await tx.$queryRaw`
      INSERT INTO transactions 
      ("user_id", "service_code", "invoice_number", "total_amount", "transaction_type", "description") 
      VALUES 
      ((SELECT id FROM users WHERE email = ${email}), 
      ${service_code}, ${invoiceNumber}, ${service[0].service_tarif}, 'PAYMENT', ${service[0].service_name})
    `;

    await tx.$queryRaw`
      UPDATE balances
      SET amount = amount - ${service[0].service_tarif}
      WHERE "user_id" = (SELECT id FROM users WHERE email = ${email}) 
      RETURNING *
    `;

    const transaction: ITransaction[] = await tx.$queryRaw`
    SELECT t.invoice_number, s.service_code, s.service_name, t.transaction_type, t.total_amount, t.created_at AS created_on
    FROM transactions t 
    INNER JOIN services s ON t.service_code = s.service_code 
    WHERE t.invoice_number = ${invoiceNumber}
  `;

    return transaction;
  });

  return newTransaction;
};

export const getTransactions = async (
  email: string,
  limit: number,
  offset: number
): Promise<ITransaction[]> => {
  // Validate limit and offset values
  if (limit <= 0) {
    throw new ValidationError("Limit harus lebih besar dari 0");
  }
  if (offset < 0) {
    throw new ValidationError("Offset tidak boleh negatif");
  }

  // Fetch user ID from the email
  const userIdResult: { id: number }[] = await db.$queryRaw`
    SELECT id FROM users WHERE email = ${email}
  `;

  if (userIdResult.length === 0) {
    throw new ValidationError("Pengguna tidak ditemukan");
  }

  const userId = userIdResult[0].id;

  // Fetch transactions with pagination
  const transactions: ITransaction[] = await db.$queryRaw`
    SELECT t.invoice_number, t.transaction_type, description, 
           t.total_amount, t.created_at AS created_on
    FROM transactions t 
    INNER JOIN services s ON t.service_code = s.service_code 
    WHERE t.user_id = ${userId}
    LIMIT ${limit} OFFSET ${offset}
  `;

  return transactions;
};
