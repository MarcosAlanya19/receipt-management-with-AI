import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.receipt.createMany({
    data: [
      {
        companyId: 'C001',
        documentNumber: '20100011111',
        invoiceNumber: 'F001-0001',
        amount: 120.0,
        igv: 21.6,
        total: 141.6,
        issueDate: new Date('2025-06-01'),
        documentType: 'RUC',
      },
      {
        companyId: 'C002',
        documentNumber: '12345678',
        invoiceNumber: 'F001-0002',
        amount: 120.0,
        igv: 21.6,
        total: 141.6,
        issueDate: new Date('2025-06-10'),
        documentType: 'DNI',
      },
      {
        companyId: 'C003',
        documentNumber: '20100022222',
        invoiceNumber: 'F001-0003',
        amount: 120.0,
        igv: 21.6,
        total: 141.6,
        issueDate: new Date('2025-06-15'),
        documentType: 'RUC',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
