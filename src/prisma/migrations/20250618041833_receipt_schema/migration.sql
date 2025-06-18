-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED', 'OBSERVED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RUC', 'DNI');

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "igv" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "reasonObservation" TEXT,
    "status" "ReceiptStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);
