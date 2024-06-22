/*
  Warnings:

  - You are about to drop the column `amount` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoice_number]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoice_number` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "amount",
ADD COLUMN     "invoice_number" TEXT NOT NULL,
ADD COLUMN     "total_amount" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_invoice_number_key" ON "transactions"("invoice_number");
