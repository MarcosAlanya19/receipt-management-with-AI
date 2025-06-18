import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.receipt.createMany({
    data: [
      {
        companyId: 'C001',
        documentNumber: '20123456789',
        invoiceNumber: 'F001-1001',
        amount: 250.0,
        igv: 45.0,
        total: 295.0,
        issueDate: new Date('2025-06-01'),
        documentType: 'RUC',
      },
      {
        companyId: 'C002',
        documentNumber: '12345678',
        invoiceNumber: 'F001-1002',
        amount: 180.0,
        igv: 32.4,
        total: 212.4,
        issueDate: new Date('2025-05-05'),
        documentType: 'DNI',
      },
      {
        companyId: 'C003',
        documentNumber: '20456789012',
        invoiceNumber: 'F001-1003',
        amount: 300.0,
        igv: 54.0,
        total: 354.0,
        issueDate: new Date('2025-04-10'),
        documentType: 'RUC',
      },
      {
        companyId: 'C004',
        documentNumber: '87654321',
        invoiceNumber: 'F001-1004',
        amount: 150.0,
        igv: 27.0,
        total: 177.0,
        issueDate: new Date('2025-03-12'),
        documentType: 'DNI',
      },
      {
        companyId: 'C005',
        documentNumber: '20456789012',
        invoiceNumber: 'F001-1005',
        amount: 500.0,
        igv: 90.0,
        total: 590.0,
        issueDate: new Date('2025-03-18'),
        documentType: 'RUC',
      },
    ],
  })

  console.log('Comprobantes creados correctamente.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error creando Comprobantes:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
